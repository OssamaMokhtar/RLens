import { useState, useCallback, useMemo } from 'react'
import PulseContext from '../context/PulseContext'

const ANOMALY_TYPES = {
  DSR_SPIKE: 'DSR_SPIKE',
  SECTOR_RISK: 'SECTOR_RISK',
  FRAUD_ALERTS: 'FRAUD_ALERTS',
  MISSING_DOCS: 'MISSING_DOCS',
  CASHFLOW_DIPS: 'CASHFLOW_DIPS',
}

export function PulseProvider({ children }) {
  const [insights, setInsights] = useState([])
  const [isPulsing, setIsPulsing] = useState(false)

  const evaluate = useCallback((data) => {
    const newInsights = []

    const monthlyPmt = (data.loanAmount || 0) / (data.tenorMonths || 1)
    const dsr = monthlyPmt / Math.max(data.salary || 1, 1)

    if (dsr > 0.45) {
      newInsights.push({
        id: Date.now() + Math.random(),
        type: ANOMALY_TYPES.DSR_SPIKE,
        severity: 'high',
        label: { en: 'DSR Threshold Alert', ar: 'تنبيه تجاوز حد الدين' },
        summary: {
          en: `DSR of ${(dsr * 100).toFixed(1)}% exceeds CBUAE limit of 50%. Consider reducing loan amount or increasing tenure.`,
          ar: `نسبة عبء الدين ${(dsr * 100).toFixed(1)}٪ تتجاوز الحد الأقصى للمصرف المركزي (50٪). يُنصح بخفض مبلغ القرض أو زيادة المدة.`
        },
        action: 'suggest_decision',
        metric: { label: 'DSR', value: `${(dsr * 100).toFixed(1)}%`, threshold: '50%' }
      })
    }

    if (data.mode === 'sme' && data.sectorRisk > 0.15) {
      newInsights.push({
        id: Date.now() + Math.random() + 1,
        type: ANOMALY_TYPES.SECTOR_RISK,
        severity: 'medium',
        label: { en: 'High Sector Risk', ar: 'مخاطر قطاع عالية' },
        summary: {
          en: `Sector risk is ${(data.sectorRisk * 100).toFixed(0)}% — above threshold. Review collateral and cashflow stability.`,
          ar: `مخاطر القطاع ${(data.sectorRisk * 100).toFixed(0)}٪ — فوق الحد الموصى به. راجع الضمان والتدفق النقدي.`
        },
        action: 'analyze_sector',
        metric: { label: 'Sector Risk', value: `${(data.sectorRisk * 100).toFixed(0)}%`, threshold: '15%' }
      })
    }

    if (data.isNewApplicant && data.loanAmount > 500000) {
      newInsights.push({
        id: Date.now() + Math.random() + 2,
        type: ANOMALY_TYPES.FRAUD_ALERTS,
        severity: 'high',
        label: { en: 'Large New Application', ar: 'طلب كبير لمرشح جديد' },
        summary: {
          en: `New applicant requesting ${data.loanAmount.toLocaleString()} AED — requires enhanced due diligence.`,
          ar: `مرشح جديد يطلب ${data.loanAmount.toLocaleString()} درهم — يتطلب تحقيقاً موسعاً.`
        },
        action: 'enhanced_dd',
        metric: null
      })
    }

    if (data.mode === 'retail' && (data.cashflowMonths || 0) < 6) {
      newInsights.push({
        id: Date.now() + Math.random() + 3,
        type: ANOMALY_TYPES.CASHFLOW_DIPS,
        severity: 'medium',
        label: { en: 'Short Cashflow History', ar: 'تاريخ تدفق نقدي قصير' },
        summary: {
          en: `Only ${data.cashflowMonths} months of cashflow data — recommend requesting 6+ months bank statements.`,
          ar: `فقط ${data.cashflowMonths} أشهر من بيانات التدفق النقدي — يُنصح بطلب 6+ أشهر من كشوف الحساب.`
        },
        action: 'request_docs',
        metric: { label: 'Months', value: String(data.cashflowMonths || 0), threshold: '6+' }
      })
    }

    setInsights(newInsights)
    setIsPulsing(newInsights.length > 0)
    return newInsights
  }, [])

  const dismiss = useCallback((id) => {
    setInsights((prev) => {
      const next = prev.filter((item) => item.id !== id)
      setIsPulsing(next.length > 0)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ insights, isPulsing, evaluate, dismiss }),
    [insights, isPulsing, evaluate, dismiss]
  )

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>
}
