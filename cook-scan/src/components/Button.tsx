type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  const className = variant === 'primary'
    ? 'bg-blue-500 text-white px-4 py-2 rounded'
    : 'bg-gray-200 text-gray-800 px-4 py-2 rounded'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  )
}
