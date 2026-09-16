import React from 'react'
import { ScoreMeter } from '../ScoreBoard/ScoreMeter'

export function ScoreMeterCard({ score, label }) {
  return (
    <div className="score-meter-card">
      <ScoreMeter score={score} />
      <div className="score-meter-info">
        <div className="score-meter-label">{label}</div>
        <div className="score-meter-value">{score}</div>
      </div>
    </div>
  )
}
