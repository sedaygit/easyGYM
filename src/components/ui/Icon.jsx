const GLYPHS = {
  play: <path d="M8 5.4v13.2L19 12z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="M13.5 6.5 20 12l-6.5 5.5" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M20 12H5" />
      <path d="M10.5 6.5 4 12l6.5 5.5" />
    </>
  ),
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3s5.5 4.2 5.5 9a5.5 5.5 0 0 1-11 0C6.5 8.7 9 6.4 9 6.4s.3 2.4 2 3.2c1.4.7 1.5-4.4 1-6.6Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4M16 3v4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5M12.5 16V7M17 16v-8" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c1.4-3.6 4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M4 9v6M7 7.5v9M17 7.5v9M20 9v6" />
      <path d="M7 12h10" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.2 2" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4.5h8v4.2a4 4 0 0 1-8 0z" />
      <path d="M8 5.6H5.2v1.6A3.2 3.2 0 0 0 8.4 10.4" />
      <path d="M16 5.6h2.8v1.6a3.2 3.2 0 0 1-3.2 3.2" />
      <path d="M12 12.7V16" />
      <path d="M8.6 19.6h6.8" />
      <path d="M10 16h4l.7 3.6H9.3z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9z" />
      <path d="M18.5 16.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z" />
    </>
  ),
  sound: (
    <>
      <path d="M4.5 9.5v5h3l4.5 3.6V5.9L7.5 9.5z" />
      <path d="M16 9.2a4 4 0 0 1 0 5.6" />
      <path d="M18.6 6.6a7.6 7.6 0 0 1 0 10.8" />
    </>
  ),
  mute: (
    <>
      <path d="M4.5 9.5v5h3l4.5 3.6V5.9L7.5 9.5z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 11v5.2" />
      <path d="M12 7.9v.2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.2 21 19.4H3z" />
      <path d="M12 10v4" />
      <path d="M12 16.7v.2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11.5a8 8 0 1 0-2.6 6.8" />
      <path d="M20 5.5v6h-6" />
    </>
  ),
  body: (
    <>
      <circle cx="12" cy="4.6" r="2.3" />
      <path d="M12 7v7" />
      <path d="M6.6 9.6 12 12l5.4-2.4" />
      <path d="M12 14 9 21M12 14l3 7" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.4 4.6L12 12.7 3.6 8.1z" />
      <path d="m4 12.6 8 4.4 8-4.4" />
      <path d="m4 16.9 8 4.4 8-4.4" />
    </>
  ),
}

export function Icon({ name, size = 20, className = '', strokeWidth = 1.6 }) {
  const glyph = GLYPHS[name]
  if (!glyph) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {glyph}
    </svg>
  )
}
