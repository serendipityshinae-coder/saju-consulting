import Link from "next/link";

export function SiteHeader() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ fontWeight: 500, color: "var(--text)" }}>
          사주 상담소
        </Link>
        <Link href="/" style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          처음으로
        </Link>
      </div>
    </header>
  );
}
