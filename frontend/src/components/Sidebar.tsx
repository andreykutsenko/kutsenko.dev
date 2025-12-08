import { NavLink } from 'react-router-dom';
import { 
  Terminal, 
  Activity,
  User, 
  Bot, 
  Mail, 
  X,
  Cpu
} from 'lucide-react';
import type { Theme, Lang } from '../types';
import './Sidebar.css';

interface SidebarProps {
  theme: Theme;
  lang: Lang;
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ t, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Close button (mobile) */}
        <button 
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        {/* Identity Block */}
        <div className="sidebar-head">
          <div className="sidebar-icon">
            <Terminal size={20} />
          </div>
          <div className="sidebar-meta">
            <p className="sidebar-title">kutsenko.dev</p>
            <p className="sidebar-subline">$ root access</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-label">Active agents</p>
          
          <NavItem 
            to="/" 
            icon={<Activity size={18} />} 
            label="Home / Dashboard" 
          />
          <NavItem 
            to="/agents" 
            icon={<Bot size={18} />} 
            label={t('nav.agents')} 
          />
          <NavItem 
            to="/about" 
            icon={<User size={18} />} 
            label="About / Profile" 
          />
          
          <div className="nav-divider" />
          
          <a 
            href="mailto:kutsenko@gmail.com" 
            className="nav-link nav-link--external"
          >
            <Mail size={18} />
            <span className="nav-text">Contact Uplink</span>
          </a>
        </nav>

        {/* System Stats (decorative) */}
        <div className="sidebar-footer">
          <div className="stat-card">
            <div className="stat-row">
              <span><Cpu size={12} /> CPU Load</span>
              <strong>12%</strong>
            </div>
            <div className="stat-bar">
              <span style={{ width: '12%' }} />
            </div>
            <div className="stat-row">
              <span>Memory</span>
              <strong className="text-purple">48%</strong>
            </div>
            <div className="stat-bar stat-bar--alt">
              <span style={{ width: '48%' }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `nav-link ${isActive ? 'nav-link--active' : ''}`
      }
    >
      {icon}
      <span className="nav-text">{label}</span>
      {/* Active indicator dot shown via CSS */}
    </NavLink>
  );
}
