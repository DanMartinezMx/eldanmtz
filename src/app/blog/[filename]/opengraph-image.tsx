import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const runtime = "nodejs";
export const alt = "Dan Mtz. Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { filename: string } }) {
    const { filename } = await params;
    const filePath = path.join(process.cwd(), "content/posts", `${filename}.mdx`);

    let title = "Dan Mtz.";
    let category = "";

    if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        title = data.title || title;
        category = data.category || "";
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "60px 80px",
                    backgroundColor: "#0a0a0a",
                    color: "#ffffff",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* Category tag */}
                {category && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#a0a0a0",
                                textTransform: "uppercase",
                                letterSpacing: "2px",
                            }}
                        >
                            {category}
                        </span>
                    </div>
                )}

                {/* Title */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        flex: 1,
                    }}
                >
                    <h1
                        style={{
                            fontSize: title.length > 40 ? "48px" : "64px",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            margin: 0,
                            color: "#ffffff",
                        }}
                    >
                        {title}
                    </h1>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: "28px", fontWeight: 600, color: "#e0e0e0" }}>
                        Dan Mtz
                    </span>
                    <span style={{ fontSize: "20px", color: "#666666" }}>
                        ElDanMtz.com
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}