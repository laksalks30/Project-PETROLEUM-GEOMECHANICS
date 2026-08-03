import React from 'react';
import { Database } from 'lucide-react';

const DATA_REQUIREMENTS = [
  { group: 'Common MEM', params: 'Pp, Sv, Shmin, SHmax, azimuth, E, nu, T0, KIC, faults', quality: 'Approved-published snapshot' },
  { group: 'Reservoir', params: 'Pressure, permeability, porosity, net pay, PVT, temperature', quality: 'Depth-matched and current pressure state' },
  { group: 'Mechanical layers', params: 'Layer tops/bases, static E/nu, stress, toughness, leakoff', quality: 'Continuous target and barriers' },
  { group: 'DFIT/mini-frac', params: 'Pressure, rate, volume, time, fluid density, shut-in', quality: 'Raw data retained with interpretation version' },
  { group: 'Completion', params: 'Casing/tubing ID, cement, perforation, cluster and stage geometry', quality: 'As-built or approved design' },
  { group: 'Fluid', params: 'Density, viscosity vs shear/T, friction, leakoff, additives', quality: 'Laboratory and service-company QA' },
  { group: 'Proppant', params: 'Mesh, density, conductivity, crush, embedment, settling', quality: 'Closure-stress and temperature dependent' },
  { group: 'Offset/faults', params: 'Fault geometry, distance, friction, offset completions and frac history', quality: '3D spatial consistency' },
  { group: 'Uncertainty', params: 'P10/P50/P90 or distributions, correlation groups', quality: 'Versioned and scenario specific' },
];

export default function DataRequirements() {
  return (
    <main style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      <div className="card h-full flex flex-col">
        <div className="card-title flex items-center gap-2" style={{ fontSize: 14, padding: '12px 16px' }}>
          <Database size={16} />
          Data Requirements
        </div>
        <div className="flex-1 overflow-auto p-4">
          <table className="tbl" style={{ fontSize: 13, width: '100%' }}>
            <thead>
              <tr>
                <th style={{ fontSize: 11, padding: '10px' }}>Data Group</th>
                <th style={{ fontSize: 11, padding: '10px' }}>Required Parameters</th>
                <th style={{ fontSize: 11, padding: '10px' }}>Quality/Calibration Requirement</th>
              </tr>
            </thead>
            <tbody>
              {DATA_REQUIREMENTS.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  <td style={{ padding: '12px 10px', color: '#3b82f6', fontWeight: 600 }}>{row.group}</td>
                  <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{row.params}</td>
                  <td style={{ padding: '12px 10px', color: '#22c55e' }}>{row.quality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
