import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stack",
    description: "Las herramientas, apps y setup que uso día a día.",
    openGraph: {
        title: "Stack — El Otro Tab",
        description: "Las herramientas, apps y setup que uso día a día.",
        url: "https://eldanmtz.com/uses",
    },
};

export default function UsesPage() {
    return (
        <div className="uses-page">
            <h1>Stack</h1>
            <p className="uses-subtitle">Las herramientas y setup que uso día a día.</p>

            <section className="uses-section">
                <h2>💻 Hardware</h2>
                <ul>
                    <li><strong>Laptop:</strong> MacBook Pro M-series</li>
                    <li><strong>Monitor:</strong> [Tu monitor]</li>
                    <li><strong>Teclado:</strong> [Tu teclado]</li>
                    <li><strong>Mouse:</strong> [Tu mouse]</li>
                    <li><strong>Audífonos:</strong> [Tus audífonos]</li>
                </ul>
            </section>

            <section className="uses-section">
                <h2>🛠️ Desarrollo</h2>
                <ul>
                    <li><strong>Editor:</strong> VS Code</li>
                    <li><strong>Terminal:</strong> [Tu terminal]</li>
                    <li><strong>Framework:</strong> Next.js</li>
                    <li><strong>CMS:</strong> TinaCMS</li>
                    <li><strong>Hosting:</strong> Vercel</li>
                    <li><strong>Dominio:</strong> Namecheap / Cloudflare</li>
                </ul>
            </section>

            <section className="uses-section">
                <h2>📱 Apps</h2>
                <ul>
                    <li><strong>Notas:</strong> [Tu app de notas]</li>
                    <li><strong>Música:</strong> Spotify</li>
                    <li><strong>Navegador:</strong> [Tu navegador]</li>
                    <li><strong>Diseño:</strong> Figma</li>
                </ul>
            </section>

            <section className="uses-section">
                <h2>🎮 Gaming</h2>
                <ul>
                    <li><strong>Consola:</strong> [Tu consola]</li>
                    <li><strong>Juego actual:</strong> Crimson Desert</li>
                </ul>
            </section>

            <section className="uses-section">
                <h2>☕ Cocina</h2>
                <ul>
                    <li><strong>Cafetera:</strong> [Tu cafetera]</li>
                    <li><strong>Cuchillo favorito:</strong> [Tu cuchillo]</li>
                </ul>
            </section>

            <p className="uses-updated">Última actualización: Junio 2026</p>
        </div>
    );
}