import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "El otro Tab by Dan Martinez";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#0a0a0a",
                    color: "#ffffff",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <h1 style={{ fontSize: "80px", fontWeight: 700, margin: 0 }}>
                    El otro Tab by Dan Martinez
                </h1>
                <p style={{ fontSize: "28px", color: "#a0a0a0", marginTop: "16px" }}>
                    Lo que pasa cuando cierras la laptop. Un blog sobre tech, comida, juegos y la vida real.
                </p>
            </div>
        ),
        { ...size }
    );
}