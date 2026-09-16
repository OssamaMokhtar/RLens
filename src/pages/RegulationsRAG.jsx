import React, { useState, useMemo } from 'react'
import data from '../lib/data'

const CATEGORIES = [
  { key: 'all', label: 'All Categories' },
  { key: 'regulatory', label: 'Regulatory' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'operational', label: 'Operational' },
]

export function RegulationsRAG({ titles, locale }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDoc, setSelectedDoc] = useState(null)

  const filteredDocs = useMemo(() => {
    if (selectedCategory === 'all') return data.regulatoryDocs || []
    return (data.regulatoryDocs || []).filter(doc => doc.category.toLowerCase() === selectedCategory.toLowerCase())
  }, [selectedCategory])

  return (
    <div className="regulations-page">
      <h1>
        {titles?.regulations?.[locale] || 'Regulations & Guidelines'}
      </h1>

      {/* Category Filter */}
      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document List */}
      <div className="documents-grid">
        {filteredDocs.length === 0 ? (
          <div className="empty-state">
            {locale === 'ar' ? 'لا توجد مستندات' : 'No documents found'}
          </div>
        ) : (
          filteredDocs.map(doc => (
            <div
              key={doc.id}
              className={`document-card ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="doc-icon">📄</div>
              <div className="doc-info">
                <div className="doc-title">{doc.title}</div>
                <div className="doc-meta">
                  <span className="doc-category">{doc.category}</span>
                  <span className="doc-date">{doc.date}</span>
                </div>
              </div>
              <div className="doc-action">
                <span className="view-btn">View</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <Modal
          titleEn={selectedDoc.title}
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
        >
          <div className="document-detail">
            <div className="detail-row">
              <label>Category</label>
              <span className="category-badge">{selectedDoc.category}</span>
            </div>
            <div className="detail-row">
              <label>Date</label>
              <span>{selectedDoc.date}</span>
            </div>
            <div className="detail-row">
              <label>Document ID</label>
              <span>{selectedDoc.id}</span>
            </div>
            <div className="detail-content">
              <h3>Regulations Content</h3>
              <p>
                This document outlines the regulatory framework and compliance requirements
                for credit scoring operations in the GCC region. It covers the key guidelines
                issued by the Central Bank and relevant regulatory bodies.
              </p>
              <h4>Key Requirements</h4>
              <ul>
                <li>Credit scoring models must be validated annually</li>
                <li>Fair lending practices must be documented and monitored</li>
                <li>Consumer data protection must comply with local privacy laws</li>
                <li>Model risk management framework must be in place</li>
                <li>Regular audits of scoring methodologies are required</li>
              </ul>
              <h4>Implementation Notes</h4>
              <p>
                Ensure all scoring models adhere to the CBUAE guidelines and maintain
                proper documentation for regulatory review. The compliance team should
                review updates quarterly.
              </p>
            </div>
            <div className="detail-actions">
              <button className="btn-primary" onClick={() => setSelectedDoc(null)}>
                {locale === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
