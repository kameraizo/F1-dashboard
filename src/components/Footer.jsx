function Footer() {
  return (
    <footer className="pitwall-footer">
      <div className="kerb-divider" aria-hidden="true" />
      <div className="pitwall-footer__inner">
        <div className="pitwall-footer__row">
          <p className="pitwall-footer__copy">© 2026 F1 Dashboard — Tous droits réservés</p>
          <p className="pitwall-footer__credit">
            Site créé par{' '}
            <a href="#" className="pitwall-footer__link">L'Artisan Web</a>
            <span className="pitwall-footer__cta">
              {' '}· Un projet ?{' '}
              <a
                href="https://www.instagram.com/lartisanweb/"
                target="_blank"
                rel="noreferrer"
                className="pitwall-footer__link"
              >
                Contactez-moi sur Instagram
              </a>
            </span>
          </p>
        </div>
        <p className="pitwall-footer__source">
          Données pilotes, écuries et calendrier fournies par l'API{' '}
          <a
            href="https://jolpi.ca"
            target="_blank"
            rel="noreferrer"
            className="pitwall-footer__link"
          >
            Jolpica F1
          </a>{' '}
          (compatible Ergast).
        </p>
      </div>
    </footer>
  )
}

export default Footer
