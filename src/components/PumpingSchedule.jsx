import React from 'react'
import { Table } from 'lucide-react'

export default function PumpingSchedule({ schedule }) {
  if (!schedule) return <div className="card h-full animate-pulse"><div className="card-title">Pumping Schedule</div></div>

  const stages = schedule.stages || []
  const colors = ['#94a3b8', '#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']

  return (
    <div className="card h-full flex flex-col" id="panel-pumping-schedule">
      <div className="card-title flex items-center gap-2">
        <Table size={10} />
        Pumping Schedule
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="tbl">
          <thead>
            <tr>
              <th title="Tahapan injeksi (Pad, Ramp, Tail).">Stage</th>
              <th title="Volume fluida per stage. (Editable Input)">Fluid (bbl) <span style={{ color: '#60a5fa', fontSize: 10, cursor: 'help' }}>✎</span></th>
              <th title="Laju injeksi per stage. (Editable Input)">Rate (bpm) <span style={{ color: '#60a5fa', fontSize: 10, cursor: 'help' }}>✎</span></th>
              <th title="Konsentrasi proppant. (Editable Input)">Prop (lb/gal) <span style={{ color: '#60a5fa', fontSize: 10, cursor: 'help' }}>✎</span></th>
              <th title="Massa proppant = Fluid * Prop Conc. (Auto-Calculated Output)">Proppant (lb) <span style={{ color: '#94a3b8', fontSize: 10, cursor: 'help' }}>⚙</span></th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s, i) => (
              <tr key={s.stage}>
                <td>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
                    <span style={{ fontSize: 10 }}>{s.stage}</span>
                  </div>
                </td>
                <td style={{ fontSize: 10 }}>{s.fluid_bbl?.toLocaleString()}</td>
                <td style={{ fontSize: 10 }}>{s.rate_bpm}</td>
                <td style={{ fontSize: 10 }}>{s.proppant_lb_gal}</td>
                <td style={{ fontSize: 10 }}>{s.proppant_lb?.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td style={{ fontSize: 10 }}>TOTAL</td>
              <td style={{ fontSize: 10 }}>{schedule.total_fluid_bbl?.toLocaleString()}</td>
              <td style={{ fontSize: 10 }}>{schedule.avg_rate_bpm} avg</td>
              <td style={{ fontSize: 10 }}>—</td>
              <td style={{ fontSize: 10 }}>{schedule.total_proppant_lb?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
