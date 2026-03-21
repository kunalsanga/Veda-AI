"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Plus, Users, MoreVertical } from "lucide-react";

interface GroupData {
  id: string;
  name: string;
  studentCount: number;
}

export default function GroupsPage() {
  // Replace with actual data hooks later
  const [groups, setGroups] = useState<GroupData[]>([]);

  const hasGroups = groups.length > 0;

  return (
    <AppLayout topBarTitle="My Groups">
      <div className="px-4 md:px-8">
        <div className="lg:hidden mb-4">
          <div className="flex items-center mb-2">
            <h1 className="text-lg font-bold text-foreground flex-1 text-center pr-7">My Groups</h1>
          </div>
        </div>

        {hasGroups ? (
          <>
            <div className="hidden lg:block mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h1 className="text-xl font-bold text-foreground">
                  My Groups
                </h1>
              </div>
              <p className="text-sm text-muted-foreground ml-[18px]">
                Manage your student groups and cohorts.
              </p>
            </div>

            <div className="flex justify-end mb-6">
              <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Create Group
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
              {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-8">
                    <h3 className="text-lg md:text-xl font-black tracking-tight text-foreground pr-4 pt-1">{group.name}</h3>
                    <div className="relative">
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-bold pt-4 text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{group.studentCount} Students</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 text-center">
              No groups created yet
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
              Create groups to manage your students, share assignments, and track class progress effectively.
            </p>
            <button
              className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-white rounded-full bg-gray-900 hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
