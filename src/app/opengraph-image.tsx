import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "THE CAR-BAR — No waiting on your dream car";

/** Generated rather than shipped as an asset, so there is nothing to keep in sync. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 72,
          borderBottom: "14px solid #45a117",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 2, background: "#45a117" }} />
          <div
            style={{
              color: "#2f7510",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Pan-India Car Arrangement Service
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#0e1b09",
              fontSize: 92,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: -3,
              textTransform: "uppercase",
              maxWidth: 900,
            }}
          >
            No waiting on your dream car.
          </div>
          <div
            style={{
              color: "#47563f",
              fontSize: 28,
              marginTop: 28,
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            Tell us what you want. We check availability across our authorised
            seller network.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#6d7a66",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#0e1b09" }}>You</span>
          <span>→</span>
          <span style={{ color: "#2f7510" }}>THE CAR-BAR</span>
          <span>→</span>
          <span style={{ color: "#0e1b09" }}>Authorised seller</span>
        </div>
      </div>
    ),
    size,
  );
}
