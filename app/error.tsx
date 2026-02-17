"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        flexDirection: "column",
        gap: "16px",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: 600 }}>
        Something went wrong
      </h2>
      <p style={{ color: "#666", fontSize: "14px", maxWidth: "400px" }}>
        We couldn&apos;t load the restaurants. Please check your connection and
        try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "10px 24px",
          backgroundColor: "#00703a",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
