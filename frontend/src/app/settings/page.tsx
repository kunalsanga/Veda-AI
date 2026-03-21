"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { User, School, Settings as SettingsIcon, Save } from "lucide-react";

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("Veda User");
  const [email, setEmail] = useState("admin@veda.ai");
  const [schoolName, setSchoolName] = useState("Delhi Public School");
  const [location, setLocation] = useState("Bokaro Steel City");
  const [notifications, setNotifications] = useState(true);

  return (
    <AppLayout topBarTitle="Settings">
      <div className="px-4 md:px-8 max-w-4xl mx-auto w-full">
        {/* Mobile Header */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center mb-2">
            <h1 className="text-lg font-bold text-foreground flex-1 text-center pr-7">Settings</h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />
            <h1 className="text-xl font-bold text-foreground">
              Account Settings
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[18px]">
            Manage your personal profile and application preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#f0f0f0] rounded-[32px] p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-foreground" />
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Profile Information
            </h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-5 py-3.5 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all text-gray-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all text-gray-500"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* School Info Card */}
        <div className="bg-[#f0f0f0] rounded-[32px] p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <School className="w-6 h-6 text-foreground" />
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              School Details
            </h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                School/Institution Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-5 py-3.5 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all text-gray-500"
                placeholder="Enter institution name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-5 py-3.5 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all text-gray-500"
                placeholder="City, State"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#f0f0f0] rounded-[32px] p-6 md:p-8 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
               <SettingsIcon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight mb-0.5">
                Email Notifications
              </h2>
              <p className="text-sm text-gray-500">
                Receive alerts when assignments are generated.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mb-12">
          <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
