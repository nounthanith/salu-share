"use client";

export default function Logo() {
  return (
    <button className="font-semibold" onClick={() => window.location.reload()}>
      <span className="bg-foreground text-background rounded-sm p-0.5">Sa</span>
      <span>lu</span>
    </button>
  );
}
