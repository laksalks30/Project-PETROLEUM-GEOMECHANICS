import React from 'react'
import { Activity, Zap, Droplets, ThermometerSun, Gauge, TrendingUp } from 'lucide-react'

const KPI_CONFIG = [
  {
    id: 'dfit_shmin',
    label: 'DFIT Calibrated Shmin',
    key: 'dfit.Shmin_calibrated_psi',
    unit: 'psi',
    icon: Activity,
    color: '#22c55e',
    glowClass: 'glow-green',
    type: 'calc',
    tooltip: 'Tekanan horizontal minimum (Shmin) yang telah dikalibrasi berdasarkan observasi tekanan penutupan rekahan (closure pressure) dari uji DFIT.',
  },
  {
    id: 'breakdown_pressure',
    label: 'Updated Breakdown Pressure',
    key: 'dfit.Pbd_new_psi',
    unit: 'psi',
    icon: Zap,
    color: '#f59e0b',
    glowClass: '',
    type: 'calc',
    tooltip: 'Tekanan awal yang dibutuhkan untuk memecahkan batuan dan memulai rekahan baru, dihitung ulang berdasarkan Shmin baru.',
  },
  {
    id: 'net_pressure',
    label: 'Net Pressure',
    key: 'pressure.Pnet_psi',
    unit: 'psi',
    icon: TrendingUp,
    color: '#3b82f6',
    glowClass: '',
    type: 'input',
    tooltip: 'Tekanan ekstra di atas Shmin untuk menjaga retakan tetap terbuka (Pnet = Pf - Shmin). Parameter desain yang menentukan lebar retakan.',
  },
  {
    id: 'bhtp',
    label: 'BHTP',
    key: 'pressure.BHTP_psi',
    unit: 'psi',
    icon: ThermometerSun,
    color: '#ef4444',
    glowClass: '',
    type: 'calc',
    tooltip: 'Bottomhole Treating Pressure: Total tekanan di dasar sumur selama treatment (Pf + Friksi Perforasi + Friksi Tortuosity). Makin tinggi, makin besar beban pada casing.',
  },
  {
    id: 'surface_pressure',
    label: 'Surface Treating Pressure',
    key: 'pressure.Psurface_psi',
    unit: 'psi',
    icon: Droplets,
    color: '#06b6d4',
    glowClass: '',
    type: 'calc',
    tooltip: 'Tekanan injeksi di permukaan (pompa). Dihitung dari BHTP dikurangi tekanan hidrostatik fluida ditambah friksi friksi pipa (tubing).',
  },
  {
    id: 'pump_rate',
    label: 'Pump Rate',
    key: 'design_summary.avg_pump_rate_bpm',
    unit: 'bpm',
    icon: Gauge,
    color: '#a855f7',
    glowClass: 'glow-purple',
    type: 'input',
    tooltip: 'Laju pemompaan (Barrel per minute). Parameter eksekusi utama yang bisa disesuaikan user untuk mengontrol Net Pressure.',
  },
]

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export default function KPIStrip({ data }) {
  return (
    <div className="flex gap-2 px-4 py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
      {KPI_CONFIG.map(({ id, label, key, unit, icon: Icon, color, glowClass, type, tooltip }) => {
        const rawValue = data ? getNestedValue(data, key) : null
        const value = rawValue !== null && rawValue !== undefined
          ? (typeof rawValue === 'number' ? rawValue.toLocaleString(undefined, { maximumFractionDigits: 1 }) : rawValue)
          : '—'

        return (
          <div key={id} id={`kpi-${id}`} className={`card flex-1 px-3 py-2 ${glowClass}`}
            style={{ minWidth: 0, borderColor: `${color}22` }} title={tooltip}>
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={11} color={color} />
              <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {label}
              </span>
              {type === 'input' ? (
                <span className="cursor-help flex-shrink-0" style={{ color: '#60a5fa', fontSize: 10 }} title="Editable Input">✎</span>
              ) : (
                <span className="cursor-help flex-shrink-0" style={{ color: '#94a3b8', fontSize: 10 }} title="Auto-Calculated Output">⚙</span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="kpi-value" style={{ color }}>{value}</span>
              <span className="kpi-unit">{unit}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
