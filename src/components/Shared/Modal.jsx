import React, { useEffect } from 'react'

export function Modal({ isOpen, onClose, title, titleAr, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const widths = { sm: '400px', md: '560px', lg: '720px', xl: '900px' }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: widths[size] || widths.md, maxHeight: '90vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px', borderRadius: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body" style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
