/** The theme's ambient layer — drifting plankton glow behind the app. */
export function FxLayer() {
  return <div className="tp-fx" aria-hidden="true" />
}

/** Wraps a screen in the theme's stage so the FX layer always travels with it. */
export function Stage({ children, className = '' }) {
  return (
    <div className={['tp-web-stage min-h-screen', className].filter(Boolean).join(' ')}>
      <FxLayer />
      {children}
    </div>
  )
}
