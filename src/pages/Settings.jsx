import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Shield, Sun, Moon, Monitor, Camera, Save, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const tabs = [
  { id:'profile', label:'Profile', icon:User },
  { id:'password', label:'Password', icon:Lock },
  { id:'notifications', label:'Notifications', icon:Bell },
  { id:'appearance', label:'Appearance', icon:Globe },
];

export default function Settings() {
  const { darkMode, setDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name:'Super Admin', email:'admin@store.com', phone:'+1 555-0100', company:'AdminFlow Inc.', role:'Super Admin', bio:'Managing the e-commerce platform with 5+ years of experience.' });
  const [pwForm, setPwForm] = useState({ current:'', newPw:'', confirm:'' });
  const [showPw, setShowPw] = useState({});
  const [notifs, setNotifs] = useState({ orderPlaced:true, userSignup:true, lowStock:true, payment:true, promo:false, weekly:true, security:true });
  const [theme, setTheme] = useState(darkMode ? 'dark' : 'light');

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!pwForm.current) { toast.error('Enter current password'); return; }
    if (pwForm.newPw.length < 6) { toast.error('Password must be 6+ characters'); return; }
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    toast.success('Password changed successfully!');
    setPwForm({ current:'', newPw:'', confirm:'' });
  };

  const handleThemeChange = (t) => {
    setTheme(t);
    setDarkMode(t === 'dark');
    toast.success(`Theme changed to ${t} mode`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 max-w-5xl">
      {/* Tabs */}
      <div className="card p-2 lg:w-56 h-fit flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${activeTab === t.id ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 card p-6">
        {/* Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-5">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Profile Information</h3>
              <p className="text-xs text-slate-400">Update your account profile details.</p>
            </div>
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-500/30">SA</div>
                <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-brand-700 transition-colors">
                  <Camera size={13} />
                </button>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{profile.name}</p>
                <p className="text-sm text-slate-400">{profile.role}</p>
                <button type="button" className="text-xs text-brand-500 hover:text-brand-600 mt-1">Change photo</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['Full Name','name','text'],['Email','email','email'],['Phone','phone','tel'],['Company','company','text']].map(([l,k,t]) => (
                <div key={k}>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">{l}</label>
                  <input type={t} className="input text-sm" value={profile[k]} onChange={e => setProfile({...profile,[k]:e.target.value})} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">Bio</label>
                <textarea className="input text-sm resize-none" rows={3} value={profile.bio} onChange={e => setProfile({...profile,bio:e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 px-6"><Save size={15} /> Save Profile</button>
          </form>
        )}

        {/* Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSave} className="space-y-5">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Change Password</h3>
              <p className="text-xs text-slate-400">Keep your account secure with a strong password.</p>
            </div>
            {[['Current Password','current'],['New Password','newPw'],['Confirm New Password','confirm']].map(([l,k]) => (
              <div key={k}>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">{l}</label>
                <div className="relative">
                  <input type={showPw[k] ? 'text' : 'password'} className="input text-sm pr-10" placeholder={l} value={pwForm[k]} onChange={e => setPwForm({...pwForm,[k]:e.target.value})} />
                  <button type="button" onClick={() => setShowPw({...showPw,[k]:!showPw[k]})} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw[k] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
            {pwForm.newPw && (
              <div className="flex gap-1">
                {[4,8,12,16].map(n => (
                  <div key={n} className={`flex-1 h-1.5 rounded-full transition-colors ${pwForm.newPw.length >= n ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
                <span className="text-xs text-slate-400 ml-2">{pwForm.newPw.length < 8 ? 'Weak' : pwForm.newPw.length < 12 ? 'Fair' : 'Strong'}</span>
              </div>
            )}
            <button type="submit" className="btn-primary flex items-center gap-2 px-6"><Shield size={15} /> Update Password</button>
          </form>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Notification Preferences</h3>
              <p className="text-xs text-slate-400">Choose what notifications to receive.</p>
            </div>
            <div className="space-y-1">
              {[
                { key:'orderPlaced', label:'New Order Placed', desc:'Get notified when a new order is placed' },
                { key:'userSignup', label:'User Registration', desc:'Alerts when new users register' },
                { key:'lowStock', label:'Low Stock Alert', desc:'When product stock drops below threshold' },
                { key:'payment', label:'Payment Received', desc:'Notifications for successful payments' },
                { key:'promo', label:'Promotional Updates', desc:'Marketing and promotion notifications' },
                { key:'weekly', label:'Weekly Reports', desc:'Weekly summary email every Monday' },
                { key:'security', label:'Security Alerts', desc:'Login attempts and security events' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{n.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                  <button onClick={() => { setNotifs({...notifs,[n.key]:!notifs[n.key]}); toast.success('Preference updated'); }} className={`relative w-11 h-6 rounded-full transition-colors ${notifs[n.key] ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[n.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Appearance</h3>
              <p className="text-xs text-slate-400">Customize how the dashboard looks.</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Theme Mode</p>
              <div className="grid grid-cols-3 gap-3">
                {[{ id:'light', label:'Light', icon:Sun },{ id:'dark', label:'Dark', icon:Moon },{ id:'system', label:'System', icon:Monitor }].map(t => (
                  <button key={t.id} onClick={() => handleThemeChange(t.id)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`}>
                    <t.icon size={20} className={theme === t.id ? 'text-brand-600' : 'text-slate-400'} />
                    <span className={`text-sm font-medium ${theme === t.id ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>{t.label}</span>
                    {theme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Accent Color</p>
              <div className="flex gap-3">
                {['#0ea5e9','#8b5cf6','#f97316','#22c55e','#ef4444','#ec4899'].map(c => (
                  <button key={c} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 shadow-md hover:scale-110 transition-transform" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
