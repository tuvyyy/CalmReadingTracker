// src/components/BottomTabs.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, AlertCircle, BookMarked, Settings } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

export default function BottomTabs() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const { t }        = useLang();

  const TABS = [
    { path: '/',         Icon: Home,          labelKey: 'home'     },
    { path: '/tests',    Icon: BookOpen,      labelKey: 'tests'    },
    { path: '/wrong',    Icon: AlertCircle,   labelKey: 'wrong'    },
    { path: '/vocab',    Icon: BookMarked,    labelKey: 'vocab'    },
    { path: '/settings', Icon: Settings,      labelKey: 'settings' },
  ] as const;

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="bottom-tabs" aria-label="Điều hướng chính">
      {TABS.map(({ path, Icon, labelKey }) => {
        const active = isActive(path);
        const label  = t('nav', labelKey);
        return (
          <button
            key={path}
            className={`tab-item${active ? ' active' : ''}`}
            onClick={() => navigate(path)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <span className="tab-item__icon">
              <Icon size={16} strokeWidth={active ? 2.4 : 1.8} />
            </span>
            <span className="tab-item__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
