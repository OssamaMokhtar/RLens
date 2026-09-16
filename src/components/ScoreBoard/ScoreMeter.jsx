import React from 'react'

export function ScoreMeter({ score }) {
  const grade = score >= 850 ? 'Excellent' : score >= 700 ? 'Good' : score >= 550 ? 'Fair' : score >= 400 ? 'Poor' : 'Bad'
  const percentage = (score / 1000) * 100

  return (
    <div className="score-meter">
      <div className="score-meter-ring">
        <svg viewBox="0 0 120 120">
          <circle className="score-meter-bg" cx="60" cy="60" r="52" fill="none" strokeWidth="8" />
          <circle
            className="score-meter-fill"
            cx="60" cy="60" r="52"
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${percentage * 3.27} ${327 - percentage * 3.27}`}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              stroke: score >= 700 ? 'var(--accent-emerald)' : score >= 500 ? 'var(--accent-amber)' : 'var(--accent-rose)'
            }}
          />
        </svg>
        <div className="score-meter-value">{score}</div>
      </div>
      <div className="score-meter-grade">{grade}</div>
    </div>
  )
}
