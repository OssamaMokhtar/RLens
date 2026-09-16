import React from 'react'

const VARIANTS = {
  primary: { bg: 'var(--primary-500)', color: 'white', hoverBg: 'var(--primary-600)' },
  secondary: { bg: 'var(--bg-hover)', color: 'var(--text-primary)', hoverBg: 'var(--border-light)' },
  danger: { bg: 'var(--accent-rose)', color: 'white', hoverBg: '#d43f5e' },
  ghost: { bg: 'transparent', color: 'var(--text-secondary)', hoverBg: 'var(--bg-hover)' },
  success: { bg: 'var(--accent-emerald)', color: 'white', hoverBg: '#0d9668' },
}

export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '', ...props }) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px'
  const fontSize = size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
      style={{
        background: v.bg, color: v.color, border: 'none',
        padding, borderRadius: 'var(--radius-md)', fontSize, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--transition-fast)',
      }}
      {...props}
    >
      {children}
    </button>
  )
}
