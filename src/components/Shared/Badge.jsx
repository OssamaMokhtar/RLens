import React from 'react'

const BADGE_STYLES = {
  success: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  danger: { bg: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: 'rgba(244,63,94,0.3)' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  info: { bg: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
  primary: { bg: 'rgba(99,102,241,0.15)', color: '#6366f1', border: 'rgba(99,102,241,0.3)' },
}

export function Badge({ children, variant = 'primary', size = 'md', className = '' }) {
  const style = BADGE_STYLES[variant] || BADGE_STYLES.primary
  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 14px' : '4px 12px'
  return (
    <span className={`badge ${className}`} style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}`, padding, borderRadius: 'var(--radius-full)', fontSize: size === 'sm' ? '11px' : size === 'lg' ? '14px' : '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {children}
    </span>
  )
}
