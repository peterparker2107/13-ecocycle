import { useState, useEffect, useMemo } from 'react';
import {
  Bike,
  Zap,
  MapPin,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Sparkles,
  Award,
  Coffee,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  Leaf,
  Layers,
  BatteryCharging,
  TrendingUp,
  User,
  Check
} from 'lucide-react';
import { CAMPUS_STATIONS, MOCK_BIKES, CAMPUS_LEADERBOARD, ECO_REWARDS, CampusStation, Bicycle } from './data/ecocycle';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [activeTab, setActiveTab] = useState<'stations' | 'simulator' | 'rewards' | 'unlock'>('stations');

  // Selected Stations for Ride
  const [originStation, setOriginStation] = useState<CampusStation>(CAMPUS_STATIONS[2]); // Hostel J & M
  const [destStation, setDestStation] = useState<CampusStation>(CAMPUS_STATIONS[4]);   // CSED Plaza
  const [selectedBikeType, setSelectedBikeType] = useState<'Smart E-Bike' | '7-Speed Pedal'>('Smart E-Bike');

  // Live Ride Simulation State
  const [isRiding, setIsRiding] = useState(false);
  const [rideSeconds, setRideSeconds] = useState(0);
  const [rideDistance, setRideDistance] = useState(0);
  const [userCredits, setUserCredits] = useState(450);
  const [totalSavedCo2, setTotalSavedCo2] = useState(1842.6);
  const [lastRideReceipt, setLastRideReceipt] = useState<{
    origin: string;
    dest: string;
    durationMins: number;
    distanceKm: number;
    co2Kg: number;
    creditsEarned: number;
  } | null>(null);

  // QR Unlock State
  const [unlockStatus, setUnlockStatus] = useState<'idle' | 'scanning' | 'unlocked'>('idle');
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [reportedIssue, setReportedIssue] = useState<string | null>(null);

  // Timer interval for live ride
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRiding) {
      interval = setInterval(() => {
        setRideSeconds(prev => prev + 1);
        setRideDistance(d => Number((d + 0.0042).toFixed(3)));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRiding]);

  const handleStartRide = () => {
    setIsRiding(true);
    setRideSeconds(0);
    setRideDistance(0.01);
    setLastRideReceipt(null);
  };

  const handleEndRide = () => {
    setIsRiding(false);
    const co2Saved = Number((rideDistance * 0.12).toFixed(2));
    const credits = Math.max(10, Math.round(rideDistance * 25));
    
    setTotalSavedCo2(prev => Number((prev + co2Saved).toFixed(2)));
    setUserCredits(prev => prev + credits);

    setLastRideReceipt({
      origin: originStation.name,
      dest: destStation.name,
      durationMins: Math.max(1, Math.round(rideSeconds / 60)),
      distanceKm: rideDistance,
      co2Kg: co2Saved,
      creditsEarned: credits,
    });
  };

  const handleSimulateQRScan = () => {
    setUnlockStatus('scanning');
    setTimeout(() => {
      setUnlockStatus('unlocked');
    }, 1200);
  };

  const handleRedeem = (id: string, cost: number) => {
    if (userCredits >= cost && !redeemedRewards.includes(id)) {
      setUserCredits(prev => prev - cost);
      setRedeemedRewards(prev => [...prev, id]);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Frosted Sticky Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-[#0f172a]/80 border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    EcoCycle
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    GEOFENCE v3.1
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  TIET Smart Campus P2P Micro-Mobility & Carbon Engine
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center overflow-x-auto gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => setActiveTab('stations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'stations'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Campus Docks
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Live Ride Sim
              {isRiding && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'rewards'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              Carbon & Credits
            </button>

            <button
              onClick={() => setActiveTab('unlock')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'unlock'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              1-Tap QR Unlock
            </button>
          </nav>

          {/* Right Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300">
                7 STATIONS LIVE
              </span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Bento Grid KPI Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available Fleet */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Campus Fleet In-Service
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Bike className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                114
              </span>
              <span className="text-xs text-slate-400">/ 142 docks ready</span>
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              <span>48 Smart E-Bikes (Avg 84% Charge)</span>
            </p>
          </div>

          {/* Card 2: Active Transit */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Active Campus Riders
              </span>
              <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Zap className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-teal-600 dark:text-teal-400">
                28
              </span>
              <span className="text-xs text-slate-400">students in transit</span>
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              Peak traffic: Hostel J ⇄ CSED corridor
            </p>
          </div>

          {/* Card 3: Carbon Saved */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Campus Carbon Offset
              </span>
              <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <Leaf className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {totalSavedCo2}
              </span>
              <span className="text-xs font-mono text-emerald-500">kg CO2</span>
            </div>
            <p className="mt-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Equivalent to planting 84 trees</span>
            </p>
          </div>

          {/* Card 4: Green Credits Balance */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Your TIET Green Credits
              </span>
              <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-amber-500">
                {userCredits}
              </span>
              <span className="text-xs text-slate-400">Credits</span>
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              Redeemable at Jaggi Canteen & Verka
            </p>
          </div>
        </div>

        {/* TAB 1: CAMPUS DOCKS & STATIONS */}
        {activeTab === 'stations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAMPUS_STATIONS.map(st => {
                const isOrigin = originStation.id === st.id;
                const isDest = destStation.id === st.id;

                return (
                  <div
                    key={st.id}
                    className={`rounded-2xl border p-5 transition-all duration-200 ${
                      isOrigin || isDest
                        ? 'bg-white dark:bg-slate-900 border-emerald-500/60 shadow-md shadow-emerald-500/5'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            {st.code}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Geofence {st.geofenceRadiusMeters}m
                          </span>
                        </div>
                        <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                          {st.name}
                        </h4>
                      </div>

                      {/* Station Availability Ring */}
                      <div className="text-right">
                        <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {st.availableBikes}
                        </span>
                        <span className="text-xs text-slate-400 font-mono"> / {st.totalDocks}</span>
                        <p className="text-[10px] text-slate-400">bicycles</p>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {st.description}
                    </p>

                    {/* Breakdown */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Smart E-Bikes</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-emerald-500" />
                          {st.ebikesCount} ({st.avgBatteryPercent}%)
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Standard Geared</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                          <Bike className="w-3.5 h-3.5 text-slate-400" />
                          {st.standardCount} cycles
                        </p>
                      </div>
                    </div>

                    {/* Station Quick Routing */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setOriginStation(st);
                          setActiveTab('simulator');
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition ${
                          isOrigin
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isOrigin ? '✓ Pickup Station' : 'Set as Pickup'}
                      </button>

                      <button
                        onClick={() => {
                          setDestStation(st);
                          setActiveTab('simulator');
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition ${
                          isDest
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isDest ? '✓ Dropoff Station' : 'Set as Dropoff'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE RIDE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Interactive Ride Dashboard */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Bike className="w-5 h-5 text-emerald-500" />
                      Virtual Campus Ride Telemetry
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Real-time Bluetooth BLE Geofence GPS tracking simulation
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    isRiding
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {isRiding ? '● RIDE IN PROGRESS' : 'STANDBY AT DOCK'}
                  </span>
                </div>

                {/* Stations Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 font-medium">Pickup Station (Origin)</label>
                    <select
                      disabled={isRiding}
                      value={originStation.id}
                      onChange={(e) => {
                        const s = CAMPUS_STATIONS.find(item => item.id === e.target.value);
                        if (s) setOriginStation(s);
                      }}
                      className="mt-1 w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
                    >
                      {CAMPUS_STATIONS.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.availableBikes} bikes)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-medium">Dropoff Station (Destination)</label>
                    <select
                      disabled={isRiding}
                      value={destStation.id}
                      onChange={(e) => {
                        const s = CAMPUS_STATIONS.find(item => item.id === e.target.value);
                        if (s) setDestStation(s);
                      }}
                      className="mt-1 w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
                    >
                      {CAMPUS_STATIONS.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.totalDocks - s.availableBikes} docks free)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Telemetry Display */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900 text-white font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Ride Time</span>
                    <p className="text-2xl font-bold mt-1 text-emerald-400">
                      {Math.floor(rideSeconds / 60).toString().padStart(2, '0')}:{(rideSeconds % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Distance</span>
                    <p className="text-2xl font-bold mt-1 text-white">
                      {rideDistance.toFixed(2)} <span className="text-xs text-slate-400">km</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Pace / Speed</span>
                    <p className="text-2xl font-bold mt-1 text-teal-400">
                      {isRiding ? '14.8' : '0.0'} <span className="text-xs text-slate-400">km/h</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">CO2 Mitigated</span>
                    <p className="text-2xl font-bold mt-1 text-emerald-400">
                      {(rideDistance * 0.12).toFixed(2)} <span className="text-xs text-slate-400">kg</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isRiding ? (
                    <button
                      onClick={handleStartRide}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Start Ride at {originStation.name}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setRideSeconds(prev => prev + 30);
                          setRideDistance(prev => Number((prev + 0.15).toFixed(2)));
                        }}
                        className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 transition"
                      >
                        ⚡ Fast-Forward +30s (+150m)
                      </button>

                      <button
                        onClick={handleEndRide}
                        className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        End Ride & Lock at {destStation.name}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Col: Last Ride Receipt */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div className="border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">EcoCycle Mobility Receipt</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Ride Verification Slip
                  </h4>
                </div>

                {lastRideReceipt ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Geofenced Docking Confirmed!
                      </div>
                      <p className="text-[11px] mt-1">
                        Bike successfully returned to official docking perimeter.
                      </p>
                    </div>

                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">From:</span>
                        <span className="font-semibold">{lastRideReceipt.origin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">To:</span>
                        <span className="font-semibold">{lastRideReceipt.dest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Distance:</span>
                        <span className="font-semibold">{lastRideReceipt.distanceKm.toFixed(2)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <span className="font-semibold">{lastRideReceipt.durationMins} mins</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>CO2 Mitigated:</span>
                        <span>{lastRideReceipt.co2Kg} kg</span>
                      </div>
                      <div className="flex justify-between text-amber-500 font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Credits Awarded:</span>
                        <span>+{lastRideReceipt.creditsEarned} pts</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <Bike className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    Complete a simulated trip to inspect receipt details and earn Thapar Green Credits.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CARBON OFFSET & REWARDS */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaderboard (2 Cols) */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      TIET Campus Sustainability Leaderboard
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recognizing students with the highest zero-emission mobility footprint
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                    Spring 2026 Season
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                        <th className="pb-3 text-center">Rank</th>
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Hostel</th>
                        <th className="pb-3 text-center">Rides</th>
                        <th className="pb-3 text-center">Distance</th>
                        <th className="pb-3 text-center">CO2 Saved</th>
                        <th className="pb-3 text-right">Credits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {CAMPUS_LEADERBOARD.map(entry => (
                        <tr key={entry.rank} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 text-center font-bold">
                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                          </td>
                          <td className="py-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                            {entry.name}
                            <span className="block text-[10px] text-slate-400 font-mono">{entry.rollNo}</span>
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-400">{entry.hostel}</td>
                          <td className="py-3 text-center font-bold">{entry.ridesCount}</td>
                          <td className="py-3 text-center text-teal-600 dark:text-teal-400">{entry.distanceKm} km</td>
                          <td className="py-3 text-center text-emerald-600 dark:text-emerald-400">{entry.co2SavedKg} kg</td>
                          <td className="py-3 text-right font-bold text-amber-500">{entry.greenCredits} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rewards Store (1 Col) */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Green Credits Canteen Store
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your Balance: <strong className="text-amber-500 font-mono">{userCredits} Credits</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  {ECO_REWARDS.map(rew => {
                    const isRedeemed = redeemedRewards.includes(rew.id);
                    const canAfford = userCredits >= rew.costCredits;

                    return (
                      <div
                        key={rew.id}
                        className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 text-xs space-y-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-slate-900 dark:text-white">{rew.title}</h5>
                            <span className="text-[10px] text-slate-400 font-mono">{rew.vendor}</span>
                          </div>
                          <span className="font-mono font-bold text-amber-500">{rew.costCredits} pts</span>
                        </div>

                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {rew.discountText}
                        </p>

                        <button
                          disabled={!canAfford || isRedeemed}
                          onClick={() => handleRedeem(rew.id, rew.costCredits)}
                          className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                            isRedeemed
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : canAfford
                              ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isRedeemed ? '✓ Voucher Redeemed' : canAfford ? 'Redeem Voucher' : 'Insufficient Credits'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 1-TAP QR UNLOCK PASS */}
        {activeTab === 'unlock' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6 text-center">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  BLUETOOTH 5.3 BLE SMART DOCK LINK
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  1-Tap Instant Unlock Beacon
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hold smartphone near the EcoCycle handlebars or scan station dock QR code
                </p>
              </div>

              {/* Scanning / Unlocked Visualizer */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
                  unlockStatus === 'unlocked'
                    ? 'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500'
                    : unlockStatus === 'scanning'
                    ? 'bg-indigo-500/10 border-2 border-indigo-500 text-indigo-500 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  {unlockStatus === 'unlocked' ? (
                    <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                  ) : unlockStatus === 'scanning' ? (
                    <QrCode className="w-20 h-20 text-indigo-500 animate-spin" />
                  ) : (
                    <QrCode className="w-20 h-20 text-slate-700 dark:text-slate-300" />
                  )}
                </div>

                <div className="mt-4 font-mono text-xs">
                  {unlockStatus === 'unlocked' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      LOCK UNLATCHED — ENJOY YOUR RIDE!
                    </span>
                  ) : unlockStatus === 'scanning' ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      Pairing with Smart Ring Lock #EC-VOLT-103...
                    </span>
                  ) : (
                    <span className="text-slate-500">Ready to authenticate via BLE proximity</span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-xs font-mono space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nearest Bike:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">EC-VOLT-103 (Smart E-Bike)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Battery Level:</span>
                  <span className="font-semibold text-emerald-500">96% (Est. 42 km Range)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Station Dock:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Hostel J & M Dock #04</span>
                </div>
              </div>

              <button
                onClick={handleSimulateQRScan}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <Zap className="w-4 h-4 fill-white" />
                Tap to Simulate Bluetooth Unlock (Haptic Chime)
              </button>

              {/* Issue report */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setReportedIssue(reportedIssue ? null : 'Flat Tyre reported at Dock #04. Crew notified!')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline font-mono"
                >
                  Report bike maintenance issue or flat tyre
                </button>
                {reportedIssue && (
                  <p className="mt-2 text-xs text-amber-500 font-medium">
                    ✓ {reportedIssue}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
