import React from 'react'
import {
  Activity, Layers, Shield, Zap, AlertTriangle, BarChart2,
  ChevronRight, Circle, Cpu, FileText, HelpCircle, BookOpen
} from 'lucide-react'

const MENU = [
  { id: 'overview',           label: 'Overview',              icon: Activity },
  { id: 'common-mem',         label: 'Common MEM',            icon: Layers },
  { id: 'borehole-stability', label: 'Borehole Stability',    icon: Shield },
  { id: 'hydraulic-frac',     label: 'Hydraulic Fracturing',  icon: Zap },
  { id: 'faults-geohazard',   label: 'Faults & Geohazard',   icon: AlertTriangle },
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
      width: 200,
      background: '#070f22',
      borderRight: '1px solid rgba(59,130,246,0.15)',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
            <Cpu size={14} color="#fff" />
          </div>
          <div>
            <div className="font-bold text-white" style={{ fontSize: 11, lineHeight: 1.2 }}>HF Design</div>
            <div className="font-bold text-white" style={{ fontSize: 11, lineHeight: 1.2 }}>Engine</div>
          </div>
        </div>
        <div style={{ fontSize: 9, color: '#475569', marginTop: 4 }}>Menu Navigation</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <div style={{ fontSize: 9, color: '#475569', fontWeight: 600, letterSpacing: '0.1em', padding: '0 8px 6px', textTransform: 'uppercase' }}>
          Navigation
        </div>
        {MENU.map(({ id, label, icon: Icon }) => (
          <div key={id}
            className={`nav-item ${activeMenu === id ? 'active' : ''}`}
            onClick={() => onMenuChange(id)}
            id={`nav-${id}`}
          >
            <Icon size={13} />
            <span>{label}</span>
            {activeMenu === id && <ChevronRight size={10} className="ml-auto" />}
          </div>
        ))}
      </nav>

      {/* Well Overview Panel */}
      {well && (
        <div className="px-3 py-3 border-t" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
          <div style={{ fontSize: 9, color: '#475569', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Well Overview
          </div>
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
          <div style={{ marginTop: 8, fontSize: 9, color: '#475569' }}>
            <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: '#22c55e' }}></span>
            Last Updated: {lastUpdated}
          </div>
        </div>
      )}
    </aside>
  )
}

function WellRow({ label, value }) {
  return (
    <div className="data-row">
      <span className="label" style={{ fontSize: 10 }}>{label}</span>
      <span className="value" style={{ fontSize: 10 }}>{value}</span>
    </div>
  )
}
