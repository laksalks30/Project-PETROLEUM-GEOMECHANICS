import React from 'react'
import { CheckCircle, AlertTriangle, Download, FileText, RefreshCw, Hexagon, Database, Link } from 'lucide-react'

export default function BHS_Footer({ bhs }) {
  const isOK = bhs?.status === 'CONDITIONALLY ACCEPTABLE'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr', gap: 6, flexShrink: 0 }}>
      {/* STABILITY STATUS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 6, background: isOK ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${isOK ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
        <div style={{ flexShrink: 0 }}>
           {isOK ? <CheckCircle size={28} color="#22c55e" strokeWidth={1.5} /> : <AlertTriangle size={28} color="#ef4444" strokeWidth={1.5} />}
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>STABILITY STATUS</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: isOK ? '#22c55e' : '#ef4444', letterSpacing: '0.05em' }}>{bhs?.status || 'CONDITIONALLY ACCEPTABLE'}</div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>Operating within safe window with adequate margins.</div>
        </div>
      </div>

      {/* MAIN RISK */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 6, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
        <div style={{ flexShrink: 0 }}>
           <AlertTriangle size={28} color="#f59e0b" strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>MAIN RISK</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b', letterSpacing: '0.05em' }}>{bhs?.main_risk || 'Swab-Induced Instability'}</div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>Elevated risk during connections and trips.</div>
        </div>
      </div>

      {/* STATUS INDICATORS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 6, background: '#0a1428', border: '1px solid rgba(30,41,59,0.8)' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
           <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700 }}>STATUS INDICATORS</div>
           <div style={{ display: 'flex', gap: 12 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Hexagon size={14} color="#22c55e" />
                <div>
                   <div style={{ fontSize: 8, color: '#94a3b8' }}>Model Quality</div>
                   <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>High</div>
                </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Database size={14} color="#22c55e" />
                <div>
                   <div style={{ fontSize: 8, color: '#94a3b8' }}>Data Coverage</div>
                   <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>98%</div>
                </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link size={14} color="#22c55e" />
                <div>
                   <div style={{ fontSize: 8, color: '#94a3b8' }}>Calibration Fit</div>
                   <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>Good</div>
                </div>
             </div>
           </div>
         </div>
      </div>

      {/* BUTTONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '0 10px' }}>
         <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <FileText size={16} />
            <span style={{ fontSize: 9 }}>Export<br/>Report</span>
         </button>
         <button style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', marginLeft: 8 }}>
            <Download size={16} />
            <span style={{ fontSize: 9 }}>Download<br/>Data</span>
         </button>
         <button style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '8px 16px', borderRadius: 4, marginLeft: 16 }}>
            <RefreshCw size={14} />
            <span style={{ fontSize: 11, fontWeight: 700 }}>Refresh Data</span>
         </button>
      </div>
    </div>
  )
}
