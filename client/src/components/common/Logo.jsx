import { C } from "../../utils/color"

function Logo({ size = 'md' }) {
  const s = size === 'sm' ? { icon: 28, text: 15 } : { icon: 36, text: 20 }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: s.icon, height: s.icon, backgroundColor: C.primary, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={s.icon * 0.55} height={s.icon * 0.55} viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h9M3 15h6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="16" cy="13" r="3.5" fill="#fff" opacity="0.9"/>
          <path d="M14.5 13l1 1 2-2" stroke={C.primary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ fontSize: s.text, fontWeight: 700, color: C.dark, letterSpacing: '-0.3px' }}>TaskFlow</span>
    </div>
  )
}

export default Logo