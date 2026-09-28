"use client";

import glossary from "@/data/glossary.json";
import { TEN_GOD_KO } from "@/lib/saju/pillarMeta";

export function TenGodHint({ name }: { name: string }) {
  if (name === "日主") {
    return <span>일주</span>;
  }
  const ko = TEN_GOD_KO[name] ?? name;
  const tip = (glossary as Record<string, string>)[name];

  return (
    <span className="ten-god-hint" title={tip}>
      {ko}
      {tip ? <span className="ten-god-hint__icon"> ⓘ</span> : null}
    </span>
  );
}
