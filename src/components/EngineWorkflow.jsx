import React from 'react';
import { GitMerge } from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: 1, process: 'Load immutable MEM, target and structural snapshot', output: 'Input manifest' },
  { step: 2, process: 'Build mechanical layers and stress contrasts', output: 'Target/barrier table' },
  { step: 3, process: 'Interpret DFIT or mini-frac', output: 'Shmin, ISIP, closure, reservoir pressure, leakoff' },
  { step: 4, process: 'Configure completion, fluid, proppant and schedule', output: 'Treatment model inputs' },
  { step: 5, process: 'Run fracture propagation and proppant transport', output: 'Pressure, geometry, placement' },
  { step: 6, process: 'Assess containment, faults and offsets', output: 'Risk register and constraints' },
  { step: 7, process: 'Optimize rate, volume, stages and clusters', output: 'Recommended design' },
  { step: 8, process: 'History-match treatment and propose calibration', output: 'Post-job model and MEM change request' },
];

export default function EngineWorkflow() {
  return (
    <main style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      <div className="card h-full flex flex-col">
        <div className="card-title flex items-center gap-2" style={{ fontSize: 14, padding: '12px 16px' }}>
          <GitMerge size={16} />
          Engine Workflow
        </div>
        <div className="flex-1 overflow-auto p-6" style={{ position: 'relative' }}>
          
          <div style={{ position: 'absolute', left: 40, top: 24, bottom: 24, width: 2, background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.3), transparent)' }}></div>
          
          <div className="flex flex-col gap-6">
            {WORKFLOW_STEPS.map((step, idx) => (
              <div key={idx} className="flex items-center gap-6" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', background: '#3b82f6', 
                  border: '4px solid #0a1428', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: 'white', flexShrink: 0, marginLeft: 16
                }}>
                  {step.step}
                </div>
                <div style={{ 
                  flex: 1, padding: '12px 16px', borderRadius: 6, 
                  background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)'
                }}>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>{step.process}</div>
                  <div className="flex items-center gap-2" style={{ fontSize: 11, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></div>
                    Output: {step.output}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
