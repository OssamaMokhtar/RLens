import React from 'react'

export function Input({ label, value, onChange, placeholder, type = 'text', className = '', error, style = {}, ...props }) {
  return (
    <div style={{ ...style }}>
      {label && <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: `1px solid ${error ? 'var(--accent-rose)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', transition: 'border var(--transition-fast)' }}
        {...props}
      />
      {error && <span style={{ color: 'var(--accent-rose)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
  )
}
