import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, AlertOctagon, Send, MapPin, CheckCircle, ShieldAlert, Wifi } from 'lucide-react';
import { SafetyAlertLog } from '../types';

interface SOSBroadcasterProps {
  emergencyContacts: string[];
  onTriggerSOSLocalState: (active: boolean) => void;
  isSOSActiveExternal: boolean;
}

export default function SOSBroadcaster({ emergencyContacts, onTriggerSOSLocalState, isSOSActiveExternal }: SOSBroadcasterProps) {
  const [pressProgress, setPressProgress] = useState(0); // 0 to 100
  const [isHolding, setIsHolding] = useState(false);
  const [isTripped, setIsTripped] = useState(false);
  const [sosLogs, setSosLogs] = useState<SafetyAlertLog[]>([
    { id: 'l1', title: 'Telemetry Node Standard', time: '10:42', type: 'radar_ping', description: 'RESCUEN safe status active. Radar scanning 1KM background.' }
  ]);

  const [simulatedCoords, setSimulatedCoords] = useState({ lat: 22.5726, lng: 88.3639 }); // Mock starting coords
  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // If external state is reset, sync local tripped status
    if (!isSOSActiveExternal && isTripped) {
      setIsTripped(false);
      setPressProgress(0);
    }
  }, [isSOSActiveExternal]);

  // Hold-to-trigger effect
  useEffect(() => {
    if (isHolding && !isTripped) {
      const startTime = Date.now();
      const duration = 1500; // 1.5 seconds trigger timer

      holdTimerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / duration) * 100);
        setPressProgress(progress);

        if (progress >= 100) {
          triggerSOSAlert();
        }
      }, 50);
    } else {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (!isTripped) {
        // Decay progress back to 0 quickly
        const decayInterval = window.setInterval(() => {
          setPressProgress(p => {
            if (p <= 0) {
              clearInterval(decayInterval);
              return 0;
            }
            return Math.max(0, p - 15);
          });
        }, 30);
      }
    }

    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, [isHolding, isTripped]);

  // Jitter coordinates while alert is active to simulate live high-stakes moving tracking
  useEffect(() => {
    let coordsInterval: number | undefined;
    if (isTripped) {
      coordsInterval = window.setInterval(() => {
        setSimulatedCoords(c => ({
          lat: c.lat + (Math.random() - 0.5) * 0.0003,
          lng: c.lng + (Math.random() - 0.5) * 0.0003
        }));
        
        // Log telemetry update
        const formatTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setSosLogs(prev => [
          {
            id: `tel_${Date.now()}`,
            title: 'Telemetry Vector Shift',
            time: formatTime,
            type: 'radar_ping',
            description: `Transmitting real-time GPS coordinates (${simulatedCoords.lat.toFixed(6)}, ${simulatedCoords.lng.toFixed(6)}) to live dispatchers.`
          },
          ...prev
        ]);
      }, 4000);
    }
    return () => {
      if (coordsInterval) clearInterval(coordsInterval);
    };
  }, [isTripped, simulatedCoords]);

  const triggerSOSAlert = () => {
    setIsTripped(true);
    setIsHolding(false);
    onTriggerSOSLocalState(true);

    const formatTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create detailed rescue alert pipeline logs
    const alertLogs: SafetyAlertLog[] = [
      {
        id: `sos_init_${Date.now()}`,
        title: '🔒 RESCUEN Alert Armed',
        time: formatTime,
        type: 'siren_active',
        description: 'Silent broadcast activated. Secure token dispatched over HTTPS.'
      },
      ...emergencyContacts.map((phone, index) => ({
        id: `sms_${index}_${Date.now()}`,
        title: `📲 Broadcast dispatched (Contact ${index + 1})`,
        time: formatTime,
        type: 'sms_sent' as const,
        description: `Dispatched SMS to ${phone}: "URGENT SAFETY THREAT. Live radar link: https://rescuen.app/track/jd-9428" at GPS (${simulatedCoords.lat.toFixed(5)}, ${simulatedCoords.lng.toFixed(5)})`
      })),
      {
        id: `police_alert_${Date.now()}`,
        title: '🚨 Police Broadcast Enroute',
        time: formatTime,
        type: 'police_called',
        description: 'Routed incident report to Police control center. Live microphone opened discreetly.'
      }
    ];

    setSosLogs(prev => [...alertLogs, ...prev]);
  };

  const cancelSOSAlert = () => {
    setIsTripped(false);
    setPressProgress(0);
    onTriggerSOSLocalState(false);

    const formatTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSosLogs(prev => [
      {
        id: `cancel_${Date.now()}`,
        title: '🟢 Safety Alert Stand-down',
        time: formatTime,
        type: 'radar_ping',
        description: 'Stand-down token dispatched. Incident resolution logged. Microphones secured.'
      },
      ...prev
    ]);
  };

  // Circular gauge parameter calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pressProgress / 100) * circumference;

  return (
    <div className="bg-surface-container border border-white/10 rounded-2xl p-6 flex flex-col gap-6" id="sos-broadcaster-card">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Wifi className={`w-5 h-5 ${isTripped ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
          <h4 className="font-headline-md text-base text-on-surface font-bold">Broadcaster System</h4>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
          isTripped ? 'bg-red-500/10 text-red-400 animate-pulse border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {isTripped ? '⚠️ EMERGENCY STATE DEPLOYED' : '● SYSTEM IN STANDBY'}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {/* Long Press Trigger Button Container */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Circular SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90 absolute">
            <circle
              cx="88"
              cy="88"
              r={radius}
              className="stroke-white/5"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r={radius}
              className={`transition-all duration-75 ${isTripped ? 'stroke-red-600' : 'stroke-red-500'}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Core Central SOS Trigger Button */}
          {!isTripped ? (
            <button
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              id="sos-long-press-trigger-button"
              className={`w-32 h-32 rounded-full flex flex-col justify-center items-center font-bold tracking-widest text-white transition-all duration-300 relative select-none cursor-pointer ${
                isHolding 
                  ? 'bg-red-700 scale-95 shadow-inner shadow-black/80' 
                  : 'bg-gradient-to-br from-red-600 to-red-700 hover:brightness-110 active:scale-95 shadow-xl shadow-red-500/20 hover:shadow-red-500/30'
              }`}
            >
              <AlertOctagon className={`w-8 h-8 mb-1.5 ${isHolding ? 'animate-spin' : ''}`} />
              <span className="text-xl uppercase font-extrabold font-headline-lg text-white">SOS</span>
              <span className="text-[8px] opacity-75 font-mono uppercase tracking-normal font-medium mt-1">HOLD TO TEST</span>
            </button>
          ) : (
            <button
              onClick={cancelSOSAlert}
              id="cancel-sos-alert-button"
              className="w-32 h-32 rounded-full bg-surface border border-red-500/30 flex flex-col justify-center items-center font-bold text-white transition-all duration-300 shadow-2xl relative animate-pulse cursor-pointer hover:border-red-500/60"
            >
              <AlertTriangle className="w-8 h-8 text-red-500 mb-1" />
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">CANCEL</span>
              <span className="text-lg text-white font-extrabold mt-0.5">SOS</span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-center text-on-surface-variant max-w-xs mt-4">
          {!isTripped 
            ? 'PRESS & HOLD the SOS beacon for 1.5s to dispatch secure coordinates, fire off emergency SMS, and request police assistance.' 
            : 'SOS INCIDENT IS LIVE. Click the center circular button to stand-down or cancel the distress state.'}
        </p>
      </div>

      {/* GPS Coordinate Display Panel */}
      <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-[11px] flex justify-between items-center font-mono">
        <div className="flex gap-2 items-center">
          <MapPin className="w-3.5 h-3.5 text-red-400 animate-bounce" />
          <span className="text-on-surface-variant">GPS Grid Ref:</span>
          <span className="text-white font-bold">{simulatedCoords.lat.toFixed(5)} N, {simulatedCoords.lng.toFixed(5)} E</span>
        </div>
        <span className="bg-white/5 px-2 py-0.5 rounded text-on-surface-variant text-[9px] uppercase font-bold">
          {isTripped ? '📍 Moving Vector' : '📡 Fixed Node'}
        </span>
      </div>

      {/* Broadcasting Activity Trail */}
      <div className="space-y-2 select-none">
        <h5 className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Target Dispatch Log Trail</h5>
        <div className="bg-black/30 rounded-xl max-h-40 overflow-y-auto border border-white/5 text-xs divide-y divide-white/5">
          {sosLogs.map(log => (
            <div key={log.id} className="p-2.5 flex justify-between gap-4 items-start hover:bg-white/5 transition-all">
              <div className="space-y-0.5">
                <div className="flex gap-1.5 items-center">
                  <span className="font-bold text-[11px] text-white">{log.title}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  {log.description}
                </p>
              </div>
              <span className="text-[9px] font-mono text-on-surface-variant mt-0.5 whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
