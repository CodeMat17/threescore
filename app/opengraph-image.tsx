import { LEGAL_NAME } from "@/lib/site";
import { ImageResponse } from "next/og";

/**
 * Brand social card, generated at build time.
 *
 * Replaces six hand-exported PNGs (200-433kb each, above the practical limit
 * for OG previews) with one generated image that nested routes inherit.
 */
export const alt = `${LEGAL_NAME} — safaris, beach escapes and international travel`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #1b1512 0%, #2e2118 55%, #6b4a17 100%)",
          color: "#fdfcfa",
          fontFamily: "sans-serif",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e8c37a",
          }}>
          Threescore Tours
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 900,
            }}>
            Unforgettable safaris, beach escapes and journeys beyond.
          </div>
          <div style={{ fontSize: 30, color: "rgba(253,252,250,0.75)" }}>
            Kenya · Tanzania · Uganda · Dubai
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(253,252,250,0.65)",
          }}>
          <span>Riara Road, Nairobi</span>
          <span style={{ color: "#e8c37a" }}>threescoretours.com</span>
        </div>
      </div>
    ),
    size
  );
}
