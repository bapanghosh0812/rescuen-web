/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Contact {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserProfile {
  name: string;
  email: string;
  emergencyContacts: string[];
  status: 'Active' | 'Under Alert' | 'Offline';
}

export interface RadarUser {
  id: string;
  name: string;
  distance: number; // in meters (e.g., 200, 450)
  angle: number; // in degrees (0-360) for mapping
  status: 'safe' | 'helper' | 'distress';
  phone?: string;
  lastActive: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface SafetyAlertLog {
  id: string;
  title: string;
  time: string;
  type: 'sms_sent' | 'radar_ping' | 'police_called' | 'siren_active';
  description: string;
}
