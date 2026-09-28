import { buildGreeting, buildSystemPrompt } from "@/lib/ai/prompts";
import { getOpenAIClient, getVectorStoreId } from "@/lib/ai/openai";
import type { SajuData } from "@/lib/saju/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const chatSchema = z.object({
  sajuData: z.custom<SajuData>(),
  consultationType: z.enum(["basic", "love", "career"]),
  personality: z.enum(["analyst", "counselor"]),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export async function POST(request: Request) {
  try {
    const body = chatSchema.parse(await request.json());
    const client = getOpenAIClient();
    const vectorStoreId = getVectorStoreId();

    if (body.messages.length === 0) {
      const encoder = new TextEncoder();
      const greeting = buildGreeting(body.consultationType, body.personality);
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: greeting })}\n\n`));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        },
      );
    }

    const systemPrompt = buildSystemPrompt(
      body.sajuData,
      body.consultationType,
      body.personality,
    );

    const tools = vectorStoreId
      ? [{ type: "file_search" as const, vector_store_ids: [vectorStoreId] }]
      : undefined;

    const stream = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: systemPrompt,
      input: body.messages.map((m) => ({ role: m.role, content: m.content })),
      tools,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "response.output_text.delta") {
              const delta = event.delta;
              if (delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`));
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "스트리밍 오류";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "상담 요청에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
