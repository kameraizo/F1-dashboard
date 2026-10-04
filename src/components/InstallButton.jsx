import { useRef } from 'react'
import { useInstallPrompt, promptInstall } from '../hooks/useInstallPrompt'

function InstallButton() {
  const mode = useInstallPrompt()
  const dialogRef = useRef(null)

  if (!['prompt', 'ios', 'in-app'].includes(mode)) return null

  const handleClick = () => {
    if (mode === 'prompt') {
      promptInstall()
    } else {
      dialogRef.current?.showModal()
    }
  }

  // Clic sur le fond (en dehors du contenu) : fermeture
  const handleDialogClick = (event) => {
    if (event.target === dialogRef.current) dialogRef.current.close()
  }

  return (
    <>
      {/* Bouton = zone tactile 44 px ; __box = cadre visible (le clip-path ne rogne pas la zone cliquable) */}
      <button type="button" className="install-button" onClick={handleClick} aria-label="Installer l'app">
        <span className="install-button__box">
          <svg className="install-button__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v10M7.5 9.5 12 14l4.5-4.5M5 19.5h14" />
          </svg>
          <span className="install-button__label" aria-hidden="true">Installer l'app</span>
        </span>
      </button>

      {mode !== 'prompt' && (
        <dialog
          ref={dialogRef}
          className="install-dialog"
          aria-labelledby="install-dialog-title"
          onClick={handleDialogClick}
        >
          <div className="install-dialog__content">
            <button
              type="button"
              className="install-dialog__close"
              onClick={() => dialogRef.current.close()}
              aria-label="Fermer"
            >
              ✕
            </button>
            {mode === 'ios' ? (
              <>
                <span className="install-dialog__eyebrow">iPhone · iPad</span>
                <h2 id="install-dialog-title" className="install-dialog__title">Installer F1 Dashboard</h2>
                <ol className="install-dialog__steps" role="list">
                  <li>
                    Touchez
                    <svg className="install-dialog__share" viewBox="0 0 24 24" role="img" aria-label="Partager">
                      <path d="M12 3.5v11M8 7.5l4-4 4 4M7 11H5v9.5h14V11h-2" />
                    </svg>
                    <strong>Partager</strong> dans la barre de Safari
                  </li>
                  <li>Choisissez <strong>Sur l'écran d'accueil</strong></li>
                  <li>Validez avec <strong>Ajouter</strong></li>
                </ol>
              </>
            ) : (
              <>
                <span className="install-dialog__eyebrow">Navigateur intégré</span>
                <h2 id="install-dialog-title" className="install-dialog__title">Ouvrir dans le navigateur</h2>
                <ol className="install-dialog__steps" role="list">
                  <li>Touchez le menu <strong>⋯</strong> en haut à droite</li>
                  <li>Choisissez <strong>Ouvrir dans le navigateur</strong> (Safari ou Chrome)</li>
                  <li>Touchez à nouveau <strong>Installer l'app</strong></li>
                </ol>
              </>
            )}
          </div>
        </dialog>
      )}
    </>
  )
}

export default InstallButton
