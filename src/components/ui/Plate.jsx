/** The one surface container: a themed glass plate with optional sections. */
export function Plate({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={['plate', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}

/** A small label above a value. */
export function PlateLabel({ children, className = '' }) {
  return <p className={['eyebrow', className].filter(Boolean).join(' ')}>{children}</p>
}

/** Sunken inner block for secondary content inside a plate. */
export function Sunken({ children, className = '', ...rest }) {
  return (
    <div className={['plate-2 p-4', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
