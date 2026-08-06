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
    type: 'calc',
    tooltip: 'Tekanan horizontal minimum (Shmin) yang telah dikalibrasi berdasarkan observasi tekanan penutupan rekahan dari uji DFIT.',
  },
  {
    id: 'breakdown_pressure',
    label: 'Updated Breakdown Pressure',
    key: 'dfit.Pbd_new_psi',
    unit: 'psi',
    icon: Zap,
    color: '#f59e0b',
    type: 'calc',
    tooltip: 'Tekanan awal yang dibutuhkan untuk memecahkan batuan dan memulai rekahan baru, dihitung ulang berdasarkan Shmin baru.',
  },
  {
    id: 'net_pressure',
    label: 'Net Pressure',
    key: 'pressure.Pnet_psi',
    unit: 'psi',
    icon: TrendingUp,
    color: '#38bdf8',
    type: 'input',
    tooltip: 'Tekanan ekstra di atas Shmin untuk menjaga retakan tetap terbuka (Pnet = Pf - Shmin).',
  },
  {
    id: 'bhtp',
    label: 'BHTP',
    key: 'pressure.BHTP_psi',
    unit: 'psi',
    icon: ThermometerSun,
    color: '#ef4444',
    type: 'calc',
    tooltip: 'Bottomhole Treating Pressure: Total tekanan di dasar sumur selama treatment.',
  },
  {
    id: 'surface_pressure',
    label: 'Surface Treating Pressure',
    key: 'pressure.Psurface_psi',
    unit: 'psi',
    icon: Droplets,
    color: '#06b6d4',
    type: 'calc',
    tooltip: 'Tekanan injeksi di permukaan (pompa). Dihitung dari BHTP dikurangi tekanan hidrostatik.',
  },
  {
    id: 'pump_rate',
    label: 'Pump Rate',
    key: 'design_summary.avg_pump_rate_bpm',
    unit: 'bpm',
    icon: Gauge,
    color: '#a855f7',
    type: 'input',
    tooltip: 'Laju pemompaan (Barrel per minute). Parameter eksekusi utama.',
  },
]

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export default function KPIStrip({ data }) {
  return (
    <div className="flex gap-2 px-4 py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
      {KPI_CONFIG.map(({ id, label, key, unit, icon: Icon, color, type, tooltip }) => {
        const rawValue = data ? getNestedValue(data, key) : null
        const value = rawValue !== null && rawValue !== undefined
          ? (typeof rawValue === 'number' ? rawValue.toLocaleString(undefined, { maximumFractionDigits: 1 }) : rawValue)
          : '—'

        return (
          <div
            key={id}
            id={`kpi-${id}`}
            className="card flex-1 flex flex-col justify-between"
            style={{
              minWidth: 0,
              border: `1px solid ${color}18`,
              borderTop: `2px solid ${color}`,
              padding: '8px 10px',
              gap: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
            title={tooltip}
          >
            {/* Background radial glow */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at top left, ${color}0D, transparent 65%)`,
              pointerEvents: 'none',
            }} />

            {/* Top row: icon + label + type badge */}
            <div className="flex items-center gap-1.5 relative z-10">
              <div className="flex items-center justify-center w-5 h-5 rounded flex-shrink-0"
                style={{ background: `${color}18` }}>
                <Icon size={11} color={color} />
              </div>
              <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {label}
              </span>
              {type === 'input' ? (
                <span className="flex-shrink-0 rounded px-1 py-px"
                  style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em' }}>
                  INPUT
                </span>
              ) : (
                <span className="flex-shrink-0 rounded px-1 py-px"
                  style={{ background: 'rgba(100,116,139,0.15)', color: '#64748b', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em' }}>
                  CALC
                </span>
              )}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1.5 relative z-10">
              <span style={{
                fontSize: 22, fontWeight: 800, color,
                lineHeight: 1, letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                textShadow: `0 0 20px ${color}60`,
              }}>
                {value}
              </span>
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{unit}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
