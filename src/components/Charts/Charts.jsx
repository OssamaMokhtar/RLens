import React, { useState, useMemo, useRef } from 'react';
import { ScoreMeter } from '../ScoreBoard/ScoreMeter';
import { WaterfallChart } from './WaterfallChart';
import { usePulse } from '../../hooks/usePulse';

// === KPI Card Component ===
export function KPICard({ title, value, subtitle, icon, trend, color, lang, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="kpi-card"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 400ms ease-out',
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
          <span
            style={{
              fontSize: '18px',
              color: color,
            }}
          >
            {icon}
          </span>
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
                borderRadius: '4px',
                display: trend > 0 ? 'flex' : 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>

        {subtitle && (
          <div
            className="kpi-subtitle"
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// === Score Meter Card ===
export function ScoreMeterCard({ score, grade, maxScore = 850, applicant, lang }) {
  const { evaluate } = usePulse();
  const cardRef = useRef(null);

  const gradeInfo = {
    'AAA': { color: '#10b981', label: lang === 'ar' ? 'ممتاز' : 'Excellent' },
    'AA': { color: '#10b981', label: lang === 'ar' ? 'ممتاز جداً' : 'Very Good' },
    'A': { color: '#06b6d4', label: lang === 'ar' ? 'جيد جداً' : 'Very Good' },
    'BBB': { color: '#06b6d4', label: lang === 'ar' ? 'جيد' : 'Good' },
    'BB': { color: '#f59e0b', label: lang === 'ar' ? 'مقبول' : 'Fair' },
    'B': { color: '#f59e0b', label: lang === 'ar' ? 'مقبول' : 'Fair' },
    'CCC': { color: '#f43f5e', label: lang === 'ar' ? 'ضعيف' : 'Poor' },
    'CC': { color: '#f43f5e', label: lang === 'ar' ? 'ضعيف جداً' : 'Very Poor' },
    'C': { color: '#f43f5e', label: lang === 'ar' ? 'منخفض جداً' : 'Very Low' },
    'D': { color: '#f43f5e', label: lang === 'ar' ? 'مرفوض' : 'Declined' },
  };

  const info = gradeInfo[grade] || { color: '#9090a8', label: 'N/A' };

  React.useEffect(() => {
    if (applicant) {
      evaluate(applicant);
    }
  }, [applicant]);

  return (
    <div
      ref={cardRef}
      className="score-meter-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pulse glow if insights exist */}
      {score > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${info.color}, ${info.color}80, ${info.color})`,
            boxShadow: `0 0 12px ${info.color}40`,
          }}
        />
      )}

      <div className="score-meter-header">
        <div className="score-meter-title">
          <span className="title-text" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'تقييم الائتمان' : 'Credit Score'}
          </span>
          <span
            className="grade-badge"
            style={{
              background: `${info.color}15`,
              color: info.color,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {grade} — {info.label}
          </span>
        </div>
      </div>

      <div className="score-meter-body" style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
        <div className="score-meter-chart" style={{ flexShrink: 0 }}>
          <ScoreMeter score={score} maxScore={maxScore} grade={grade} />
        </div>
        <div className="score-meter-breakdown" style={{ flex: 1 }}>
          <div className="breakdown-title" style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--spacing-sm)' }}>
            {lang === 'ar' ? 'تفاصيل الطلب' : 'Application Details'}
          </div>
          <div className="breakdown-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
            <div className="breakdown-item">
              <div className="breakdown-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                {lang === 'ar' ? 'مبلغ الطلب' : 'Requested Amount'}
              </div>
              <div className="breakdown-value" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {applicant?.currency} {applicant?.amount?.toLocaleString()}
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                {lang === 'ar' ? 'المدى' : 'Tenor'}
              </div>
              <div className="breakdown-value" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {applicant?.tenor > 0 ? applicant?.tenor + ' أشهر' : applicant?.tenor + ' months' : 'N/A'}
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                {lang === 'ar' ? 'الدخل الشهري' : 'Monthly Income'}
              </div>
              <div className="breakdown-value" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {applicant?.salary?.toLocaleString()} {applicant?.currency}
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                {lang === 'ar' ? 'نسبة عبء الدين' : 'DSR Ratio'}
              </div>
              <div className="breakdown-value" style={{ fontSize: '14px', fontWeight: 700, color: score > 650 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                {(applicant?.dsr || 0) * 100}%{applicant?.country === 'AE' && ' (CBUAE: 50%)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Waterfall Chart Component ===
export function SHAPWaterfall({ factors, lang, score, maxScore = 850 }) {
  const isRTL = lang === 'ar';
  
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const sortedFactors = useMemo(() => {
    return [...factors].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [factors]);

  const totalImpact = useMemo(() => {
    return factors.reduce((sum, f) => sum + f.value, 0);
  }, [factors]);

  return (
    <div
      className="waterfall-container"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
      }}
    >
      <div className="waterfall-header" style={{ marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: isRTL ? 'space-between' : 'space-between', alignItems: 'center' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {lang === 'ar' ? 'تحليل SHAP' : 'SHAP Analysis'}
        </h3>
        <span
          className="score-badge"
          style={{
            background: 'var(--primary-500)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          {score} / {maxScore}
        </span>
      </div>

      <div
        ref={containerRef}
        className="waterfall-canvas"
        style={{
          position: 'relative',
          padding: 'var(--spacing-sm) 0',
          minHeight: '200px',
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Baseline line */}
        <div
          style={{
            position: 'absolute',
            left: isRTL ? 'auto' : '20px',
            right: isRTL ? '20px' : 'auto',
            top: '40px',
            bottom: '40px',
            width: isRTL ? '2px' : '2px',
            background: 'var(--border)',
            borderLeft: isRTL ? 'none' : '2px solid var(--border)',
            borderRight: isRTL ? '2px solid var(--border)' : 'none',
          }}
        />

        {/* Score markers */}
        <div
          style={{
            position: 'absolute',
            left: isRTL ? '20px' : '20px',
            top: '36px',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            fontWeight: 600,
          }}
        >
          {lang === 'ar' ? 'الأساس' : 'Baseline'}
        </div>

        <div
          style={{
            position: 'absolute',
            right: isRTL ? '20px' : '20px',
            left: isRTL ? 'auto' : 'auto',
            top: '36px',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            fontWeight: 600,
          }}
        >
          {lang === 'ar' ? 'النتيجة' : 'Final'}
        </div>
      </div>

      {/* Factors list */}
      <div
        className="waterfall-factors"
        style={{
          marginTop: 'var(--spacing-md)',
          display: 'flex',
          flexDirection: isRTL ? 'column' : 'column',
        }}
      >
        {sortedFactors.map((factor, index) => {
          const isPositive = factor.value > 0;
          const barWidth = Math.min(Math.abs(factor.value) / 150, 1) * 100;
          
          return (
            <div
              key={index}
              className="waterfall-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xs)',
                padding: 'var(--spacing-xs) 0',
                borderBottom: index < sortedFactors.length - 1 ? '1px solid var(--border)' : 'none',
                position: 'relative',
              }}
              onMouseEnter={() => setTooltip({ factor, isPositive })}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Bar background */}
              <div
                style={{
                  position: 'absolute',
                  left: isRTL ? 'auto' : '20px',
                  right: isRTL ? '20px' : 'auto',
                  top: '50%',
                  height: '8px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  transform: 'translateY(-50%)',
                }}
              />
              
              {/* Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: isRTL ? 'auto' : '20px',
                  right: isRTL ? '20px' : 'auto',
                  top: '50%',
                  height: '8px',
                  background: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  borderRadius: '4px',
                  transform: `translateY(-50%) ${isRTL ? '-100%' : '0'}`,
                  width: `${barWidth}%`,
                  opacity: 0.8,
                  transition: 'opacity 200ms ease',
                }}
                className="waterfall-bar"
              />

              {/* Factor label */}
              <div
                style={{
                  position: isRTL ? 'absolute' : 'relative',
                  left: isRTL ? '28px' : 'auto',
                  right: isRTL ? 'auto' : '28px',
                  flex: 1,
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginLeft: isRTL ? '0' : '0',
                  marginRight: isRTL ? '0' : '0',
                  paddingLeft: isRTL ? '0' : '8px',
                  paddingRight: isRTL ? '8px' : '0',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {factor.label}
              </div>

              {/* Value */}
              <div
                style={{
                  position: isRTL ? 'absolute' : 'relative',
                  left: isRTL ? '0' : 'auto',
                  right: isRTL ? '0' : 'auto',
                  flexShrink: 0,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  paddingLeft: isRTL ? '0' : '8px',
                  paddingRight: isRTL ? '8px' : '0',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {isPositive ? '+' : ''}{factor.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="waterfall-tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            marginBottom: '8px',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '2px' }}>
            {tooltip.factor.label}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'التأثير على التقييم' : 'Impact on score'}: {tooltip.isPositive ? '+' : ''}{tooltip.factor.value} points
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {tooltip.factor.description}
          </div>
        </div>
      )}
    </div>
  );
}

// === Mini Chart (sparkline style) ===
export function MiniChart({ data, color = 'var(--accent-emerald)', height = 40 }) {
  const [width, setWidth] = useState(200);
  const canvasRef = useRef(null);

  React.useEffect(() => {
    const updateWidth = () => {
      if (canvasRef.current) {
        setWidth(canvasRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const points = useMemo(() => {
    if (data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    
    return data.map((value, i) => {
      const x = i * stepX;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    }).join(' ');
  }, [data, width, height]);

  return (
    <div ref={canvasRef} style={{ position: 'relative', height }}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points && (
          <circle
            cx={width}
            cy={height - 4}
            r="3"
            fill={color}
          />
        )}
      </svg>
    </div>
  );
}

// === Score Distribution Chart (bar) ===
export function ScoreDistribution({ scores, bins = 5, lang }) {
  const [distribution, setDistribution] = React.useState([]);
  const [maxCount, setMaxCount] = React.useState(1);

  React.useEffect(() => {
    const binSize = 850 / bins;
    const counts = Array(bins).fill(0);
    
    scores.forEach(score => {
      const binIndex = Math.min(Math.floor(score / binSize), bins - 1);
      counts[binIndex]++;
    });
    
    setDistribution(counts);
    setMaxCount(Math.max(...counts, 1));
  }, [scores, bins]);

  const binLabels = useMemo(() => {
    return Array.from({ length: bins }, (_, i) => {
      const start = i * binSize + 1;
      const end = (i + 1) * binSize;
      if (lang === 'ar') {
        return `${end}→${start}`;
      }
      return `${start}-${end}`;
    });
  }, [bins, lang]);

  return (
    <div
      className="score-distribution"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
      }}
    >
      <h3
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {lang === 'ar' ? 'توزيع التقييمات' : 'Score Distribution'}
      </h3>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'var(--spacing-xs)',
          height: '120px',
        }}
      >
        {distribution.map((count, i) => {
          const heightPercent = (count / maxCount) * 100;
          const barHeight = Math.max(heightPercent, 4);
          
          let color;
          const binStart = i * (850 / bins) + 1;
          const binEnd = (i + 1) * (850 / bins);
          
          if (binEnd <= 600) color = 'var(--accent-rose)';
          else if (binEnd <= 700) color = 'var(--accent-amber)';
          else if (binEnd <= 750) color = 'var(--accent-cyan)';
          else color = 'var(--accent-emerald)';

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${barHeight}px`,
                  background: color,
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                  transition: 'height 400ms ease-out',
                }}
              />
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  flex: 1,
                  textAlign: 'center',
                  marginTop: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 'var(--spacing-sm)',
          fontSize: '10px',
          color: 'var(--text-tertiary)',
        }}
      >
        {binLabels.map((label, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center' }}>{label}</span>
        ))}
      </div>
    </div>
  );
}

// === Gauge Chart (radial) ===
export function GaugeChart({ value, max = 100, label, color = 'var(--accent-emerald)', size = 120 }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const ref = useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min(Math.max(value / max, 0), 1);
  const dashOffset = circumference - (percentage * circumference);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          fill="none"
          stroke="var(--bg-secondary)"
          strokeWidth="6"
        />
        {/* Value arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 8px currentColor)',
          }}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {label && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '2px',
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// === Correlation Matrix (mini heatmap) ===
export function CorrelationMatrix({ correlations, features, lang }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const getColor = (value) => {
    if (value >= 0.7) return 'var(--accent-emerald)';
    if (value >= 0.4) return 'var(--accent-cyan)';
    if (value >= 0) return 'var(--accent-amber)';
    if (value >= -0.4) return 'var(--accent-amber)';
    if (value >= -0.7) return 'var(--accent-rose)';
    return 'var(--accent-rose)';
  };

  return (
    <div
      className="correlation-matrix"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
        overflow: 'auto',
      }}
    >
      <h3
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {lang === 'ar' ? 'مصفوفة الارتباط' : 'Correlation Matrix'}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `80px repeat(${features.length}, 1fr)`,
          gap: '2px',
          fontSize: '11px',
        }}
      >
        {/* Header row */}
        <div style={{}} />
        {features.map((feature, i) => (
          <div
            key={i}
            className="matrix-header"
            style={{
              padding: '4px 6px',
              background: 'var(--bg-secondary)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              textAlign: 'center',
              textTransform: 'uppercase',
              fontSize: '10px',
              letterSpacing: '0.03em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {feature}
          </div>
        ))}

        {/* Data rows */}
        {features.map((rowFeature, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div
              className="matrix-row-header"
              style={{
                padding: '4px 6px',
                background: 'var(--bg-secondary)',
                borderRadius: '4px 0 0 4px',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                textAlign: 'right',
                fontSize: '10px',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {rowFeature}
            </div>
            {features.map((colFeature, colIndex) => {
              const value = correlations[rowIndex][colIndex];
              return (
                <div
                  key={colIndex}
                  className="matrix-cell"
                  style={{
                    padding: '4px 6px',
                    background: value >= 0 ? `${getColor(value)}20` : 'transparent',
                    color: getColor(value),
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    opacity: 0.7,
                  }}
                  onMouseEnter={() => setHoveredCell({ row: rowFeature, col: colFeature, value })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {value.toFixed(2)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="matrix-tooltip"
          style={{
            position: 'absolute',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {hoveredCell.row} ↔ {hoveredCell.col}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Correlation: {hoveredCell.value.toFixed(3)}
          </div>
        </div>
      )}
    </div>
  );
}

// === Donut Chart (for category breakdown) ===
export function DonutChart({ data, colors, size = 140, centerLabel, centerValue, lang }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const ref = useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimatedTotal(total), 200);
    return () => clearTimeout(timer);
  }, [total]);

  let cumulativePercent = 0;
  const segments = data.map((item, i) => {
    const percent = item.value / total;
    const startAngle = cumulativePercent * 360;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 360;
    const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
    const rotation = -90 + startAngle;
    return { ...item, percent, strokeDasharray, rotation, color: colors[i % colors.length] };
  });

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {segments.map((segment, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={segment.strokeDasharray}
            transform={`rotate(${segment.rotation} ${size / 2} ${size / 2})`}
            style={{
              transition: 'stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 0 4px currentColor)',
            }}
          />
        ))}
      </svg>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: -10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
          transform: 'translateY(100%)',
        }}
      >
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: colors[i % colors.length],
              }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          textAlign: 'center',
        }}
      >
        {centerValue !== undefined && (
          <div
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {centerValue}
          </div>
        )}
        {centerLabel && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '2px',
            }}
          >
            {centerLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export default {
  KPICard,
  ScoreMeterCard,
  SHAPWaterfall,
  MiniChart,
  ScoreDistribution,
  GaugeChart,
  CorrelationMatrix,
  DonutChart,
};
