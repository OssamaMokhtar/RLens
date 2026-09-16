import React from 'react'
import { ScoreMeter } from '../ScoreBoard/ScoreMeter'
import { WaterfallChart } from './WaterfallChart'

// === KPI Card Component ===
export function KPICard({ title, value, subtitle, icon, trend, color }) {
  return (
    <div
      className="kpi-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          <span
            className="kpi-label"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: '18px', color }}>{icon}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '4px',
          }}
        >
          <span
            className="kpi-value"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              fontFamily: 'var(--font-en)',
            }}
          >
            {value}
          </span>
          {trend && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: trend > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                background: trend > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </span>
          )}
        </div>

        {subtitle && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

// === Score Meter Card (mini, for inline use) ===
export function ScoreMeterCard({ score, label }) {
  return (
    <div
      className="score-meter-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
      }}
    >
      <ScoreMeter score={score} />
      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {score?.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

// === Mini Sparkline Chart (for tables / inline KPI) ===
export function MiniChart({ data, color = 'var(--accent-cyan)', height = 32 }) {
  if (!data || data.length < 2) return null
  const width = 80
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// === Score Distribution Histogram ===
const BIN_LABELS = Array.from({ length: 10 }, (_, i) => `${i * 100}-${(i + 1) * 100}`)

export function ScoreDistribution({ scores, bins = 10 }) {
  const counts = scores.reduce((acc, s) => {
    const bin = Math.min(bins - 1, Math.max(0, Math.floor(s / 100)))
    acc[bin] = (acc[bin] || 0) + 1
    return acc
  }, new Array(bins).fill(0))

  const maxCount = Math.max(...counts, 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {counts.map((c, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', width: '36px', textAlign: 'right' }}>
            {BIN_LABELS[index] || `${index * 100}`}
          </span>
          <div
            style={{
              flex: 1,
              height: '16px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(c / maxCount) * 100}%`,
                background: 'var(--accent-indigo)',
                borderRadius: 'var(--radius-sm)',
                transition: 'width 400ms ease-out',
              }}
            />
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', width: '20px' }}>
            {c}
          </span>
        </div>
      ))}
    </div>
  )
}

// === Gauge Chart (semicircle progress) ===
export function GaugeChart({ value = 0, max = 1000, label, color = 'var(--accent-indigo)', size = 120 }) {
  const percentage = Math.min(100, (value / max) * 100)
  const radius = size / 2 - 10
  const circumference = Math.PI * radius

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size / 2 + 10} style={{ overflow: 'visible' }}>
        {/* Background arc */}
        <path
          d={`M 10 ${(size / 2 + 10) - radius} A ${radius} ${radius} 0 0 1 ${size - 10} ${(size / 2 + 10) - radius}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M 10 ${(size / 2 + 10) - radius} A ${radius} ${radius} 0 0 1 ${size - 10} ${(size / 2 + 10) - radius}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference * (percentage / 100)} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-180deg ${size / 2} ${(size / 2 + 10) - radius})`}
          style={{ transition: 'stroke-dasharray 600ms ease-out' }}
        />
      </svg>
      {label && (
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
          {label}
        </div>
      )}
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value?.toLocaleString()}
      </div>
    </div>
  )
}

// === Correlation Matrix Heatmap ===
const CORR_LABELS = [
  'DSR',
  'LTV',
  'CashFlow',
  'EmpStab',
  'Bureau',
  'FraudRisk',
  'SectorRisk',
  'CountryRisk',
]

export function CorrelationMatrix({ data, size = 280 }) {
  const matrixData = data?.length
    ? data.map((row) =>
        CORR_LABELS.map((_, ci) => {
          const v = typeof row === 'object' && row[ci] !== undefined ? row[ci] : (ci === 0 ? row[0]?.toString() : 0)
          const num = typeof v === 'number' ? v : 0
          const abs = Math.abs(num)
          const color = num > 0.5
            ? 'var(--accent-emerald)'
            : num > 0.2
            ? 'var(--accent-amber)'
            : num < -0.5
            ? 'var(--accent-rose)'
            : num < -0.2
            ? 'var(--accent-orange)'
            : 'var(--border)'
          const textColor = abs > 0.5 ? 'white' : 'var(--text-secondary)'
          return { row: CORR_LABELS[ri], col: CORR_LABELS[ci], value: num, color, textColor }
        })
      )
    : CORR_LABELS.map((label, ri) =>
        CORR_LABELS.map((_, ci) => ({
          row: label,
          col: CORR_LABELS[ci],
          value: 0,
          color: 'var(--border)',
          textColor: 'var(--text-tertiary)',
        }))
      )

  const cellSize = size / CORR_LABELS.length

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
      {/* Column headers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ height: cellSize, width: '60px' }} />
        {CORR_LABELS.map(label => (
          <div
            key={label}
            style={{
              height: cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '4px',
              fontSize: '9px',
              color: 'var(--text-tertiary)',
              fontWeight: 600,
              transform: 'rotate(-45deg)',
              transformOrigin: 'right center',
            }}
          >
            {label}
          </div>
        ))}
      </div>
      {/* Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {matrixData.map((row, ri) => (
          <div key={row[0]?.row || Math.random()} style={{ display: 'flex', gap: '2px' }}>
            <div
              style={{
                width: '60px',
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '4px',
                fontSize: '9px',
                color: 'var(--text-tertiary)',
                fontWeight: 600,
              }}
            >
              {row[0]?.row}
            </div>
            {row.map((cell, ci) => (
              <div
                key={ci}
                style={{
                  width: cellSize - 2,
                  height: cellSize - 2,
                  background: cell.color,
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: cell.textColor,
                  fontFamily: 'var(--font-en)',
                  transition: 'background 300ms ease',
                }}
                title={`${cell.row} × ${cell.col}: ${cell.value.toFixed(2)}`}
              >
                {cell.value.toFixed(1)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// === Donut Chart (for category breakdown) ===
export function DonutChart({ data, colors, size = 140, centerLabel, centerValue }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius

  const segments = data.map((item, idx) => {
    const percent = item.value / total
    // Compute start angle from previous segments (pure, no mutation)
    const startAngle = data.slice(0, idx).reduce((acc, prev) => {
      return acc + (prev.value / total) * 360
    }, 0)
    const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`
    const rotation = -90 + startAngle
    return {
      ...item,
      percent,
      strokeDasharray,
      rotation,
      color: colors?.[idx % (colors?.length || 1)] || 'var(--accent-indigo)',
    }
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-md)',
      }}
    >
      <svg width={size} height={size}>
        {segments.map((seg, idx) => (
          <circle
            key={idx}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={seg.strokeDasharray}
            transform={`rotate(${seg.rotation} ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 500ms ease-out' }}
          />
        ))}
      </svg>
      {centerLabel && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {centerLabel}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-en)' }}>
            {centerValue?.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}

// === WaterfallChart (re-export from local file) ===
export { WaterfallChart }
