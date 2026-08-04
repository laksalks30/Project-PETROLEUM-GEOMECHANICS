import React from 'react'
import { ClipboardList } from 'lucide-react'

export default function DesignSummary({ design }) {
  if (!design) return <div className="card h-full animate-pulse" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}><div className="card-title">LOADING DESIGN...</div></div>

  const rows = [
    { label: 'Total Fluid',               value: `${design.total_fluid_bbl?.toLocaleString()} bbl`,   color: '#3b82f6', type: 'input', tooltip: 'Total volume fluida bersih yang dipompakan.' },
    { label: 'Effective Fracture Volume', value: `${design.effective_fracture_volume_bbl?.toLocaleString()} bbl`, color: '#38bdf8', type: 'calc', tooltip: 'Volume retakan efektif setelah dikurangi leakoff (merembes).' },
    { label: 'Leakoff',                   value: `${design.leakoff_bbl?.toLocaleString()} bbl`,        color: '#94a3b8', type: 'calc', tooltip: 'Fluida yang merembes ke dalam matriks formasi batuan.' },
    { label: 'Proppant',                  value: `${design.total_proppant_lb?.toLocaleString()} lb`,   color: '#f59e0b', type: 'input', tooltip: 'Total massa proppant (pasir/ceramic) yang diinjeksikan.' },
    { label: 'Proppant Volume',           value: `${design.proppant_volume_bbl?.toLocaleString()} bbl`,color: '#fbbf24', type: 'calc', tooltip: 'Volume bulk proppant.' },
    { label: 'Avg Proppant Conc.',        value: `${design.avg_conc_lb_gal} lb/gal`,                   color: '#f59e0b', type: 'input', tooltip: 'Konsentrasi rata-rata proppant dalam fluida.' },
    { label: 'Fracture Area',             value: `${design.fracture_area_ft2?.toLocaleString()} ft²`,  color: '#22c55e', type: 'calc', tooltip: 'Luas area dua sisi dinding rekahan.' },
    { label: 'Avg Fracture Width',        value: `${design.avg_fracture_width_in} in`,                 color: '#a855f7', type: 'calc', tooltip: 'Lebar rata-rata retakan terbuka.' },
    { label: 'Height Containment',        value: `${design.height_containment_pct}%`,                  color: '#22c55e', type: 'calc', tooltip: 'Persentase rekahan yang tertahan di dalam zona target.' },
    { label: 'Geometry Model',            value: design.geometry_model,                                color: '#e2e8f0', type: 'input', tooltip: 'Model fisika yang dipakai (PKN, KGD, Radial).' },
    { label: 'Dim. Conductivity',         value: design.dimensionless_conductivity?.toFixed(2),        color: '#06b6d4', type: 'calc', tooltip: 'Konduktivitas tanpa dimensi (Fcd) untuk menilai kualitas transport fluida ke sumur.' },
    { label: 'Avg Pump Rate',             value: `${design.avg_pump_rate_bpm} bpm`,                    color: '#3b82f6', type: 'input', tooltip: 'Laju pemompaan rata-rata di permukaan.' },
    { label: 'Clusters',                  value: design.clusters,                                      color: '#e2e8f0', type: 'input', tooltip: 'Jumlah kluster perforasi per stage.' },
    { label: 'Total Perforations',        value: design.total_perforations,                            color: '#94a3b8', type: 'calc', tooltip: 'Total lubang tembak (shots per cluster * clusters).' },
    { label: 'Duration',                  value: `${design.duration_min_low}–${design.duration_min_high} min`, color: '#94a3b8', type: 'calc', tooltip: 'Perkiraan waktu durasi injeksi.' },
  ]

  return (
    <div className="card h-full flex flex-col overflow-hidden" id="panel-design-summary" style={{ background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{
        padding: '8px 12px',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        borderLeft: '2px solid #38bdf8'
      }}>
        <ClipboardList size={12} color="#38bdf8" />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em' }}>DESIGN SUMMARY</span>
      </div>
      
      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-0.5">
        {rows.map(({ label, value, color, type, tooltip }) => (
          <div key={label} className="flex justify-between items-center px-2 py-1.5 rounded group" title={tooltip} style={{ 
            background: type === 'input' ? 'rgba(59,130,246,0.06)' : 'transparent', 
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            transition: 'background 0.2s'
          }}>
            <span className="flex items-center gap-2" style={{ fontSize: 9, color: type === 'input' ? '#cbd5e1' : '#94a3b8' }}>
              {label}
              {type === 'input' ? (
                <div className="flex items-center justify-center w-3 h-3 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30" style={{ fontSize: 7, fontWeight: 800 }} title="Editable Input">IN</div>
              ) : (
                <div className="flex items-center justify-center w-3 h-3 rounded bg-slate-700/50 text-slate-400 border border-slate-600/50" style={{ fontSize: 7, fontWeight: 800 }} title="Auto-Calculated Output">FX</div>
              )}
            </span>
            <span style={{ fontSize: 10, color, fontWeight: type === 'input' ? 800 : 600, letterSpacing: '0.02em' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
