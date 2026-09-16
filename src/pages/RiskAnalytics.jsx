import React, { useState, useMemo } from 'react'
import appData from '../lib/data'

const COUNTRIES = [
  { key: 'AE', label: 'UAE', risk: 'low' },
  { key: 'SA', label: 'Saudi Arabia', risk: 'medium' },
  { key: 'EG', label: 'Egypt', risk: 'high' },
  { key: 'KW', label: 'Kuwait', risk: 'low' },
  { key: 'QA', label: 'Qatar', risk: 'low' },
  { key: 'BH', label: 'Bahrain', risk: 'medium' },
  { key: 'OM', label: 'Oman', risk: 'medium' },
  { key: 'JO', label: 'Jordan', risk: 'medium' },
  { key: 'LB', label: 'Lebanon', risk: 'high' },
  { key: 'IQ', label: 'Iraq', risk: 'high' },
]

const SECTORS = [
  'Retail',
  'Construction',
  'Healthcare',
  'Technology',
  'Agriculture',
  'Manufacturing',
  'Transport',
  'Hospitality',
]

const SECTOR_RISK_DATA = [
  { sector: 'Retail', exposure: 35, rating: 'medium' },
  { sector: 'Construction', exposure: 28, rating: 'high' },
  { sector: 'Healthcare', exposure: 18, rating: 'low' },
  { sector: 'Technology', exposure: 12, rating: 'medium' },
  { sector: 'Agriculture', exposure: 7, rating: 'low' },
  { sector: 'Manufacturing', exposure: 14, rating: 'medium' },
  { sector: 'Transport', exposure: 10, rating: 'low' },
  { sector: 'Hospitality', exposure: 8, rating: 'medium' },
]

export function RiskAnalytics({ titles, locale }) {
  const [selectedCountry, setSelectedCountry] = useState('AE')

  const countryRisk = useMemo(() => {
    return COUNTRIES.find(c => c.key === selectedCountry) || COUNTRIES[0]
  }, [selectedCountry])

  const countryRiskTrend = useMemo(() => {
    if (countryRisk.risk === 'low') return { change: '+0.2%', direction: 'up' }
    if (countryRisk.risk === 'medium') return { change: '+1.1%', direction: 'up' }
    return { change: '+2.8%', direction: 'up' }
  }, [countryRisk])

  const sectorBreakdown = useMemo(() => SECTOR_RISK_DATA, [])

  const exposureByTenor = useMemo(() => [
    { tenor: '< 1 year', exposure: 18, rating: 'low' },
    { tenor: '1-2 years', exposure: 35, rating: 'medium' },
    { tenor: '2-3 years', exposure: 28, rating: 'medium' },
    { tenor: '> 3 years', exposure: 12, rating: 'high' },
    { tenor: 'Unstructured', exposure: 7, rating: 'high' },
  ], [])

  return (
    <div className="risk-page">
      <h1>
        {titles?.risk?.[locale] || 'Risk Analytics'}
      </h1>

      {/* KPI Cards */}
      <div className="risk-kpi-grid">
        <div className="risk-kpi-card">
          <div className="kpi-label">Portfolio Risk Score</div>
          <div className="kpi-value">647</div>
          <div className="kpi-trend risk-trend-up">▲ 3.2%</div>
        </div>
        <div className="risk-kpi-card">
          <div className="kpi-label">High Risk Exposure</div>
          <div className="kpi-value">23.4%</div>
          <div className="kpi-trend risk-trend-down">▼ 1.1%</div>
        </div>
        <div className="risk-kpi-card">
          <div className="kpi-label">Probable Loss</div>
          <div className="kpi-value">$12.8M</div>
          <div className="kpi-trend risk-trend-up">▲ 0.8%</div>
        </div>
        <div className="risk-kpi-card">
          <div className="kpi-label">Concentration Risk</div>
          <div className="kpi-value">14.2%</div>
          <div className="kpi-trend risk-trend-down">▼ 2.3%</div>
        </div>
      </div>

      {/* Country Risk */}
      <div className="risk-section">
        <h2>
          {titles?.countryRiskBreakdown?.[locale] || 'Country Risk Breakdown'}
        </h2>
        <div className="country-selector">
          {COUNTRIES.map(c => (
            <button
              key={c.key}
              className={`country-btn ${selectedCountry === c.key ? 'active' : ''}`}
              onClick={() => setSelectedCountry(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="country-risk-card">
          <div className="country-risk-header">
            <span className="country-name">{countryRisk.label}</span>
            <span className={`risk-badge risk-${countryRisk.risk}`}>
              {countryRisk.risk === 'low' ? 'Low Risk' : countryRisk.risk === 'medium' ? 'Medium Risk' : 'High Risk'}
            </span>
          </div>
          <div className="country-risk-metrics">
            <div className="risk-metric">
              <div className="risk-metric-label">Political Stability</div>
              <div className="risk-metric-value">{countryRisk.risk === 'low' ? 'A' : countryRisk.risk === 'medium' ? 'B+' : 'C'}</div>
            </div>
            <div className="risk-metric">
              <div className="risk-metric-label">Regulatory Environment</div>
              <div className="risk-metric-value">{countryRisk.risk === 'low' ? 'Strong' : countryRisk.risk === 'medium' ? 'Moderate' : 'Weak'}</div>
            </div>
            <div className="risk-metric">
              <div className="risk-metric-label">Economic Outlook</div>
              <div className="risk-metric-value">{countryRisk.risk === 'low' ? 'Positive' : countryRisk.risk === 'medium' ? 'Neutral' : 'Negative'}</div>
            </div>
          </div>
          <div className="country-risk-trend">
            <span className="trend-label">Trend:</span>
            <span className={`trend-change ${countryRiskTrend.direction}`}>
              {countryRiskTrend.change}
            </span>
          </div>
        </div>
      </div>

      {/* Sector Breakdown */}
      <div className="risk-section">
        <h2>
          {titles?.sectorBreakdown?.[locale] || 'Sector Breakdown'}
        </h2>
        <div className="sector-risk-list">
          {sectorBreakdown.map(item => (
            <div key={item.sector} className="sector-risk-item">
              <div className="sector-risk-info">
                <span className="sector-name">{item.sector}</span>
                <span className={`risk-badge risk-${item.rating}`}>
                  {item.rating === 'low' ? 'Low' : item.rating === 'medium' ? 'Medium' : 'High'}
                </span>
              </div>
              <div className="sector-risk-exposure">
                <div className="exposure-bar">
                  <div
                    className="exposure-fill"
                    style={{
                      width: `${item.exposure}%`,
                      background:
                        item.rating === 'high' ? 'var(--danger)' :
                        item.rating === 'medium' ? 'var(--warning)' :
                        'var(--success)',
                    }}
                  />
                </div>
                <span className="exposure-value">{item.exposure}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exposure by Tenor */}
      <div className="risk-section">
        <h2>
          {titles?.exposureByTenor?.[locale] || 'Exposure by Tenor'}
        </h2>
        <div className="tenor-exposure-list">
          {exposureByTenor.map(item => (
            <div key={item.tenor} className="tenor-item">
              <div className="tenor-info">
                <span className="tenor-label">{item.tenor}</span>
                <span className={`risk-badge risk-${item.rating}`}>
                  {item.rating === 'low' ? 'Low' : item.rating === 'medium' ? 'Medium' : 'High'}
                </span>
              </div>
              <div className="tenor-exposure">
                <div className="exposure-bar">
                  <div
                    className="exposure-fill"
                    style={{
                      width: `${item.exposure}%`,
                      background:
                        item.rating === 'high' ? 'var(--danger)' :
                        item.rating === 'medium' ? 'var(--warning)' :
                        'var(--success)',
                    }}
                  />
                </div>
                <span className="exposure-value">{item.exposure}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Heatmap */}
      <div className="risk-section">
        <h2>
          {titles?.portfolioHeatmap?.[locale] || 'Portfolio Heatmap'}
        </h2>
        <div className="heatmap-container">
          <div className="heatmap-grid">
            {sectorBreakdown.slice(0, 6).map(item => (
              <div
                key={item.sector}
                className={`heatmap-cell risk-${item.rating}`}
                style={{
                  background:
                    item.rating === 'high' ? 'var(--danger)' :
                    item.rating === 'medium' ? 'var(--warning)' :
                    'var(--success)',
                  opacity: 0.3 + (item.exposure / 50),
                }}
                title={`${item.sector}: ${item.exposure}%`}
              >
                <span className="heatmap-label">{item.sector}</span>
                <span className="heatmap-value">{item.exposure}%</span>
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span className="legend-item legend-low">Low</span>
            <span className="legend-item legend-medium">Medium</span>
            <span className="legend-item legend-high">High</span>
          </div>
        </div>
      </div>

      {/* Delinquency Trends */}
      <div className="risk-section">
        <h2>
          {titles?.delinquencyTrending?.[locale] || 'Delinquency Trends'}
        </h2>
        <div className="delinquency-chart">
          <div className="delinquency-bars">
            {[
              { month: 'Jan', value: 3.2 },
              { month: 'Feb', value: 4.1 },
              { month: 'Mar', value: 3.8 },
              { month: 'Apr', value: 5.2 },
              { month: 'May', value: 4.9 },
              { month: 'Jun', value: 6.1 },
              { month: 'Jul', value: 5.8 },
              { month: 'Aug', value: 7.2 },
              { month: 'Sep', value: 6.8 },
              { month: 'Oct', value: 8.1 },
              { month: 'Nov', value: 7.5 },
              { month: 'Dec', value: 9.2 },
            ].map((item, index) => (
              <div key={index} className="delinquency-bar">
                <div
                  className="delinquency-fill"
                  style={{
                    height: `${item.value * 8}px`,
                    background:
                      item.value > 7 ? 'var(--danger)' :
                      item.value > 5 ? 'var(--warning)' :
                      'var(--success)',
                  }}
                />
                <span className="delinquency-value">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="delinquency-labels">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, index) => (
              <span key={index} className="delinquency-label">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
