import React, { useState } from 'react'

export function ScoreMeter({ score = 0, maxValue = 850, label, grade, size = 'md' }) {
  const [offset, setOffset] = useState(0)
  const radius = size === 'lg' ? 70 : 58
  const circumference = 2 * Math.PI * radius

  React.useEffect(() => {
    const percent = Math.min(Math.max(score / maxValue, 0), 1)
    const dashOffset = circumference - (percent * circumference)
    const timer = setTimeout(() => setOffset(dashOffset), 100)
    return () => clearTimeout(timer)
  }, [score, maxValue, circumference])

  let color = 'var(--accent-rose)'
  if (score >= 750) color = 'var(--accent-emerald)'
  else if (score >= 650) color = 'var(--accent-cyan)'
  else if (score >= 550) color = 'var(--accent-amber)'

  const svgSize = size === 'lg' ? 160 : 120
  const fontSize = size === 'lg' ? 36 : 28

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: `${svgSize}px`, height: `${svgSize}px`, margin: '0 auto' }}>
        <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={radius} style={{ fill: 'none', stroke: 'var(--bg-input)', strokeWidth: 10 }} />
          <circle
            cx="70" cy="70" r={radius}
            style={{
              fill: 'none',
              strokeWidth: 10,
              strokeLinecap: 'round',
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: offset || circumference,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ fontSize: `${fontSize}px`, fontWeight: 700, lineHeight: 1, color }}>{score}</div>
          {grade && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{grade}</div>}
        </div>
      </div>
      {label && <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>{label}</p>}
    </div>
  )
}
