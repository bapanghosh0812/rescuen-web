import React, { useState } from 'react';
import { ShieldCheck, MapPin, Battery, Sliders, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function PermissionsGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const [locationState, setLocationState] = useState<'pending' | 'granted' | 'failed'>('pending');
  const [batteryState, setBatteryState] = useState<'pending' | 'exempt' | 'failed'>('pending');
  const [customDiagnostic, setCustomDiagnostic] = useState(false);

  const testLocationPermission = () => {
    setLocationState('granted');
    setTimeout(() => {
      // Step onward
      setCurrentStep(2);
    }, 1200);
  };

  const testBatteryExemption = () => {
    setBatteryState('exempt');
    setTimeout(() => {
      setCurrentStep(3);
    }, 1200);
  };

  const resetTutorial = () => {
    setLocationState('pending');
    setBatteryState('pending');
    setCurrentStep(1);
    setCustomDiagnostic(false);
  };

  return (
    <div id="permissions-guide-container" className="bg-surface-container border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-[460px]">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500/20 text-green-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-headline-md text-base text-on-surface font-semibold">Guided Permissions</h4>
              <p className="text-[10px] text-on-surface-variant leading-none">Diagnostic Safety Clearance Engine</p>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-mono text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
            STEP {currentStep} OF 3
          </span>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0 h-11 w-11 flex items-center justify-center">
                <MapPin className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-on-surface">Step 1: Background Location Permission</h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The RESCUEN 1KM Moving Radar requires continuous real-time background location telemetry. It shifts map grids automatically as you move. 
                </p>
              </div>
            </div>

            <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 text-xs text-blue-300 flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                <b>Critical Warning:</b> Select <b>"Allow All the Time"</b> in your native device systems. Selecting "Only while using" results in radar freezes if your screen locks in transit.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              {locationState === 'pending' ? (
                <button
                  type="button"
                  onClick={testLocationPermission}
                  id="grant-location-sim"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wide transition-all shadow-lg shadow-blue-500/10 active:scale-95 cursor-pointer"
                >
                  Test & Approve Coordinate Telementry
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-green-400 font-bold font-mono">
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  ACCESS GRANTED SUCCESSFULLY
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 shrink-0 h-11 w-11 flex items-center justify-center">
                <Battery className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-on-surface">Step 2: Battery Doze Exemption Settings</h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Intruder and silent broadcasts must fire immediately, even if your phone has been asleep for hours. Custom manufacturer ROMs aggressively kill silent tasks.
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10 text-xs text-yellow-300 flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p>
                <b>Important:</b> Exclude RESCUEN from default battery restriction loops. Disable "Adaptive Battery Optimization" for this application.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              {batteryState === 'pending' ? (
                <button
                  type="button"
                  onClick={testBatteryExemption}
                  id="exempt-battery-sim"
                  className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wide transition-all shadow-lg shadow-yellow-500/10 active:scale-95 cursor-pointer"
                >
                  Exempt Application from Doze State
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-green-400 font-bold font-mono">
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  ENERGY OPTIMIZATION IMMUNE APPROVED
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 text-center py-4 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="inline-flex p-3 bg-green-500/10 text-green-400 rounded-full mb-2">
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </div>
            <h5 className="font-bold text-base text-on-surface">Device Cleared for Full SOS Operation</h5>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Your device configurations have been thoroughly examined. Moving radar beacons, acoustic sirens, and NLP chat features are fully synced with dispatch servers. Excellent!
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setCustomDiagnostic(!customDiagnostic)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface text-xs font-bold py-2 px-4 rounded-xl transition-all font-mono"
              >
                {customDiagnostic ? 'Hide Signal Diagnostic' : 'Run Vector Diagnostic Check'}
              </button>
            </div>

            {customDiagnostic && (
              <div className="bg-black/40 p-3 rounded-lg text-left text-[10px] font-mono space-y-1 text-green-400 border border-green-500/10 max-w-xs mx-auto">
                <p>● Ping response: 42ms (Active Gateway)</p>
                <p>● NLP Bot server initialized: Ready</p>
                <p>● 1KM moving coordinate loops: Live</p>
                <p>● System power profile: High-Immunity</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer reset button */}
      <div className="flex justify-between items-center border-t border-white/10 pt-3 shrink-0">
        <span className="text-[10px] text-on-surface-variant">Diagnostics status: <b>Excellent</b></span>
        <button
          onClick={resetTutorial}
          className="text-on-surface-variant hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Diagnostics
        </button>
      </div>
    </div>
  );
}
