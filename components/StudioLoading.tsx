"use client";


const css = `
@keyframes ruvyne-studio-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ruvyne-studio-loading__mark { animation: none !important; opacity: 1 !important; }
}
`;

export default function StudioLoading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f3ec",
      }}
      role="status"
      aria-label="Loading Studio"
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <img
        src="/brand/mark.png"
        alt=""
        width={277}
        height={240}
        className="ruvyne-studio-loading__mark"
        style={{
          width: 139,
          height: 120,
          animation: "ruvyne-studio-pulse 1.8s ease-in-out infinite",
        }}
      />
    </div>
  );
}
