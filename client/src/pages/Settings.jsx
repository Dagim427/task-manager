import { useState } from "react"
import { C,SH,SH_MD } from "../utils/color"
import Input from "../components/common/Input.jsx"
import Label from "../components/common/Label"
import Btn from "../components/common/Btn"

export function Settings() {
  const [accountName, setAccountName] = useState('Alex Johnson')
  const [accountEmail, setAccountEmail] = useState('alex.johnson@example.com')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true, reminders: true })
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)} style={{ width: 42, height: 24, borderRadius: 12, backgroundColor: value ? C.primary : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 21 : 3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', boxShadow: SH, transition: 'left 0.2s' }} />
    </button>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 4 }}>Settings</h1>
          <p style={{ fontSize: 14, color: C.mid }}>Manage your preferences and account configuration.</p>
        </div>
        <div style={{ backgroundColor: C.white, borderRadius: 14, padding: 28, boxShadow: SH_MD, marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 20 }}>Account</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><Label>Full Name</Label><Input value={accountName} onChange={setAccountName} /></div>
            <div><Label>Email Address</Label><Input type="email" value={accountEmail} onChange={setAccountEmail} /></div>
            <div><Label>Username</Label><Input value="@alexj" onChange={() => {}} /></div>
          </div>
        </div>
        <div style={{ backgroundColor: C.white, borderRadius: 14, padding: 28, boxShadow: SH_MD, marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 20 }}>Change Password</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><Label>Current Password</Label><Input type="password" placeholder="••••••••" value={currentPass} onChange={setCurrentPass} /></div>
            <div><Label>New Password</Label><Input type="password" placeholder="Enter new password" value={newPass} onChange={setNewPass} /></div>
            <div><Label>Confirm New Password</Label><Input type="password" placeholder="Repeat new password" value={confirmPass} onChange={setConfirmPass} /></div>
          </div>
        </div>
        <div style={{ backgroundColor: C.white, borderRadius: 14, padding: 28, boxShadow: SH_MD, marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 20 }}>Notifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {([
              { key: 'email', label: 'Email notifications', desc: 'Receive updates and alerts via email' },
              { key: 'push', label: 'Push notifications', desc: 'Receive real-time browser notifications' },
              { key: 'weekly', label: 'Weekly digest', desc: 'Get a summary of your week every Monday' },
              { key: 'reminders', label: 'Task reminders', desc: 'Get reminded before task due dates' },
            ] ).map(({ key, label, desc }, i, arr) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: i === 0 ? 0 : 16, paddingBottom: i === arr.length - 1 ? 0 : 16, borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{label}</div>
                  <div style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>{desc}</div>
                </div>
                <Toggle value={notifs[key]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ backgroundColor: C.white, borderRadius: 14, padding: 28, boxShadow: SH_MD, marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 20 }}>Appearance</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Light', 'System'].map(mode => (
              <div key={mode} style={{ flex: 1, padding: '14px 16px', borderRadius: 10, border: `2px solid ${mode === 'Light' ? C.primary : C.border}`, backgroundColor: mode === 'Light' ? C.primaryLight : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{mode === 'Light' ? '☀️' : '💻'}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: mode === 'Light' ? C.primary : C.mid }}>{mode}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.light, marginTop: 12 }}>Dark mode coming soon.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Btn onClick={handleSave}>Save Changes</Btn>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8, backgroundColor: '#ECFDF5', border: `1px solid ${C.success}`, fontSize: 13, color: C.success, fontWeight: 500 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Settings saved!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}