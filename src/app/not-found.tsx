import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Esa página no existe.</p>
      <Link href="/">← Volver al inicio</Link>
    </div>
  );
}
