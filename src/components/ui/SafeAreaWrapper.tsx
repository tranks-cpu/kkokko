import type { ReactNode } from 'react'

export function SafeAreaWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        paddingTop: 'var(--sat)',
        paddingRight: 'var(--sar)',
        paddingBottom: 'var(--sab)',
        paddingLeft: 'var(--sal)',
      }}
    >
      {children}
    </div>
  )
}
