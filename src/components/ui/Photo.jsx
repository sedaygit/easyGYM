/**
 * The theme's image treatment — radius, filter, frame and an accent overlay.
 * Every photo in the app goes through here.
 */
export function Photo({ src, alt = '', className = '', rounded = 'img', children }) {
  return (
    <div
      className={['relative overflow-hidden', className].filter(Boolean).join(' ')}
      style={{
        borderRadius: rounded === 'none' ? 0 : 'var(--tp-img-r)',
        border: 'var(--tp-img-frame)',
        boxShadow: 'var(--tp-img-sh)',
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ filter: 'var(--tp-img-filter)' }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'var(--tp-grad)',
          opacity: 'var(--tp-img-overlay-op)',
          mixBlendMode: 'var(--tp-img-blend)',
        }}
      />

      {children}
    </div>
  )
}
