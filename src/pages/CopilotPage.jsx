import React, { useState, useCallback } from 'react'

const REGISTERED_COMMANDS = {
  '/loanScenario': { ar: 'تقديم سيناريو قرض', en: 'Submit a loan scenario' },
  '/riskProfile': { ar: 'الحصول على ملف المخاطر', en: 'Get risk profile' },
  '/marketInsight': { ar: 'رؤية سوقية', en: 'Market insight' },
  '/regulatoryCheck': { ar: 'فحص تنظيمي', en: 'Regulatory check' },
  '/portfolioAnalysis': { ar: 'تحليل المحفظة', en: 'Portfolio analysis' },
  '/riskSummary': { ar: 'ملخص المخاطر', en: 'Risk summary' },
}

function CopilotChat({ chat, setChat, locale }) {
  const [input, setInput] = useState('')
  const [cursor, setCursor] = useState(false)

  const handleSend = useCallback(
    (msg) => {
      if (!msg.trim()) return
      const userMsg = { role: 'user', content: msg.trim() }
      setChat(prev => [...prev, userMsg])
      setCursor(true)
      const commandKey = Object.keys(REGISTERED_COMMANDS).find(
        k => msg.trim().startsWith(k),
      )
      const reply = commandKey
        ? locale === 'ar'
          ? `تم التنفيذ: ${commandKey}`
          : `Executed: ${commandKey}`
        : locale === 'ar'
        ? 'عذراً، لم أفهم الأمر. جرب /loanScenario، /riskProfile، /marketInsight، /regulatoryCheck، /portfolioAnalysis، /riskSummary.'
        : 'Sorry, I did not understand. Try /loanScenario, /riskProfile, /marketInsight, /regulatoryCheck, /portfolioAnalysis, /riskSummary.'
      setTimeout(() => {
        setChat(prev => [...prev, { role: 'assistant', content: reply }])
        setCursor(false)
      }, 500)
    },
    [locale, setChat],
  )

  return (
    <div className="copilot-chat">
      <div className="chat-messages">
        {chat.length === 0 ? (
          <div className="chat-message chat-assistant">
            <div className="chat-avatar">🤖</div>
            <div className="chat-bubble">
              {locale === 'ar'
                ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟ جرب الأوامر: /loanScenario، /riskProfile، /marketInsight.'
                : 'Hello! How can I help you? Try: /loanScenario, /riskProfile, /marketInsight.'}
            </div>
          </div>
        ) : null}
        {chat.map((m, i) => (
          <div key={i} className={`chat-message chat-${m.role}`}>
            {m.role === 'assistant' && <div className="chat-avatar">🤖</div>}
            <div className="chat-bubble">{m.content}</div>
          </div>
        ))}
        {cursor && (
          <div className="chat-typing">
            {locale === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
          </div>
        )}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend(input)
            }
          }}
          placeholder={locale === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
        />
        <button
          className="chat-send"
          onClick={() => handleSend(input)}
        >
          {locale === 'ar' ? 'إرسال' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export function CopilotPage({ titles, locale }) {
  const [chat, setChat] = useState([])

  return (
    <div className="copilot-page">
      <h1>{titles?.copilot?.[locale] || 'AI Copilot'}</h1>
      <div className="copilot-layout">
        <div className="chat-panel">
          <CopilotChat chat={chat} setChat={setChat} locale={locale} />
        </div>
        <div className="command-panel">
          <h2>
            {locale === 'ar' ? 'الأوامر المتاحة' : 'Available Commands'}
          </h2>
          <div className="commands-grid">
            {Object.entries(REGISTERED_COMMANDS).map(([cmd, info]) => (
              <div key={cmd} className="command-card">
                <div className="command-name">{cmd}</div>
                <div className="command-desc">
                  {locale === 'ar' ? info.ar : info.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
