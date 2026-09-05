import React, { useState, useEffect, useRef } from 'react';
import { Radar, Radio, Navigation, Users, PlusCircle, AlertCircle, Sparkles } from 'lucide-react';
import { RadarUser } from '../types';

export default function RadarMap() {
  const [radialLinesCount, setRadialLinesCount] = useState(3);
  const [radarUsers, setRadarUsers] = useState<RadarUser[]>([
    { id: 'u1', name: 'Rohan Sharma (Safe Volunteer)', distance: 120, angle: 45, status: 'helper', phone: '+91 94231 43221', lastActive: '2 min ago' },
    { id: 'u2', name: 'Simulated Distress Target', distance: 340, angle: 180, status: 'distress', phone: '+91 91234 56789', lastActive: 'Just now' },
    { id: 'u3', name: 'Anjali Gupta (Police Patrol Node)', distance: 680, angle: 290, status: 'helper', phone: '+91 99912 00000', lastActive: '5 min ago' },
    { id: 'u4', name: 'Vimal Roy (Registered Helper)', distance: 410, angle: 120, status: 'helper', phone: '+91 95532 90111', lastActive: 'Yesterday' },
    { id: 'u5', name: 'Aniket Pal (Distress Alert)', distance: 890, angle: 215, status: 'distress', phone: '+91 98322 11099', lastActive: '4 min ago' }
  ]);

  const [simulationActive, setSimulationActive] = useState(true);
  const [mapRotation, setMapRotation] = useState(0);
  const [zoomFactor, setZoomFactor] = useState(1); // 1x, 2x, 0.5x
  const [selectedUser, setSelectedUser] = useState<RadarUser | null>(null);
  const [addingDistress, setAddingDistress] = useState(false);
  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetDistance, setNewTargetDistance] = useState(300);

  // Periodic simulation movement to show "Real-time, live location tracking. If you move, the radar moves with you."
  useEffect(() => {
    let interval: number | undefined;
    if (simulationActive) {
      interval = window.setInterval(() => {
        setRadarUsers(prev => prev.map(user => {
          // Slight jitter in distance and angle to simulate actual movement
          const distChange = (Math.random() - 0.5) * 15;
          const angleChange = (Math.random() - 0.5) * 6;
          
          let newDist = Math.max(50, Math.min(990, user.distance + distChange));
          let newAngle = (user.angle + angleChange + 360) % 360;
          
          return {
            ...user,
            distance: Math.round(newDist),
            angle: Math.round(newAngle),
            lastActive: 'Just now'
          };
        }));
        // Slowly rotate map slightly to simulate compass variation
        setMapRotation(r => (r + 0.2) % 360);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationActive]);

  const triggerRadarPing = () => {
    // Generate brief ping effect
    const btn = document.getElementById('radar-sweep-indicator');
    if (btn) {
      btn.classList.remove('opacity-0');
      btn.classList.add('scale-150', 'opacity-100');
      setTimeout(() => {
        btn.classList.remove('scale-150', 'opacity-100');
        btn.classList.add('opacity-0');
      }, 1000);
    }
  };

  const handleAddCustomDistress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetName.trim()) return;

    const newTarget: RadarUser = {
      id: `custom_${Date.now()}`,
      name: `${newTargetName} (Custom Alert)`,
      distance: Number(newTargetDistance),
      angle: Math.floor(Math.random() * 360),
      status: 'distress',
      phone: '+91 97722 ' + Math.floor(10000 + Math.random() * 90000),
      lastActive: 'Just now'
    };

    setRadarUsers(prev => [newTarget, ...prev]);
    setSelectedUser(newTarget);
    setNewTargetName('');
    setAddingDistress(false);
    triggerRadarPing();
  };

  return (
    <div className="bg-surface-container border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6">
      {/* Simulation Controls Right/Left Header */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setSimulationActive(!simulationActive)}
          className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-black/40 border transition-all ${
            simulationActive ? 'text-green-400 border-green-500/30' : 'text-on-surface-variant border-white/10'
          }`}
        >
          {simulationActive ? '● SIM ACTIVE' : '■ SIM PAUSED'}
        </button>
      </div>

      {/* Radar Canvas Scope */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-72 h-72 rounded-full border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
          {/* Neon Sweep line */}
          <div 
            className="absolute inset-0 origin-center rounded-full pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, rgba(0, 122, 255, 0.15) 0deg, rgba(0, 122, 255, 0) 90deg)',
              transform: `rotate(${mapRotation * 30}deg)`
            }}
          />

          {/* Radar Circles (Grid lines) */}
          <div className="absolute w-56 h-56 rounded-full border border-white/5 flex items-center justify-center">
            <span className="font-mono text-[8px] text-on-surface-variant/30 absolute top-2">500m</span>
          </div>
          <div className="absolute w-36 h-36 rounded-full border border-white/5 flex items-center justify-center">
            <span className="font-mono text-[8px] text-on-surface-variant/30 absolute top-2">250m</span>
          </div>
          <div className="absolute w-16 h-16 rounded-full border border-white/5 flex items-center justify-center" />

          {/* Radial Lines */}
          <div className="absolute w-full h-[1px] bg-white/5 rotate-0" />
          <div className="absolute w-full h-[1px] bg-white/5 rotate-45" />
          <div className="absolute w-full h-[1px] bg-white/5 rotate-90" />
          <div className="absolute w-full h-[1px] bg-white/5 rotate-135" />

          {/* Self Center Point */}
          <div className="absolute z-10 text-center flex flex-col items-center justify-center">
            <div className="w-4 h-4 bg-sos-red rounded-full flex items-center justify-center shadow-lg shadow-sos-red/50 animate-pulse border-2 border-white">
              <Navigation className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="font-mono text-[9px] font-bold text-sos-red bg-black/70 px-1 rounded absolute mt-8 whitespace-nowrap">
              YOU (CENTER)
            </span>
          </div>

          {/* Dynamic Radar Elements / Blips mapped based on distance & angle */}
          {radarUsers.map(user => {
            const scaledDistance = (user.distance / 1000) * 135 * zoomFactor; // Scale map boundaries
            const x = scaledDistance * Math.cos((user.angle - 90) * (Math.PI / 180));
            const y = scaledDistance * Math.sin((user.angle - 90) * (Math.PI / 180));

            return (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`absolute w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer ${
                  user.status === 'distress' 
                    ? 'bg-red-500 border border-white shadow-lg shadow-red-500/50 animate-bounce' 
                    : 'bg-blue-500 border border-white shadow-lg shadow-blue-500/40'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`
                }}
              >
                {/* Ping visual ring */}
                <span className={`absolute w-6 h-6 rounded-full opacity-30 animate-ping ${
                  user.status === 'distress' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
              </button>
            );
          })}

          {/* Custom Instant sweep alert signal */}
          <div 
            id="radar-sweep-indicator" 
            className="absolute w-full h-full rounded-full border-4 border-blue-500 opacity-0 transition-all duration-1000 pointer-events-none" 
          />
        </div>

        {/* Zoom & Radar status text */}
        <div className="mt-4 flex gap-4 items-center justify-center w-full">
          <div className="flex gap-1.5 bg-black/30 p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setZoomFactor(0.5)} 
              className={`px-2 py-0.5 text-[10px] font-mono rounded ${zoomFactor === 0.5 ? 'bg-blue-600 text-white' : 'text-on-surface-variant'}`}
            >
              0.5x
            </button>
            <button 
              onClick={() => setZoomFactor(1)} 
              className={`px-2 py-0.5 text-[10px] font-mono rounded ${zoomFactor === 1 ? 'bg-blue-600 text-white' : 'text-on-surface-variant'}`}
            >
              1.0x
            </button>
            <button 
              onClick={() => setZoomFactor(1.5)} 
              className={`px-2 py-0.5 text-[10px] font-mono rounded ${zoomFactor === 1.5 ? 'bg-blue-600 text-white' : 'text-on-surface-variant'}`}
            >
              1.5x
            </button>
          </div>

          <button 
            onClick={triggerRadarPing}
            className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold px-3 py-1 rounded-lg hover:bg-blue-600/30 transition-all uppercase"
          >
            Send Beacon Ping
          </button>
        </div>
      </div>

      {/* Radar Helper List / Details panel */}
      <div className="w-full md:w-72 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-headline-md text-base text-on-surface flex items-center gap-1.5 font-bold">
              <Radar className="w-4 h-4 text-blue-400" />
              1KM Radar Field
            </h4>
            <span className="bg-blue-500/10 text-blue-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-blue-500/20 font-bold">
              Radius: 1000m
            </span>
          </div>

          {selectedUser ? (
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-xs select-none">
              <div className="flex justify-between items-start mb-2">
                <span className={`font-bold px-2 py-0.5 rounded-[4px] uppercase text-[9px] ${
                  selectedUser.status === 'distress' ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                }`}>
                  {selectedUser.status === 'distress' ? '🚩 Danger Signal' : '🛡️ Registered Volunteer'}
                </span>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="text-on-surface-variant hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>
              <h5 className="font-bold text-sm text-on-surface mb-1">{selectedUser.name}</h5>
              <div className="space-y-1 text-on-surface-variant text-[11px] font-mono">
                <p>🛰️ Distance: {selectedUser.distance} meters away</p>
                <p>🧭 Vector Heading: {selectedUser.angle}° Compass</p>
                <p>📞 Phone: {selectedUser.phone || 'Protected'}</p>
                <p>🕒 Signal Ping: {selectedUser.lastActive}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <a 
                  href={`tel:${selectedUser.phone}`} 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg text-center font-bold text-[10px] block"
                >
                  Call Contact
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-black/10 hover:bg-black/20 p-4 rounded-xl border border-dashed border-white/10 text-center py-6">
              <p className="text-xs text-on-surface-variant">
                Select any animated radar blip on the radar screen to show safety node details, distances, and volunteer triggers.
              </p>
            </div>
          )}

          {addingDistress ? (
            <form onSubmit={handleAddCustomDistress} className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-red-400">Simulate Safety Distress Grid</span>
                <button 
                  type="button" 
                  onClick={() => setAddingDistress(false)} 
                  className="text-on-surface-variant hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div>
                <label className="block text-[10px] mb-1 font-medium">Target / Profile Title</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 text-xs px-2 py-1 rounded text-white font-mono"
                  placeholder="e.g. Broken Down Vehicle"
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] mb-1 font-medium">Approx Distance (30m - 950m)</label>
                <input 
                  type="range" 
                  min="50" 
                  max="950" 
                  className="w-full accent-blue-500"
                  value={newTargetDistance}
                  onChange={(e) => setNewTargetDistance(Number(e.target.value))}
                />
                <span className="text-[10px] font-mono text-on-surface-variant block text-right">{newTargetDistance} meters</span>
              </div>
              <button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 rounded text-[10px] uppercase tracking-wider"
              >
                Inject distress element
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingDistress(true)}
              className="w-full border border-dashed border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-all font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              Simulate Nearby Distress Node
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-on-surface-variant">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>Active Volunteers in Grid: <b className="text-white">3</b></span>
        </div>
      </div>
    </div>
  );
}
