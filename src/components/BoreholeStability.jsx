import React from 'react'
import BHS_KPIStrip from './bhs/BHS_KPIStrip.jsx'
import BHS_MudWeightWindow from './bhs/BHS_MudWeightWindow.jsx'
import BHS_CommonMEM from './bhs/BHS_CommonMEM.jsx'
import BHS_StressAndIndicators from './bhs/BHS_StressAndIndicators.jsx'
import BHS_BottomSection from './bhs/BHS_BottomSection.jsx'
import BHS_Footer from './bhs/BHS_Footer.jsx'

export default function BoreholeStability({ bhs, mem, well, stressProfile }) {
  if (!bhs) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontWeight: 700 }}>
      Loading Borehole Stability Engine...
    </div>
  )

  return (
    <main style={{ flex: 1, overflow: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6, background: '#050b14' }}>
      
      {/* 1. TOP ROW: KPI STRIP */}
      <BHS_KPIStrip bhs={bhs} mem={mem} />

      {/* 2. MIDDLE ROW: Main content grid (3 columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 2.2fr', gap: 6, flex: 1, minHeight: 380 }}>
        
        {/* Left Column: Mud Weight Window */}
        <BHS_MudWeightWindow bhs={bhs} />

        {/* Center Column: Common MEM, Stresses, RT Drilling */}
        <BHS_CommonMEM bhs={bhs} mem={mem} />

        {/* Right Column: Stress Profile, Indicators, Trajectory */}
        <BHS_StressAndIndicators bhs={bhs} well={well} stressProfile={stressProfile} />

      </div>

      {/* 3. BOTTOM ROW: Uncertainty, Sensitivity, Risk, Recommendations */}
      <BHS_BottomSection bhs={bhs} mem={mem} />

      {/* 4. FOOTER: Status and Actions */}
      <BHS_Footer bhs={bhs} />

    </main>
  )
}
