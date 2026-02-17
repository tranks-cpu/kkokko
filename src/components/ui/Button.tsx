import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-amber-500 text-stone-900 active:bg-amber-600',
  secondary: 'bg-stone-700 text-stone-100 active:bg-stone-600',
  danger: 'bg-red-600 text-white active:bg-red-700',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        min-h-[44px] min-w-[44px] px-6 py-3
        rounded-xl font-bold text-lg
        transition-colors duration-150
        disabled:opacity-40 disabled:pointer-events-none
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
