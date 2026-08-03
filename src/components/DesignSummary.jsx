import React from 'react'
import { ClipboardList } from 'lucide-react'

export default function DesignSummary({ design }) {
  if (!design) return <div className="card h-full animate-pulse"><div className="card-title">Design Summary</div></div>

  const rows = [
    { label: 'Total Fluid',               value: `${design.total_fluid_bbl?.toLocaleString()} bbl`,   color: '#3b82f6', type: 'input', tooltip: 'Total volume fluida bersih yang dipompakan.' },
    { label: 'Effective Fracture Volume', value: `${design.effective_fracture_volume_bbl?.toLocaleString()} bbl`, color: '#3b82f6', type: 'calc', tooltip: 'Volume retakan efektif setelah dikurangi leakoff (merembes).' },
    { label: 'Leakoff',                   value: `${design.leakoff_bbl?.toLocaleString()} bbl`,        color: '#94a3b8', type: 'calc', tooltip: 'Fluida yang merembes ke dalam matriks formasi batuan.' },
    { label: 'Proppant',                  value: `${design.total_proppant_lb?.toLocaleString()} lb`,   color: '#f59e0b', type: 'input', tooltip: 'Total massa proppant (pasir/ceramic) yang diinjeksikan.' },
    { label: 'Proppant Volume',           value: `${design.proppant_volume_bbl?.toLocaleString()} bbl`,color: '#f59e0b', type: 'calc', tooltip: 'Volume bulk proppant.' },
    { label: 'Avg Proppant Conc.',        value: `${design.avg_conc_lb_gal} lb/gal`,                   color: '#f59e0b', type: 'input', tooltip: 'Konsentrasi rata-rata proppant dalam fluida.' },
    { label: 'Fracture Area',             value: `${design.fracture_area_ft2?.toLocaleString()} ft²`,  color: '#22c55e', type: 'calc', tooltip: 'Luas area dua sisi dinding rekahan.' },
    { label: 'Avg Fracture Width',        value: `${design.avg_fracture_width_in} in`,                 color: '#a855f7', type: 'calc', tooltip: 'Lebar rata-rata retakan terbuka.' },
    { label: 'Height Containment',        value: `${design.height_containment_pct}%`,                  color: '#22c55e', type: 'calc', tooltip: 'Persentase rekahan yang tertahan di dalam zona target.' },
    { label: 'Geometry Model',            value: design.geometry_model,                                color: '#94a3b8', type: 'input', tooltip: 'Model fisika yang dipakai (PKN, KGD, Radial).' },
    { label: 'Dim. Conductivity',         value: design.dimensionless_conductivity?.toFixed(2),        color: '#06b6d4', type: 'calc', tooltip: 'Konduktivitas tanpa dimensi (Fcd) untuk menilai kualitas transport fluida ke sumur.' },
    { label: 'Avg Pump Rate',             value: `${design.avg_pump_rate_bpm} bpm`,                    color: '#3b82f6', type: 'input', tooltip: 'Laju pemompaan rata-rata di permukaan.' },
    { label: 'Clusters',                  value: design.clusters,                                      color: '#94a3b8', type: 'input', tooltip: 'Jumlah kluster perforasi per stage.' },
    { label: 'Total Perforations',        value: design.total_perforations,                            color: '#94a3b8', type: 'calc', tooltip: 'Total lubang tembak (shots per cluster * clusters).' },
    { label: 'Duration',                  value: `${design.duration_min_low}–${design.duration_min_high} min`, color: '#94a3b8', type: 'calc', tooltip: 'Perkiraan waktu durasi injeksi.' },
  ]

  return (
    <div className="card h-full flex flex-col" id="panel-design-summary">
      <div className="card-title flex items-center gap-2">
        <ClipboardList size={10} />
        Design Summary
      </div>
      <div className="flex-1 overflow-auto min-h-0 p-2">
        {rows.map(({ label, value, color, type, tooltip }) => (
          <div key={label} className="data-row" title={tooltip}>
            <span className="label flex items-center gap-1" style={{ fontSize: 10 }}>
              {label}
              {type === 'input' ? (
                <span className="cursor-help" style={{ color: '#60a5fa', fontSize: 10 }} title="Editable Input">✎</span>
              ) : (
                <span className="cursor-help" style={{ color: '#94a3b8', fontSize: 10 }} title="Auto-Calculated Output">⚙</span>
              )}
            </span>
            <span className="value" style={{ fontSize: 10, color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
