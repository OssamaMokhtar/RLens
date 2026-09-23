# GCC AI Credit Platform — Bilingual Tone Pack & Localization Rules

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

This document outlines the authoritative bilingual tone dictionary and cultural formatting rules for the GCC AI Credit Scoring & Risk Platform. 

## 1. Cultural Sensitivity Rules
- **Respect & Formality:** Financial applications require absolute professional formality in Arabic (`الفصحى` - Modern Standard Arabic). Avoid dialects or overly casual terms.
- **Clarity over Brevity:** While English can use terse abbreviations ("Approve", "DSR"), Arabic phrasing should ensure absolute clarity even if it requires more characters (e.g., "نسبة عبء الدين").
- **Directness in Errors:** Do not use apologetic or emotional language for system errors or rejections. State the facts plainly.
- **Gender Neutrality:** Where possible, use plural or neutral verb forms to avoid exclusionary phrasing when addressing the user, though standard formal masculine plurals are acceptable in banking contexts.

## 2. Typography & RTL Rules
- **Arabic Fonts:** Use `Tajawal`, `Cairo`, or `IBM Plex Arabic`.
- **Line Height:** Arabic text requires a 10-15% increase in line height compared to English to accommodate tall ascenders (like Alif/Lam) and deep descenders (like Mem/Ya). 
  - *Example:* English `line-height: 1.5;` → Arabic `line-height: 1.6;`
- **RTL Alignment Rules:**
  - Standard text alignment flows Right-to-Left.
  - Numbers, specifically LTR components like IBANs, phone numbers, or code IDs (e.g., `AE-2026-1234`), MUST retain Left-to-Right orientation even within RTL context via `<span dir="ltr">`.
  - Icons that imply direction (e.g., back arrows, progress indicators) must be horizontally flipped. Checkmarks and "X"s remain unchanged.

## 3. Core Interaction Dictionary

### 🔘 Buttons & Actions
| Context | English | Arabic (Formal) |
|---------|---------|-----------------|
| Primary Confirmation | Approve | موافقة |
| Primary Destructive | Decline / Reject | رفض |
| Secondary Action | Save as Draft | حفظ كمسودة |
| Secondary Action | View Details | عرض التفاصيل |
| Review Request | Forward for Review | إرسال للمراجعة |
| Simulator Action | Recalculate | إعادة الحساب |

### 🚨 Alerts & Badges
| Context | English | Arabic (Formal) |
|---------|---------|-----------------|
| Status (Good) | Approved / Low Risk | معتمد / منخفض المخاطر |
| Status (Warning) | Pending / Medium Risk | قيد المراجعة / متوسط المخاطر |
| Status (Danger) | Critical / High Risk | حرج / عالي المخاطر |
| AML Status | Frozen | مجمد |

### 💬 System Messages & Empty States
| Context | English | Arabic (Formal) |
|---------|---------|-----------------|
| Success Toast | Application updated successfully. | تم تحديث الطلب بنجاح. |
| Error Message | System error. Please try again. | خطأ في النظام. يرجى المحاولة مرة أخرى. |
| Empty Alert | No active fraud alerts found. | لا توجد تنبيهات احتيال نشطة. |
| Empty Table | No records match your search. | لا توجد سجلات تطابق بحثك. |

### 🤖 Copilot Responses
| Context | English | Arabic (Formal) |
|---------|---------|-----------------|
| Greeting | How can I assist you with this application? | كيف يمكنني مساعدتك في هذا الطلب؟ |
| Clarification | Please explain the drop in SME cashflow. | يرجى توضيح الانخفاض في التدفق النقدي للشركة. |
| Disclaimer | Note: This AI summary requires human verification. | ملاحظة: يتطلب هذا الملخص تحققاً بشرياً. |
| Calculation | The new DSR exceeds the 50% regulatory limit. | تتجاوز نسبة عبء الدين الجديدة الحد التنظيمي البالغ 50٪. |

## 4. Example UI Copy

### Dashboard
- **EN:** Portfolio NPL (Non-Performing Loans) has increased by 1.2% this quarter.
- **AR:** ارتفعت نسبة القروض المتعثرة في المحفظة بنسبة 1.2٪ هذا الربع.

### Credit Scoring
- **EN:** SHAP Analysis: High credit utilization is negatively impacting the score.
- **AR:** تحليل مساهمة العوامل: الاستخدام المرتفع للائتمان يؤثر سلباً على التقييم.

### SME Lending
- **EN:** Sector risk for 'Construction' remains elevated due to macro factors.
- **AR:** لا تزال مخاطر قطاع 'البناء' مرتفعة بكثير بسبب عوامل الاقتصاد الكلي.

### Fraud / AML
- **EN:** High-velocity transactions detected across multiple jurisdictions.
- **AR:** تم رصد معاملات عالية السرعة عبر ولايات قضائية متعددة.
