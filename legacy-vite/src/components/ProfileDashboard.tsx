import React, { useState } from 'react';
import { ShieldCheck, LogOut, Trash2, Edit3, HelpCircle, Phone, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileDashboardProps {
  profile: UserProfile;
  onUpdateContacts: (contacts: string[]) => void;
  onDeleteAccount: () => void;
}

export default function ProfileDashboard({ profile, onUpdateContacts, onDeleteAccount }: ProfileDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContacts, setEditedContacts] = useState<string[]>(profile.emergencyContacts);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContacts(editedContacts);
    setIsEditing(false);
  };

  const handleContactChange = (index: number, value: string) => {
    const updated = [...editedContacts];
    updated[index] = value;
    setEditedContacts(updated);
  };

  const triggerPermanentDelete = () => {
    setIsDeleting(true);
  };

  const confirmPermanentDelete = () => {
    setIsDeleting(false);
    onDeleteAccount();
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10" id="dashboard">
      {/* John Doe Profile Left Column */}
      <div className="p-10 border-b md:border-b-0 md:border-r border-white/10 bg-white/5 w-full md:w-80 shrink-0">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 text-headline-md font-bold text-white shadow-lg shadow-blue-500/20 select-none">
          {profile.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 className="font-headline-md text-headline-md text-white font-bold">{profile.name}</h3>
        <p className="text-on-surface-variant text-sm select-all">{profile.email}</p>
        
        <div className="mt-8 space-y-3">
          <p className="text-label-sm uppercase text-on-surface/40 tracking-wider">Emergency Contacts (SMS Broadcasters)</p>
          {profile.emergencyContacts.map((phone, idx) => (
            <div key={idx} className="flex items-center gap-2 font-mono text-primary bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 text-xs">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{phone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account Management Right Panel */}
      <div className="flex-1 p-10 flex flex-col justify-between min-h-[340px]">
        <div>
          <h2 className="font-headline-lg text-headline-lg mb-2 text-white font-extrabold tracking-tight">Account Management</h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Manage your high-security safety profile, emergency phone dispatch lists, and server accounts.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsEditing(true)}
              id="edit-numbers-dashboard-button"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-label-md transition-all duration-300 shadow-md shadow-green-500/10 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Edit Numbers
            </button>
            
            <button 
              onClick={() => alert('Logout Simulated! Profile status cleared.')}
              id="logout-dashboard-button"
              className="bg-surface-variant hover:bg-outline-variant text-white px-6 py-3 rounded-xl font-label-md transition-all duration-300 flex items-center gap-2 cursor-pointer border border-white/5"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            <button 
              onClick={triggerPermanentDelete}
              id="delete-account-dashboard-button"
              className="bg-red-600 hover:brightness-125 text-white px-6 py-3 rounded-xl font-label-md transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md shadow-red-500/15"
            >
              <Trash2 className="w-4 h-4" />
              Permanent Delete Account
            </button>
          </div>
        </div>

        {/* Footer info line of dashboard */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-on-surface-variant text-xs border-t border-white/5 pt-6">
          <a href="#contact" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold py-1">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            Report / Help Centre
          </a>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-label-sm font-mono tracking-wider">
              Profile Status: <span className="text-green-400 font-bold font-sans uppercase">Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Edit Numbers Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-left border border-white/20">
            <h3 className="font-headline-md text-headline-md mb-2 text-white font-extrabold flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-400 animate-pulse" />
              Update Emergency Dispatches
            </h3>
            <p className="text-on-surface-variant text-xs mb-6 leading-relaxed">
              Define the telephone targets for secure offline SMS coordinates broadcasts when SOS is triggered. Add full international codes.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {editedContacts.map((contact, index) => (
                <div key={index}>
                  <label className="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">
                    Emergency Primary Recipient #{index + 1}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none leading-normal"
                    value={contact}
                    onChange={(e) => handleContactChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditedContacts(profile.emergencyContacts);
                    setIsEditing(false);
                  }}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-surface-variant text-white hover:bg-outline-variant transition-colors text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-colors text-xs font-bold"
                >
                  Save Dispatch Contacts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Deletion Warn Modal Overlay */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-radial duration-300">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-center border border-red-500/30">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Trash2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="font-headline-lg text-headline-lg mb-2 text-white font-bold">Are you absolutely sure?</h3>
            <p className="text-on-surface-variant text-xs mb-8 leading-relaxed max-w-sm mx-auto">
              This action is immediate and absolute. All emergency contacts, radar tracking registries, active safety logs, and chat credentials will be permanently deleted.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsDeleting(false)} 
                className="flex-1 px-5 py-3 rounded-xl bg-surface-variant text-white hover:bg-outline-variant transition-colors text-xs font-bold font-mono"
              >
                No, Keep Account
              </button>
              <button 
                onClick={confirmPermanentDelete} 
                className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white hover:brightness-125 transition-colors text-xs font-bold font-mono"
              >
                Permanently Purge My Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
