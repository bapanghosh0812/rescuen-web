import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronDown, 
  Menu, 
  X, 
  AlertOctagon, 
  Volume2, 
  Radar, 
  Bot, 
  Lock, 
  Sliders, 
  Siren, 
  CheckCircle,
  HelpCircle,
  Smartphone,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

import { UserProfile } from './types';
import SirenSynthesizer from './components/SirenSynthesizer';
import RadarMap from './components/RadarMap';
import SOSBroadcaster from './components/SOSBroadcaster';
import RescueChat from './components/RescueChat';
import PermissionsGuide from './components/PermissionsGuide';
import ProfileDashboard from './components/ProfileDashboard';

// Images hotlinks from HTML
const IMAGES = {
  logo: '/logo.jpg', 
  phone_mockup: '/Untitled design.jpg', // Tera wo red wala mobile screenshot
  whatsapp: '/WhatsApp Image 2026-04-01 at 1.30.36 AM.jpeg', // WhatsApp icon ke liye koi chota image dal dena public mein
  instagram: '/logo.jpg' // Instagram icon ke liye bhi
};

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'home' | 'features' | 'how-it-works' | 'dashboard'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Profile data state (can be modified by user)
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    emergencyContacts: ["+91 98832 90273", "+91 96352 97320"],
    status: "Active"
  });

  // Global safety trigger state linked between modules (e.g. SOS arms Siren automatically)
  const [globalSirenActive, setGlobalSirenActive] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleUpdateContacts = (newContacts: string[]) => {
    setProfile(prev => ({
      ...prev,
      emergencyContacts: newContacts
    }));
    showToast("Emergency contacts updated successfully!");
  };

  const handleDeleteAccount = () => {
    setProfile({
      name: "Deleted Profile",
      email: "null@rescuen.app",
      emergencyContacts: [],
      status: "Offline"
    });
    showToast("Account deleted! All user files cleared.");
  };

  const handleSOSStateChange = (active: boolean) => {
    setIsSOSActive(active);
    setProfile(prev => ({
      ...prev,
      status: active ? 'Under Alert' : 'Active'
    }));

    if (active) {
      setGlobalSirenActive(true); // Automatically play siren on major SOS trigger!
      showToast("🔴 DEEPEST ALERT TRIPPED: Dispatched satellite dispatches!");
    } else {
      setGlobalSirenActive(false);
      showToast("🟢 Safety Alert Stand-down.");
    }
  };

  const showToast = (msg: string) => {
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.innerText = msg;
      toast.classList.remove('opacity-0', 'translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
      }, 4000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setFormSubmitted(true);
    showToast(`✉️ Support Dispatch Sent from ${contactForm.email}`);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  // Scroll to section smoothly
  const scrollToSection = (id: string, tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#12131d] text-[#e2e1f0] min-h-screen font-sans overflow-x-hidden selection:bg-red-500/30 selection:text-white">
      
      {/* Absolute Toast Notification Panel */}
      <div 
        id="global-toast" 
        className="fixed bottom-6 right-6 z-50 bg-[#1e1f29] border border-white/15 px-4 py-3 rounded-xl shadow-2xl text-xs font-mono font-bold text-white transition-all duration-300 transform opacity-0 translate-y-2 select-none pointer-events-none"
      />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-[#12131d]/85 backdrop-blur-xl border-b border-white/10 shrink-0 select-none">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home', 'home')}>
            <img alt="RESCUEN Logo" className="h-10 w-auto" src={IMAGES.logo} />
            <span className="font-headline-md text-xl md:text-2xl font-black tracking-tighter text-[#FF3B30] drop-shadow-[0_0_8px_rgba(255,59,48,0.3)]">
              RESCUEN
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex gap-8 items-center">
            <button 
              onClick={() => scrollToSection('home', 'home')}
              className={`font-label-md text-sm transition-all pb-1 cursor-pointer font-bold ${
                activeTab === 'home' ? 'text-[#bdc2ff] border-b-2 border-[#bdc2ff]' : 'text-[#e2e1f0]/60 hover:text-white'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features', 'features')}
              className={`font-label-md text-sm transition-all pb-1 cursor-pointer font-bold ${
                activeTab === 'features' ? 'text-[#bdc2ff] border-b-2 border-[#bdc2ff]' : 'text-[#e2e1f0]/60 hover:text-white'
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className={`font-label-md text-sm transition-all pb-1 cursor-pointer font-bold ${
                activeTab === 'how-it-works' ? 'text-[#bdc2ff] border-b-2 border-[#bdc2ff]' : 'text-[#e2e1f0]/60 hover:text-white'
              }`}
            >
              How it Works
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                id="profile-dropdown-trigger"
                className="font-label-md text-sm text-[#e2e1f0]/60 hover:text-white transition-all flex items-center gap-1 py-4 font-bold cursor-pointer"
              >
                My Profile <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 w-48 bg-[#1e1f29] border border-white/10 rounded-xl shadow-2xl py-2 z-50 mt-1"
                  >
                    <button 
                      onClick={() => {
                        scrollToSection('dashboard', 'dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors text-xs font-semibold cursor-pointer text-[#e2e1f0]"
                    >
                      Account Management
                    </button>
                    <hr className="border-white/10 my-1" />
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        alert('Logout Simulated!');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors text-xs cursor-pointer text-[#ffb4ab] font-bold"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Action Button & Mobile Burger */}
          <div className="flex items-center gap-4">
            <a 
              href="https://play.google.com/store" 
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex bg-[#0c23fa] text-white font-label-md text-xs px-5 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all duration-300 items-center gap-2 font-bold shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20"
            >
              <Smartphone className="w-4 h-4" />
              Download Play Store
            </a>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#e2e1f0] hover:bg-white/5 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#12131d] border-b border-white/10 overflow-hidden flex flex-col px-6 pb-6 pt-2 gap-4"
            >
              <button 
                onClick={() => scrollToSection('home', 'home')}
                className="w-full text-left py-2 font-semibold text-[#e2e1f0]"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features', 'features')}
                className="w-full text-left py-2 font-semibold text-[#e2e1f0]"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works', 'how-it-works')}
                className="w-full text-left py-2 font-semibold text-[#e2e1f0]"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('dashboard', 'dashboard')}
                className="w-full text-left py-2 font-semibold text-[#bdc2ff]"
              >
                Account Dashboard
              </button>
              <a 
                href="https://play.google.com/store" 
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#0c23fa] text-white text-center py-2.5 rounded-xl text-xs font-bold block"
              >
                Download on Google Play
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Container */}
      <main className="pt-20">
        
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center px-6 max-w-7xl mx-auto py-12" id="home">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Narrative Column */}
            <div className="space-y-6 z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] font-mono text-xs font-bold mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-pulse" />
                LIVE ON GOOGLE PLAY STORE
              </span>

              <h1 className="font-headline-xl text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] select-none">
                Ultimate Control, <br />
                <span className="text-[#FF3B30] drop-shadow-[0_0_12px_rgba(255,59,48,0.25)]">Instant Safety.</span> <br />
                RESCUEN.
              </h1>

              <p className="text-base text-[#c5c5da] leading-relaxed max-w-lg select-text">
                From live 1KM moving radar tracking to remote camera access, family & police alerts, and NLP AI assistance—your complete personal safety ecosystem.
              </p>

              <div className="flex flex-wrap gap-4 pt-4 shrink-0">
                <button 
                  onClick={() => scrollToSection('how-it-works', 'how-it-works')}
                  className="bg-[#FF3B30] text-white font-bold text-sm px-8 py-4.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-red-500/25 flex items-center gap-2 cursor-pointer"
                >
                  <AlertOctagon className="w-5 h-5" />
                  Trigger Test Console
                </button>
                <button 
                  onClick={() => scrollToSection('features', 'features')}
                  className="border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm px-8 py-4.5 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Right Graphic Mockup Column */}
            <div className="relative flex justify-center items-center h-[500px]">
              {/* Abstract Crimson Outer Glow Backdrop filter of mockup */}
              <div className="absolute inset-0 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

              {/* Hover Tilt Smartphone Graphics */}
              <div className="relative z-10 p-5 bg-gradient-to-tr from-white/5 to-transparent rounded-[3rem] border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 select-none">
                <img 
                  alt="App UI Mockup" 
                  className="w-full max-w-[270px] md:max-w-[320px] rounded-[2.5rem] shadow-2xl referrer-policy-no-referrer" 
                  referrerPolicy="no-referrer"
                  src={IMAGES.phone_mockup} 
                />
              </div>
            </div>

          </div>
        </section>

        {/* Total Control Features Overview Grid */}
        <section className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20" id="features">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-headline-xl text-3xl md:text-5xl text-white font-extrabold tracking-tight">Total Control</h2>
            <p className="text-base text-[#c5c5da] max-w-2xl mx-auto">
              Unparalleled safety features engineered for split-second response. Click on any card below to jump to the dashboard simulator!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div 
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className="bg-[#1e1f29] border border-white/10 rounded-2xl p-8 transition-all hover:translate-y-[-4px] hover:border-red-500/30 cursor-pointer select-none group"
            >
              <div className="bg-[#FF3B30]/15 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#FF3B30]/20 text-[#FF3B30]">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-[#e2e1f0] text-lg font-bold mb-3 flex items-center gap-1.5 group-hover:text-red-400 transition-colors">
                Advanced SOS Broadcaster
              </h3>
              <p className="text-[#c5c5da] text-xs leading-relaxed">
                Instant silent SMS to family, immediate 100 police alert, and dynamic broadcast status update. Sees nearest helpers with their precise locations on a live map for self-rescue.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className="bg-[#1e1f29] border border-white/10 rounded-2xl p-8 transition-all hover:translate-y-[-4px] hover:border-blue-500/30 cursor-pointer select-none group"
            >
              <div className="bg-[#007AFF]/15 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#007AFF]/20 text-[#007AFF]">
                <Radar className="w-7 h-7" />
              </div>
              <h3 className="text-[#e2e1f0] text-lg font-bold mb-3 flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
                Dynamic 1KM Moving Radar
              </h3>
              <p className="text-[#c5c5da] text-xs leading-relaxed">
                Provides real-time, live location tracking. If you move, the radar moves with you. Instantly see and track registered users within a 1km radius.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className="bg-[#1e1f29] border border-white/10 rounded-2xl p-8 transition-all hover:translate-y-[-4px] hover:border-blue-500/30 cursor-pointer select-none group"
            >
              <div className="bg-[#bdc2ff]/15 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#bdc2ff]/20 text-[#bdc2ff]">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-[#e2e1f0] text-lg font-bold mb-3 flex items-center gap-1.5 group-hover:text-blue-300 transition-colors">
                Remote Access
              </h3>
              <p className="text-[#c5c5da] text-xs leading-relaxed">
                Discreet, high-speed remote access to camera and microphone, activated during critical emergencies to provide eyes and ears to your helpers.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className="bg-[#1e1f29] border border-white/10 rounded-2xl p-8 transition-all hover:translate-y-[-4px] hover:border-orange-500/30 cursor-pointer select-none group"
            >
              <div className="bg-[#ffb4a7]/15 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#ffb4a7]/20 text-[#ffb4a7]">
                <Bot className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-[#e2e1f0] text-lg font-bold mb-3 flex items-center gap-1.5 group-hover:text-orange-400 transition-colors">
                RESCUEN AI Assistant
              </h3>
              <p className="text-[#c5c5da] text-xs leading-relaxed">
                Ask anything about local emergencies, app help, or safety tips. Uses Natural Language Processing (NLP) chatbot assistance.
              </p>
            </div>

            {/* Feature 5 */}
            <div 
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className="bg-[#1e1f29] border border-white/10 rounded-2xl p-8 transition-all hover:translate-y-[-4px] hover:border-red-500/30 cursor-pointer select-none group"
            >
              <div className="bg-[#ffb4ab]/15 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#ffb4ab]/20 text-[#ffb4ab]">
                <Siren className="w-7 h-7" />
              </div>
              <h3 className="text-[#e2e1f0] text-lg font-bold mb-3 flex items-center gap-1.5 group-hover:text-red-400 transition-colors">
                Emergency Siren
              </h3>
              <p className="text-[#c5c5da] text-xs leading-relaxed">
                Optional loud siren activation to attract immediate attention and sound the alarm when situational awareness is compromised.
              </p>
            </div>

            {/* Feature 6 */}
            <div 
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className="bg-[#1e1f29] border border-white/10 rounded-2xl p-8 transition-all hover:translate-y-[-4px] hover:border-green-500/30 cursor-pointer select-none group"
            >
              <div className="bg-green-500/15 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 text-green-400">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-[#e2e1f0] text-lg font-bold mb-3 flex items-center gap-1.5 group-hover:text-green-400 transition-colors">
                Guided Permissions
              </h3>
              <p className="text-[#c5c5da] text-xs leading-relaxed">
                Mandatory, step-by-step guidance for Location and Battery Optimization. Critical warnings on safety impact for your specific device.
              </p>
            </div>

          </div>
        </section>

        {/* Live Interactive Action Hub Workspace (How it works simulator!) */}
        <section className="py-20 bg-black/30 scroll-mt-20 border-t border-b border-white/5" id="how-it-works">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-16 space-y-3">
              <span className="bg-blue-600/15 text-[#bdc2ff] font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-full border border-blue-500/25">
                Tactical Interactive Sandbox Console
              </span>
              <h2 className="font-headline-xl text-3xl md:text-5xl text-white font-extrabold tracking-tight">Interactive Safety Terminal</h2>
              <p className="text-base text-[#c5c5da] max-w-2xl mx-auto">
                Interact with our live modules. Arm the SOS long-press, track movers on the live sweep canvas radar, hear the siren sweep, or query Gemini.
              </p>
            </div>

            {/* Split Grids of Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
              
              {/* SOS Broadcaster Column */}
              <div className="space-y-6">
                <SOSBroadcaster 
                  emergencyContacts={profile.emergencyContacts}
                  onTriggerSOSLocalState={handleSOSStateChange}
                  isSOSActiveExternal={isSOSActive}
                />
                
                {/* Acoustic Sounder Siren Synthesizer */}
                <SirenSynthesizer 
                  onSirenStateChange={(active) => setGlobalSirenActive(active)}
                  externalActive={globalSirenActive}
                />
              </div>

              {/* Dynamic Sweep Radar Screen */}
              <div>
                <RadarMap />
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* RESCUEN AI NLP Chatbot card proxy */}
              <div>
                <RescueChat />
              </div>

              {/* Diagnostics configuration guides */}
              <div>
                <PermissionsGuide />
              </div>

            </div>

          </div>
        </section>

        {/* Account Management Segment */}
        <section className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20" id="dashboard">
          <ProfileDashboard
            profile={profile}
            onUpdateContacts={handleUpdateContacts}
            onDeleteAccount={handleDeleteAccount}
          />
        </section>

        {/* Connect & Support Form Area */}
        <section className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20 border-t border-white/5" id="contact">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Action Card support lists */}
            <div className="space-y-6">
              <div>
                <h2 className="font-headline-lg text-3xl text-white font-extrabold tracking-tight mb-4">Connect with RESCUEN</h2>
                <p className="text-sm text-[#c5c5da] leading-relaxed">
                  Our dispatch coordinate support team is available 24/7 to assist with tactical queries or custom emergency configuration guidelines.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Support Card 1 */}
                <a href="tel:9883290273" className="flex items-center gap-4 p-4 rounded-xl bg-[#1e1f29] hover:bg-[#1e1f29]/80 border border-white/10 transition-all group">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-lg group-hover:scale-110 transition-all shrink-0">
                    <Phone className="w-5 h-5 text-[#FF3B30]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-mono tracking-wider">Primary Operations Hotline</p>
                    <p className="text-lg font-extrabold text-white font-mono leading-none mt-1">+91 98832 90273</p>
                  </div>
                </a>

                {/* Support Card 2 */}
                <a href="tel:9635297320" className="flex items-center gap-4 p-4 rounded-xl bg-[#1e1f29] hover:bg-[#1e1f29]/80 border border-white/10 transition-all group">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-lg group-hover:scale-110 transition-all shrink-0">
                    <Phone className="w-5 h-5 text-[#FF3B30]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-mono tracking-wider">Secondary Operations Hotline</p>
                    <p className="text-lg font-extrabold text-white font-mono leading-none mt-1">+91 96352 97320</p>
                  </div>
                </a>

                {/* Support Card 3 */}
                <a href="mailto:rescuensupport@gmail.com" className="flex items-center gap-4 p-4 rounded-xl bg-[#1e1f29] hover:bg-[#1e1f29]/80 border border-white/10 transition-all group">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg group-hover:scale-110 transition-all shrink-0">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-mono tracking-wider">Direct Helicopter Dispatch Mail</p>
                    <p className="text-lg font-extrabold text-white font-mono leading-none mt-1 select-all break-all">rescuensupport@gmail.com</p>
                  </div>
                </a>

              </div>

              {/* Social Channels buttons */}
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://wa.me/919883290273" 
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366]/10 text-[#25D366] px-6 py-3.5 rounded-xl flex items-center gap-2 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all font-bold text-xs"
                >
                  <img alt="WhatsApp" className="h-5 w-5 referrer-policy-no-referrer" referrerPolicy="no-referrer" src={IMAGES.whatsapp} />
                  WhatsApp Support
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#E4405F]/10 text-[#E4405F] px-6 py-3.5 rounded-xl flex items-center gap-2 border border-[#E4405F]/20 hover:bg-[#E4405F]/20 transition-all font-bold text-xs"
                >
                  <img alt="Instagram" className="h-5 w-5 referrer-policy-no-referrer" referrerPolicy="no-referrer" src={IMAGES.instagram} />
                  Instagram Dispatch
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Support Message form */}
            <div className="bg-[#1e1f29] border border-white/10 p-10 rounded-3xl" id="contact-form-widget">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-2">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-white leading-normal text-xs font-mono" 
                    placeholder="John Doe" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required 
                    disabled={formSubmitted}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-white leading-normal text-xs font-mono" 
                    placeholder="john@example.com" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required 
                    disabled={formSubmitted}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-2">How can we help?</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-white h-32 leading-relaxed text-xs" 
                    placeholder="Message..." 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required 
                    disabled={formSubmitted}
                  />
                </div>

                <button 
                  type="submit" 
                  id="submit-support-message-form"
                  className="w-full bg-[#0c23fa] text-white font-bold py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 text-xs uppercase tracking-wider cursor-pointer flex justify-center items-center gap-2"
                  disabled={formSubmitted}
                >
                  {formSubmitted ? 'MESSAGE SENDING TO SUPPORT...' : 'Send Support Message'}
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      {/* Footer copyright segment */}
      <footer className="bg-[#0c0d17] border-t border-white/10 mt-20 select-none pb-12 shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-6 max-w-7xl mx-auto gap-8">
          
          {/* Logo brand footer info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => scrollToSection('home', 'home')}>
              <img alt="RESCUEN Logo" className="h-8 w-auto" src={IMAGES.logo} />
              <span className="font-headline-md text-base text-lg font-black tracking-tight text-[#FF3B30]">
                RESCUEN
              </span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
              Empowering individuals around India with reliable, high-stakes satellite coordinate personal safety emergency ecosystems.
            </p>
          </div>

          {/* Links navigation lists */}
          <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold">
            <button onClick={() => alert('Privacy Document')} className="text-on-surface-variant hover:text-[#FF3B30] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => alert('Terms Document')} className="text-on-surface-variant hover:text-[#FF3B30] transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => scrollToSection('contact', 'home')} className="text-on-surface-variant hover:text-[#FF3B30] transition-colors cursor-pointer">
              Contact Us
            </button>
            <button onClick={() => alert('Report Filing')} className="text-on-surface-variant hover:text-[#FF3B30] transition-colors cursor-pointer">
              Report Centre
            </button>
          </div>

          <p className="text-xs text-on-surface-variant font-mono">
            © 2026 RESCUEN App. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}
