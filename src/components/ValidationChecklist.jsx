import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';

const CHECKLIST_ITEMS = [
  'DFIT raw data and hydrostatic/friction corrections are preserved and reviewable',
  'Closure/Shmin interpretation includes method and uncertainty',
  'Static mechanical properties are calibrated to local core or documented analog',
  'The model reproduces mini-frac or offset treatment pressure within agreed tolerance',
  'Barrier layers and fault geometry are spatially reconciled',
  'Equipment pressure/rate limits and tubular integrity are included in execution review',
  'Final design and BHS references use the same approved MEM snapshot',
];

export default function ValidationChecklist() {
  const [checked, setChecked] = useState({});

  const toggleCheck = (idx) => {
    setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <main style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      <div className="card h-full flex flex-col">
        <div className="card-title flex items-center gap-2" style={{ fontSize: 14, padding: '12px 16px' }}>
          <CheckSquare size={16} />
          Validation & Acceptance Criteria
        </div>
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-3">
          {CHECKLIST_ITEMS.map((item, idx) => (
            <label key={idx} className="flex items-start gap-3 p-3 rounded" style={{
              background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.1)',
              cursor: 'pointer', transition: 'border 0.2s'
            }}>
              <input
                type="checkbox"
                checked={!!checked[idx]}
                onChange={() => toggleCheck(idx)}
                style={{ marginTop: 2, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: checked[idx] ? '#22c55e' : '#cbd5e1', fontWeight: checked[idx] ? 600 : 400 }}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </main>
  );
}
