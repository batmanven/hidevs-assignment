import type { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
}

export default function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
  return (
    <div
      className={`bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  )
}
