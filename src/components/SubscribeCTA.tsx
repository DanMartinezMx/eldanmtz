/** Newsletter call-to-action; posts to Buttondown (allowed by `form-action` in next.config.ts). */
export function SubscribeCTA() {
    return (
        <section className="subscribe-cta">
            <h3>📬 ¿Te gustó?</h3>
            <p>Recibe nuevos posts directo en tu correo. Sin spam, lo prometo.</p>
            <form
                action="https://buttondown.email/api/emails/embed-subscribe/eldanmtz"
                method="post"
                target="popupwindow"
                className="subscribe-form"
            >
                <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    required
                    className="subscribe-input"
                />
                <button type="submit" className="subscribe-btn">
                    Suscribirse
                </button>
            </form>
            <p className="subscribe-note">
                También puedes seguir vía <a href="/feed.xml">RSS</a>
            </p>
        </section>
    );
}