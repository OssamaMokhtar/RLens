import React from 'react'

export function Card({ children, className = '', hover, onClick, style = {} }) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', transition: 'all var(--transition-fast)', cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </div>
  )
}
