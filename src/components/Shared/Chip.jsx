import React from 'react'

export function Chip({ children, color = 'var(--primary-500)', className = '' }) {
  return (
    <span className={`chip ${className}`} style={{ background: `${color}18`, color, border: `1px solid ${color}30`, padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {children}
    </span>
  )
}
