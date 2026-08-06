import React from 'react'
import {
  Activity, Layers, Shield, Zap, AlertTriangle, BarChart2,
  ChevronRight, Cpu, FileText, HelpCircle, BookOpen
} from 'lucide-react'

const MENU = [
  { id: 'overview',           label: 'Overview',              icon: Activity },
  { id: 'common-mem',         label: 'Common MEM',            icon: Layers },
  { id: 'borehole-stability', label: 'Borehole Stability',    icon: Shield },
  { id: 'hydraulic-frac',     label: 'Hydraulic Fracturing',  icon: Zap },
  { id: 'faults-geohazard',   label: 'Faults & Geohazard',    icon: AlertTriangle },
  { id: 'uncertainty',        label: 'Uncertainty',           icon: BarChart2 },
  { id: 'data-requirements',  label: 'Data Requirements',     icon: FileText },
  { id: 'engine-workflow',    label: 'Engine Workflow',       icon: Activity },
  { id: 'validation',         label: 'Validation Checklist',  icon: Shield },
  { id: 'report',             label: 'Report',                icon: FileText },
  { id: 'how-to-use',         label: 'How to Use',            icon: HelpCircle },
  { id: 'glossary',           label: 'Glossary',              icon: BookOpen },
]

export default function Sidebar({ activeMenu, onMenuChange, well, lastUpdated }) {
  return (
    <aside className="flex flex-col h-full" style={{
      width: 210,
      background: '#040b17', // Peledakan warna gelap premium
      borderRight: '1px solid rgba(56,189,248,0.1)',
      flexShrink: 0,
    }}>
      <style>{`
        .sidebar-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          margin: 2px 8px;
          border-radius: 6px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .sidebar-menu-item:hover {
          background: rgba(255,255,255,0.03);
          color: #e2e8f0;
        }
        .sidebar-menu-item.active {
          background: linear-gradient(90deg, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.02) 100%);
          color: #38bdf8;
          font-weight: 600;
          box-shadow: inset 2px 0 0 #38bdf8;
        }
        .sidebar-menu-item.active svg {
          filter: drop-shadow(0 0 4px rgba(56,189,248,0.5));
        }
      `}</style>

      {/* ── Logo Area ──────────────────────────────────────────────────────── */}
      <div className="px-4 py-5 border-b flex flex-col gap-1" style={{ borderColor: 'rgba(56,189,248,0.1)', background: 'linear-gradient(180deg, #071326 0%, #040b17 100%)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0284c7, #3b82f6)',
              boxShadow: '0 0 12px rgba(59,130,246,0.3)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
            <Cpu size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 900, color: '#f8fafc', lineHeight: 1.1, letterSpacing: '0.02em' }}>HF Design</div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#38bdf8', lineHeight: 1.1, letterSpacing: '0.05em' }}>Engine</div>
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div style={{
          fontSize: 11, color: '#475569', fontWeight: 700,
          letterSpacing: '0.12em', padding: '0 16px 8px', textTransform: 'uppercase'
        }}>
          Navigation
        </div>

        {MENU.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`sidebar-menu-item ${activeMenu === id ? 'active' : ''}`}
            onClick={() => onMenuChange(id)}
          >
            <Icon size={14} className="opacity-80" />
            <span className="flex-1">{label}</span>
            {activeMenu === id && <ChevronRight size={12} className="opacity-70" />}
          </div>
        ))}
      </nav>

      {/* ── Well Overview Panel ────────────────────────────────────────────── */}
      {well && (
        <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(56,189,248,0.1)', background: 'rgba(7,15,34,0.4)' }}>
          <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, px: 2 }}>
            Well Overview
          </div>
          
          <div className="flex flex-col gap-0.5">
            <WellRow label="TVD"          value={`${well.tvd_ft?.toLocaleString()} ft`} />
            <WellRow label="MD"           value={`${well.md_ft?.toLocaleString()} ft`} />
            <WellRow label="Inclination"  value={`${well.inclination_deg}°`} />
            <WellRow label="Azimuth"      value={`${well.azimuth_deg}°`} />
            <WellRow label="Hole Size"    value={`${well.hole_size_in} in`} />
            <WellRow label="Reservoir Top" value={`${well.reservoir_top_ft?.toLocaleString()} ft`} />
            <WellRow label="Reservoir Base" value={`${well.reservoir_base_ft?.toLocaleString()} ft`} />
            <WellRow label="Net Pay"      value={`${well.net_pay_ft} ft`} />
            <WellRow label="Formation"    value={well.formation} />
            <WellRow label="Temperature"  value={`${well.temperature_f}°F`} />
          </div>

          <div style={{
            marginTop: 12, padding: '6px 8px',
            background: 'rgba(34,197,94,0.05)', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid rgba(34,197,94,0.1)'
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>
              Updated: <span style={{ color: '#94a3b8' }}>{lastUpdated}</span>
            </span>
          </div>
        </div>
      )}
    </aside>
  )
}

function WellRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '4px 8px', borderRadius: 4,
      background: 'rgba(255,255,255,0.015)'
    }}>
      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 11, color: '#f8fafc', fontWeight: 700 }}>{value}</span>
    </div>
  )
}
