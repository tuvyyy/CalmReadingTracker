import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import type { Lang } from '../i18n/translations';
import { dbService } from '../services/dbService';
import {
  Languages,
  Clock,
  Volume2,
  Highlighter,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Info,
  ChevronRight,
  Bell,
} from 'lucide-react';

// ── Reusable row components ──────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{
      padding: '6px 4px 10px',
      fontSize: '0.62rem',
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--silver)',
      fontFamily: 'var(--font-label)',
    }}>
      {label}
    </div>
  );
}

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingsRow({ icon, label, sub, right, onClick, danger }: SettingsRowProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        padding: '14px 16px',
        background: 'none',
        border: 'none',
        borderRadius: 0,
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        transition: 'background 0.15s ease',
      }}
      onMouseOver={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
    >
      {/* Icon */}
      <span style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: danger ? 'rgba(255,139,139,0.08)' : 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: danger ? 'var(--danger)' : 'var(--silver)',
        flexShrink: 0,
      }}>
        {icon}
      </span>

      {/* Text */}
      <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <span style={{
          display: 'block',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: danger ? 'var(--danger)' : 'var(--foam)',
          fontFamily: 'var(--font-body)',
        }}>
          {label}
        </span>
        {sub && (
          <span style={{
            display: 'block',
            fontSize: '0.7rem',
            color: 'var(--silver)',
            marginTop: 2,
            fontFamily: 'var(--font-body)',
          }}>
            {sub}
          </span>
        )}
      </span>

      {/* Right slot */}
      {right && (
        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {right}
        </span>
      )}

      {/* Chevron (if clickable and no custom right) */}
      {onClick && !right && (
        <ChevronRight size={15} color="var(--silver)" />
      )}
    </button>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        background: checked
          ? 'linear-gradient(135deg, var(--aqua), var(--foam))'
          : 'rgba(255,255,255,0.08)',
        border: `1px solid ${checked ? 'var(--aqua)' : 'rgba(255,255,255,0.1)'}`,
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        transition: 'all 0.22s ease',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: checked ? '0 0 10px rgba(142,216,232,0.25)' : 'none',
      }}
    >
      <span style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: checked ? 'var(--ink)' : 'var(--silver)',
        display: 'block',
        transition: 'all 0.22s ease',
        flexShrink: 0,
      }} />
    </button>
  );
}

// ── Language selector pill pair ──────────────────
interface LangPillProps {
  value: Lang;
  onChange: (l: Lang) => void;
  labelVi: string;
  labelEn: string;
}

function LangPills({ value, onChange, labelVi, labelEn }: LangPillProps) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      padding: '2px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 999,
    }}>
      {(['vi', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => onChange(l)}
          style={{
            padding: '7px 16px',
            borderRadius: 999,
            fontFamily: 'var(--font-label)',
            fontSize: '0.75rem',
            fontWeight: 700,
            background: value === l
              ? 'linear-gradient(135deg, var(--aqua), var(--foam))'
              : 'transparent',
            color: value === l ? 'var(--ink)' : 'var(--silver)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: value === l ? '0 2px 8px rgba(142,216,232,0.2)' : 'none',
          }}
        >
          {l === 'vi' ? labelVi : labelEn}
        </button>
      ))}
    </div>
  );
}

// ── Divider ──────────────────────────────────────
function Divider() {
  return (
    <div style={{
      height: 1,
      background: 'rgba(255,255,255,0.05)',
      margin: '0 16px',
    }} />
  );
}

// ── Settings card group ──────────────────────────
function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(18,43,59,0.5)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    }}>
      {children}
    </div>
  );
}

// ── Main page ────────────────────────────────────
export default function SettingsPage() {
  const { lang, setLang, t } = useLang();

  // Local toggle states (would persist to localStorage in a full app)
  const [showTimer,    setShowTimer]    = useBoolPref('pref_timer',     true);
  const [playSound,    setPlaySound]    = useBoolPref('pref_sound',     true);
  const [highlightRow, setHighlightRow] = useBoolPref('pref_highlight', true);
  const [callAlarm, setCallAlarm] = useBoolPref('pref_call_alarm', true);
  const [alarmTime, setAlarmTime] = useState(() => localStorage.getItem('pref_call_alarm_time') || '20:00');
  const [notifPermission, setNotifPermission] = useState(() => 
    ('Notification' in window) ? Notification.permission : 'denied'
  );

  const updateAlarmTime = (newTime: string) => {
    setAlarmTime(newTime);
    localStorage.setItem('pref_call_alarm_time', newTime);
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifPermission(res);
    }
  };



  return (
    <>
      {/* Header */}
      <div className="page-title-section">
        <p style={{
          fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--aqua)', marginBottom: 8,
        }}>
          {t('settings', 'eyebrow')}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700,
          letterSpacing: '-0.02em', color: 'var(--foam)',
        }}>
          {t('settings', 'title')}
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--silver)', marginTop: 6 }}>
          {t('settings', 'subtitle')}
        </p>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ── Language ── */}
        <SectionHeader label={t('settings', 'section_language')} />
        <SettingsGroup>
          <SettingsRow
            icon={<Languages size={17} strokeWidth={1.8} />}
            label={t('settings', 'lang_label')}
            right={
              <LangPills
                value={lang}
                onChange={setLang}
                labelVi={t('settings', 'lang_vi')}
                labelEn={t('settings', 'lang_en')}
              />
            }
          />
        </SettingsGroup>





        {/* ── Virtual Call Reminders ── */}
        <SectionHeader label={lang === 'vi' ? 'AI Gọi Nhắc Học (Virtual Call)' : 'AI virtual call'} />
        <SettingsGroup>
          <SettingsRow
            icon={<Bell size={17} strokeWidth={1.8} />}
            label={lang === 'vi' ? 'Quyền thông báo hệ thống' : 'System Notifications'}
            sub={
              notifPermission === 'granted'
                ? (lang === 'vi' ? 'Đã cho phép thông báo' : 'Permission granted')
                : notifPermission === 'denied'
                ? (lang === 'vi' ? 'Đang bị chặn (Hãy cho phép trong cài đặt trình duyệt)' : 'Blocked (enable in browser settings)')
                : (lang === 'vi' ? 'Chưa được cấp quyền (Nhấp để yêu cầu)' : 'Not granted (click to request)')
            }
            onClick={notifPermission !== 'granted' ? requestPermission : undefined}
            right={
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: notifPermission === 'granted' ? 'var(--success)' : 'var(--danger)',
                fontFamily: 'var(--font-label)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {notifPermission === 'granted' ? 'ON' : 'OFF'}
              </span>
            }
          />
          <Divider />
          <SettingsRow
            icon={<Clock size={17} strokeWidth={1.8} />}
            label={lang === 'vi' ? 'Bật gọi nhắc hàng ngày' : 'Daily Call Alarm'}
            sub={lang === 'vi' ? `Tự động gọi lúc ${alarmTime} hàng ngày` : `Automatically calls at ${alarmTime} daily`}
            right={<Toggle checked={callAlarm} onChange={() => setCallAlarm(v => !v)} />}
          />
          <Divider />
          <SettingsRow
            icon={<Clock size={17} strokeWidth={1.8} />}
            label={lang === 'vi' ? 'Đặt giờ gọi nhắc' : 'Set Alarm Time'}
            sub={lang === 'vi' ? 'Thay đổi khung giờ gọi nhắc nhở' : 'Change daily call reminder time'}
            right={
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => updateAlarmTime(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  color: 'var(--foam)',
                  padding: '6px 10px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            }
          />
        </SettingsGroup>

        {/* ── Practice ── */}
        <SectionHeader label={t('settings', 'section_practice')} />
        <SettingsGroup>
          <SettingsRow
            icon={<Clock size={17} strokeWidth={1.8} />}
            label={t('settings', 'timer_label')}
            right={<Toggle checked={showTimer} onChange={() => setShowTimer(v => !v)} />}
          />
          <Divider />
          <SettingsRow
            icon={<Volume2 size={17} strokeWidth={1.8} />}
            label={t('settings', 'sound_label')}
            right={<Toggle checked={playSound} onChange={() => setPlaySound(v => !v)} />}
          />
          <Divider />
          <SettingsRow
            icon={<Highlighter size={17} strokeWidth={1.8} />}
            label={t('settings', 'highlight_label')}
            right={<Toggle checked={highlightRow} onChange={() => setHighlightRow(v => !v)} />}
          />
        </SettingsGroup>

        {/* ── Data ── */}
        <SectionHeader label={t('settings', 'section_data')} />
        <div className="alert alert--warn" style={{ marginBottom: 4 }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          {t('settings', 'danger_reset')}
        </div>
        <SettingsGroup>
          <SettingsRow
            icon={<Trash2 size={17} strokeWidth={1.8} />}
            label={t('settings', 'reset_wrong')}
            danger
            onClick={() => {}}
          />
          <Divider />
          <SettingsRow
            icon={<RotateCcw size={17} strokeWidth={1.8} />}
            label={t('settings', 'reset_vocab')}
            danger
            onClick={() => {}}
          />
          <Divider />
          <SettingsRow
            icon={<Trash2 size={17} strokeWidth={1.8} />}
            label={t('settings', 'reset_all')}
            danger
            onClick={() => {
              if (window.confirm(lang === 'vi' ? 'Bạn có chắc chắn muốn xóa toàn bộ dữ liệu?' : 'Are you sure you want to clear all data?')) {
                dbService.clearAllData();
                window.location.reload();
              }
            }}
          />
        </SettingsGroup>

        {/* ── About ── */}
        <SectionHeader label={t('settings', 'section_about')} />
        <SettingsGroup>
          <SettingsRow
            icon={<Info size={17} strokeWidth={1.8} />}
            label={t('settings', 'version')}
            right={
              <span style={{ fontSize: '0.78rem', color: 'var(--silver)', fontFamily: 'var(--font-label)' }}>
                v1.0.0
              </span>
            }
          />
          <Divider />
          <div style={{ padding: '12px 16px' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--silver)', lineHeight: 1.6 }}>
              {t('settings', 'built_with')}
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--silver)', opacity: 0.6, marginTop: 6 }}>
              Water Spirit Reading Tracker · 2025
            </p>
          </div>
        </SettingsGroup>

        <div style={{ height: 20 }} />
      </div>
    </>
  );
}

// ── Tiny localStorage-backed boolean preference hook ─
function useBoolPref(key: string, defaultVal: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [val, setVal] = useState<boolean>(() => {
    try {
      const s = localStorage.getItem(key);
      return s === null ? defaultVal : s === '1';
    } catch { return defaultVal; }
  });

  const setValWrapped: React.Dispatch<React.SetStateAction<boolean>> = (action) => {
    setVal(prev => {
      const next = typeof action === 'function' ? action(prev) : action;
      try { localStorage.setItem(key, next ? '1' : '0'); } catch { /* noop */ }
      return next;
    });
  };

  return [val, setValWrapped];
}
