import React, { useState, useRef, useEffect } from 'react'
import { Card, Badge, Button, Input } from '../components/Shared'
import { CopilotUI } from '../components/Copilot/CopilotUI'
import { usePulse } from '../hooks/usePulse'
import { CopilotContext } from '../lib/copilotCore'

export function CopilotPage({ lang }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedApp, setSelectedApp] = useState(null)
  const messagesEndRef = useRef(null)
  const { insights, evaluate } = usePulse()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg = { role: 'user', text: trimmed, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    const contextInfo = selectedApp ? {
      score: selectedApp.score,
      grade: selectedApp.grade,
      dsr: (selectedApp.dsr * 100).toFixed(1),
      product: selectedApp.product,
      amount: selectedApp.currency + ' ' + selectedApp.amount?.toLocaleString(),
    } : {}

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))

    const response = generateResponse(trimmed, contextInfo, lang)
    const assistantMsg = {
      role: 'assistant',
      text: response.text,
      confidence: response.confidence,
      id: Date.now() + 1,
    }
    setMessages(prev => [...prev, assistantMsg])
    setIsTyping(false)

    if (response.insights) {
      response.insights.forEach(insight => {
        insights.push({ ...insight, id: Date.now() + Math.random() })
      })
    }
  }

  const generateResponse = (query, context, lang) => {
    const lower = query.toLowerCase()
    const t = {
      en: {
        greeting: 'I\'ve analyzed your query. Based on the available data and GCC regulatory framework, here are my findings.',
        noContext: 'How can I help you further? You can ask about specific scores, regulations, or risk mitigations.',
        scoreAnalysis: {
          text: `<p><strong>Score Analysis</strong></p>
          <p>Score: <strong>${context.score}</strong> (Grade: ${context.grade})</p>
          <p><strong>Key Factors:</strong></p>
          <ul>
            <li>🔴 DSR at ${context.dsr}% — ${context.dsr > 50 ? 'exceeds CBUAE 50% limit' : 'within CBUAE limit'}</li>
            <li>${context.dsr > 50 ? '<li>📉 Consider reducing loan amount to bring DSR below 50%</li>' : ''}</li>
          </ul>`,
          confidence: 0.88,
        },
        regulations: {
          text: `<p><strong>Regulatory Context — ${context.product || 'Credit Decision'}</strong></p>
          <p>Under CBUAE guidelines:</p>
          <ul>
            <li>DSR must not exceed 50% of monthly income</li>
            <li>Minimum salary requirement: 5,000 AED</li>
            <li>Retail loans max tenor: 4 years</li>
            <li>All decisions require documented rationale</li>
          </ul>`,
          confidence: 0.95,
        },
        mitigations: {
          text: `<p><strong>Suggested Risk Mitigations:</strong></p>
          <ul>
            <li>📉 Reduce loan amount by 15% to bring DSR within limits</li>
            <li>📄 Request 6 months salary certificates for verification</li>
            <li>⏱️ Consider shorter tenure to reduce total interest burden</li>
            <li>🔒 Request salary assignment letter from employer</li>
            <li>👤 Consider adding a guarantor to strengthen the application</li>
          </ul>`,
          confidence: 0.82,
        },
      },
      ar: {
        greeting: 'لقد قمت بتحليل استفسارك. استناداً إلى البيانات المتاحة والإطار التنظيمي لGCC، إليك Findings:
        noContext: 'كيف يمكنني مساعدتك أكثر؟ يمكنك السؤال عن درجات محددة أو أنظمة أو تخفيفات المخاطر.',
        scoreAnalysis: {
          text: `<p><strong>تحليل التقييم</strong></p>
          <p>التقييم: <strong>${context.score}</strong> (الدرجة: ${context.grade})</p>
          <p><strong>العوامل الرئيسية:</strong></p>
          <ul>
            <li>🔴 نسبة الـ DSR: ${context.dsr}% — ${context.dsr > 50 ? 'تتجاوز حد المصرف المركزي 50%' : 'داخل الحد المسموح'}</li>
            ${context.dsr > 50 ? '<li>📉 يُنصح بخفض مبلغ القرض لجلب الـ DSR تحت 50%</li>' : ''}</li>
          </ul>`,
          confidence: 0.88,
        },
        regulations: {
          text: `<p><strong>السياق التنظيمي — ${context.product || 'اتخاذ القرار الائتماني'}</strong></p>
          <p>وفقاً لتوجيهات المصرف المركزي:</p>
          <ul>
            <li>يجب ألا تتجاوز نسبة عبء الدين 50% من الدخل الشهري</li>
            <li>الحد الأدنى للراتب: 5,000 درهم</li>
            <li>أقصى مدة للقروض الاستهلاكية: 4 سنوات</li>
            <li>تتطلب جميع القرارات تبريراً موثقاً</li>
          </ul>`,
          confidence: 0.95,
        },
        mitigations: {
          text: `<p><strong>تخفيفات المخاطر المقترحة:</strong></p>
          <ul>
            <li>📉 خفض مبلغ القرض بنسبة 15% لجلب الـ DSR ضمن الحدود</li>
            <li>📄 طلب شهادات الراتب لمدة 6 أشهر للتحقق</li>
            <li>⏱️ النظر في مدة أقصر لتقليل إجمالي الفائدة</li>
            <li>🔒 طلب خطوة تخصيص الراتب من صاحب العمل</li>
            <li>👤 النظر في إضافة ضامن لتعزيز الطلب</li>
          </ul>`,
          confidence: 0.82,
        },
      }
    }

    if (lower.includes('explain') || lower.includes('score') || lower.includes('تقييم') || lower.includes('شرح')) {
      return t[lang].scoreAnalysis
    }
    if (lower.includes('regulat') || lower.includes('law') || lower.includes('قانون') || lower.includes('نظام') || lower.includes('regul')) {
      return t[lang].regulations
    }
    if (lower.includes('mitigat') || lower.includes('suggest') || lower.includes('تخفيف') || lower.includes('اقتراح') || lower.includes('حل')) {
      return t[lang].mitigations
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('مرحبا') || lower.includes('صباح') || lower.includes('مساء')) {
      return {
        text: lang === 'ar' ?
          `<p>أهلاً وسهلاً! أنا المساعد الذكي لمنصة تقييم الائتمان RLens.</p>
           <p>كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالني عن:</p>
           <ul>
             <li>📊 شرح التقييمات الائتمانية</li>
             <li>📜 الأنظمة والقوانين التنظيمية</li>
             <li>💡 اقتراحات لتخفيف المخاطر</li>
             <li>🏢 تحليل ملفات العملاء</li>
           </ul>` :
          `<p>Hello! I'm the AI Copilot for RLens credit scoring platform.</p>
           <p>How can I help you today? You can ask me about:</p>
           <ul>
             <li>📊 Credit score explanations</li>
             <li>📜 Regulatory frameworks</li>
             <li>💡 Risk mitigation suggestions</li>
             <li>🏢 Customer profile analysis</li>
           </ul>`,
        confidence: 0.95,
      }
    }
    return {
      text: lang === 'ar' ? t.ar.noContext : t.en.noContext,
      confidence: 0.7,
    }
  }

  const commands = [
    { icon: '📊', label: lang === 'ar' ? 'شرح التقييم' : 'Explain Score', prompt: 'Explain the credit score' },
    { icon: '⚖️', label: lang === 'ar' ? 'اقتراح قرار' : 'Suggest Decision', prompt: 'Suggest a decision for this application' },
    { icon: '📜', label: lang === 'ar' ? 'الأنظمة' : 'Regulations', prompt: 'What are the CBUAE regulations?' },
    { icon: '💡', label: lang === 'ar' ? 'تخفيفات' : 'Mitigations', prompt: 'Suggest risk mitigations' },
  ]

  return (
    <div className="copilot-page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Chat panel */}
          <Card style={{ padding: 'var(--spacing-md)', height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>
                  🤖
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'المساعد الذكي' : 'AI Copilot'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald)' }} />
                    {lang === 'ar' ? 'نشط' : 'Active'}
                  </div>
                </div>
              </div>
              <Badge variant="success" size="sm">v2.0</Badge>
            </div>

            <div className="copilot-messages" style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
              {messages.length === 0 && (
                <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-sm)' }}>👋</div>
                  <p style={{ fontSize: '13px' }}>
                    {lang === 'ar' ? 'أنا هنا لمساعدتك في تحليل الائتمان والقرارات' : 'I\'m here to help with credit analysis and decisions'}
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="copilot-message" style={{ marginBottom: 'var(--spacing-sm)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-lg)', maxWidth: '85%', overflow: 'hidden' }}>
                  {msg.role === 'user' ? (
                    <>
                      <div style={{ alignSelf: 'flex-end', background: 'var(--primary-500)', color: 'white', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)' }}>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: 4 }}>
                        {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                          <span style={{ fontSize: '12px' }}>🤖</span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary-500)' }}>{lang === 'ar' ? 'المساعد الذكي' : 'AI Copilot'}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: msg.text }} />
                        {msg.confidence !== undefined && (
                          <div style={{ marginTop: 'var(--spacing-xs)', paddingTop: 'var(--spacing-xs)', borderTop: '1px solid var(--border)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                            Confidence: {(msg.confidence * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 4 }}>
                        {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="copilot-typing" style={{ padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)', marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <span style={{ fontSize: '12px' }}>🤖</span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'pulse 1.4s infinite ease-in-out' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'pulse 1.4s infinite ease-in-out 0.2s' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'pulse 1.4s infinite ease-in-out 0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="copilot-input-area" style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(inputValue)}
                placeholder={lang === 'ar' ? 'اسأل المساعد... ' : 'Ask Copilot...'}
                style={{ flex: 1, padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              />
              <Button variant="primary" onClick={() => sendMessage(inputValue)} disabled={!inputValue.trim() || isTyping}>
                {lang === 'ar' ? 'إرسال' : 'Send'}
              </Button>
            </div>
          </Card>

          {/* Context panel */}
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              {lang === 'ar' ? 'السياق الحالي' : 'Current Context'}
            </h3>
            {selectedApp ? (
              <>
                <div style={{ padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>{lang === 'ar' ? 'الطلب المختار' : 'Selected Application'}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
                    {lang === 'ar' ? selectedApp.nameAr : selectedApp.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>{selectedApp.id}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xs)' }}>
                  {[
                    { label: lang === 'ar' ? 'التقييم' : 'Score', value: `${selectedApp.score} / 850` },
                    { label: lang === 'ar' ? 'الدرجة' : 'Grade', value: selectedApp.grade },
                    { label: lang === 'ar' ? 'النسبة' : 'DSR', value: `${(selectedApp.dsr * 100).toFixed(0)}%` },
                    { label: lang === 'ar' ? 'المنتج' : 'Product', value: selectedApp.product },
                    { label: lang === 'ar' ? 'المبلغ' : 'Amount', value: `${selectedApp.currency} ${selectedApp.amount?.toLocaleString()}` },
                    { label: lang === 'ar' ? 'الدولة' : 'Country', value: COUNTRIES[selectedApp.country]?.name },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                {lang === 'ar' ? 'لا يوجد طلب مختار. اختر من الصفحة الرئيسية.' : 'No application selected. Choose from the dashboard.'}
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={() => { const app = APPLICATIONS[0]; setSelectedApp(app); evaluate(app) }} style={{ width: '100%', marginTop: 'var(--spacing-sm)' }}>
              {lang === 'ar' ? 'اختيار طلب عشوائي' : 'Select Random App'}
            </Button>
          </Card>
        </div>

        {/* Command center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              {lang === 'ar' ? 'الأوامر السريعة' : 'Quick Commands'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {commands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(cmd.prompt)}
                  className="copilot-command"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{cmd.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{cmd.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>🔌</span>
              {lang === 'ar' ? 'التكاملات المتاحة' : 'Available Integrations'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {[
                { name: 'Scoring API', status: 'Connected', icon: '✅' },
                { name: 'RAG Engine', status: 'Connected', icon: '✅' },
                { name: 'Fraud Service', status: 'Connected', icon: '✅' },
                { name: 'Model Registry', status: 'Connected', icon: '✅' },
                { name: 'AML Screening', status: 'Connected', icon: '✅' },
              ].map((integration, i) => (
                <div key={i} className="integration-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <span style={{ fontSize: '12px' }}>{integration.icon}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{integration.name}</span>
                  </div>
                  <Badge variant="success" size="sm">{integration.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>⚙️</span>
              {lang === 'ar' ? 'الإعدادات' : 'Settings'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {[
                { label: lang === 'ar' ? 'النموذج الافتراضي' : 'Default Model', value: 'GPT-4 Turbo' },
                { label: lang === 'ar' ? 'اللغة الافتراضية' : 'Default Language', value: lang === 'ar' ? 'العربية' : 'English' },
                { label: lang === 'ar' ? 'درجة الثقة الدنيا' : 'Min Confidence', value: '80%' },
                { label: lang === 'ar' ? 'سجل المحادثات' : 'Chat History', value: 'Enabled' },
              ].map((setting, i) => (
                <div key={i} className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm)', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{setting.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{setting.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
