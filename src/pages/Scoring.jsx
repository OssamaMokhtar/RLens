import React, { useState } from 'react'
import appData from '../lib/data'

export function Scoring({ titles, locale }) {
  const [selectedApp, setSelectedApp] = useState(null)
  const [sliderValues, setSliderValues] = useState({
    dsr: 0.35,
    cashflowConsistency: 0.6,
    existingDebtBurden: 0.4,
    employmentStability: 0.7,
    fraudRisk: 0.05,
    bureauScore: 600,
  })

  const handleSliderChange = (key, value) => {
    setSliderValues(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="scoring-page">
      <h1>{titles?.scoring?.[locale] || 'Credit Scoring'}</h1>
      <h2>Select Application</h2>
      <div className="app-selector">
        {appData.applications?.map(app => (
          <div
            key={app.id}
            className={`app-option ${selectedApp?.id === app.id ? 'selected' : ''}`}
            onClick={() => setSelectedApp(app)}
          >
            <div className="app-option-info">
              <span className="app-option-name">{app.applicantName}</span>
              <span className="app-option-amount">
                {app.amount?.toLocaleString()} AED
              </span>
              <span className="app-option-tenor">{app.tenor} months</span>
            </div>
            <div className="app-option-score">{app.score || '--'}</div>
          </div>
        ))}
      </div>
      {selectedApp && (
        <div className="scoring-detail">
          <h2>
            SHAP Waterfall — {selectedApp.applicantName}
          </h2>
          <div className="waterfall-container">
            <div className="waterfall-base">
              <span>Base Score</span>
              <span className="waterfall-value">500</span>
            </div>
            {[
              { label: 'DSR', value: sliderValues.dsr, direction: 'positive' },
              {
                label: 'Cashflow Consistency',
                value: sliderValues.cashflowConsistency,
                direction: 'positive',
              },
              {
                label: 'Existing Debt Burden',
                value: -sliderValues.existingDebtBurden,
                direction: 'negative',
              },
              {
                label: 'Employment Stability',
                value: sliderValues.employmentStability,
                direction: 'positive',
              },
              {
                label: 'Fraud Risk',
                value: -sliderValues.fraudRisk * 1000,
                direction: 'negative',
              },
              {
                label: 'Bureau Score',
                value: (sliderValues.bureauScore - 500) / 3,
                direction: 'positive',
              },
            ].map((factor) => (
              <div
                key={factor.label}
                className={`waterfall-bar ${factor.direction}`}
              >
                <div className="waterfall-label">{factor.label}</div>
                <div className="waterfall-bar-track">
                  <div
                    className={`waterfall-bar-fill ${factor.direction}`}
                    style={{
                      width: `${Math.min(Math.abs(factor.value) * 10, 100)}%`,
                    }}
                  />
                </div>
                <div className="waterfall-value">
                  {factor.direction === 'positive' ? '+' : ''}
                  {factor.value.toFixed(0)}
                </div>
              </div>
            ))}
            <div className="waterfall-total">
              <span>Total Score</span>
              <span className="waterfall-value total">500</span>
            </div>
          </div>
          <h2>Scenario Simulation</h2>
          <div className="simulator">
            <div className="sim-sliders">
              <div className="sim-slider-group">
                <label>DSR: {sliderValues.dsr.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={sliderValues.dsr}
                  onChange={e => handleSliderChange('dsr', parseFloat(e.target.value))}
                />
              </div>
              <div className="sim-slider-group">
                <label>Cashflow: {sliderValues.cashflowConsistency.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={sliderValues.cashflowConsistency}
                  onChange={e => handleSliderChange('cashflowConsistency', parseFloat(e.target.value))}
                />
              </div>
              <div className="sim-slider-group">
                <label>Debt Burden: {sliderValues.existingDebtBurden.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={sliderValues.existingDebtBurden}
                  onChange={e => handleSliderChange('existingDebtBurden', parseFloat(e.target.value))}
                />
              </div>
              <div className="sim-slider-group">
                <label>Employment: {sliderValues.employmentStability.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={sliderValues.employmentStability}
                  onChange={e => handleSliderChange('employmentStability', parseFloat(e.target.value))}
                />
              </div>
              <div className="sim-slider-group">
                <label>Fraud Risk: {sliderValues.fraudRisk.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={sliderValues.fraudRisk}
                  onChange={e => handleSliderChange('fraudRisk', parseFloat(e.target.value))}
                />
              </div>
              <div className="sim-slider-group">
                <label>Bureau Score: {sliderValues.bureauScore}</label>
                <input
                  type="range"
                  min="300"
                  max="900"
                  step="1"
                  value={sliderValues.bureauScore}
                  onChange={e => handleSliderChange('bureauScore', parseInt(e.target.value, 10))}
                />
              </div>
            </div>
            <div className="sim-result">
              <span>Current Score: 500</span>
              <span className="sim-arrow">→</span>
              <span>Simulated: 500</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
