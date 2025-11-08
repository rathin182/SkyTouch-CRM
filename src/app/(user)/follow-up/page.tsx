"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FollowModels from "@/components/ui/FollowModels";

interface Activity {
  id: number;
  name: string;
  company: string;
  type: string;
  priority: "Low" | "Medium" | "High";
  scheduled: string;
  time: string;
  status: "Overdue" | "Pending" | "Completed";
  avatar: string;
}
interface Lead extends Activity {}

const stats = [
  { title: "Urgent", subtitle: "Overdue Follow-ups", value: "8", icon: AlertCircle, color: "text-red-500" },
  { title: "Today", subtitle: "Due Today", value: "15", icon: Clock, color: "text-yellow-400" },
  { title: "This Week", subtitle: "Scheduled", value: "42", icon: CalendarIcon, color: "text-cyan-400" },
  { title: "Completed", subtitle: "Total Done", value: "127", icon: CheckCircle, color: "text-green-400" },
];

const initialActivities: Activity[] = [
  { id: 1, name: "Karan Malhotra", company: "Media House", type: "Call", priority: "Medium", scheduled: "636 days ago", time: "12:00", status: "Overdue", avatar: "KM" },
  { id: 2, name: "Pooja Bansal", company: "Travel Agency", type: "Follow-Up", priority: "Low", scheduled: "635 days ago", time: "17:00", status: "Overdue", avatar: "PB" },
  { id: 3, name: "Sanjay Kapoor", company: "Automotive Parts", type: "Email", priority: "High", scheduled: "634 days ago", time: "08:30", status: "Overdue", avatar: "SK" },
  { id: 4, name: "Rajesh Kumar", company: "Tech Solutions Pvt Ltd", type: "Call", priority: "High", scheduled: "633 days ago", time: "10:00", status: "Pending", avatar: "RK" },
  { id: 5, name: "Priya Sharma", company: "Digital Marketing Co", type: "Email", priority: "Medium", scheduled: "633 days ago", time: "14:30", status: "Pending", avatar: "PS" },
  { id: 6, name: "Amit Patel", company: "Manufacturing Ltd", type: "Meeting", priority: "High", scheduled: "632 days ago", time: "11:00", status: "Pending", avatar: "AP" },
];

const quickFilters = [
  { label: "Overdue", value: "overdue", variant: "destructive" as const },
  { label: "High Priority", value: "high", variant: "default" as const },
  { label: "Calls Due", value: "calls", variant: "default" as const },
  { label: "Clear All", value: "clear", variant: "ghost" as const },
];

const activityToLead = (activity: Activity): Lead => activity as Lead;

const Page = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [popup, setPopup] = useState<null | "view" | "edit">(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleCompleteActivity = (activityId: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
  };

  const handleUpdateLead = async (leadId: number, data: Partial<Lead>): Promise<void> => {
    await new Promise((r) => setTimeout(r, 500));
    setActivities((prev) => prev.map((a) => (a.id === leadId ? { ...a, ...data } : a)));
    setSelectedLead((prev) => (prev && prev.id === leadId ? { ...prev, ...data } : prev));
    closePopup();
  };

  const openModal = (action: "view" | "edit", lead: Lead) => {
    setSelectedLead(lead);
    setPopup(action);
  };
  const closePopup = () => setPopup(null);

  return (
    <div className="min-h-screen  text-white p-6 space-y-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Leads Follow-Up</h2>
          <p className="text-gray-400 text-sm mt-1">Track and manage your lead follow-up activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-cyan-900/20 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-800/30 hover:text-cyan-100 transition-all">
            <CalendarIcon className="w-4 h-4 mr-2" /> List View
          </Button>
          <Button variant="outline" className="bg-blue-900/20 text-blue-300 border border-blue-500/20 hover:bg-blue-800/30 transition-all">
            <CalendarIcon className="w-4 h-4 mr-2" /> Calendar View
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition-all shadow-[0_0_25px_rgba(0,255,255,0.4)] text-white">
            <Plus className="w-4 h-4 mr-2" /> Schedule Follow-Up
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Card key={s.title} className="p-6 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/60 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.25)] transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-gray-400">{s.title}</p>
                {s.subtitle && <p className="text-xs text-gray-500">{s.subtitle}</p>}
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/30">
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-white">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 py-4 px-4 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-[#0f172a]/70 to-[#1e293b]/40 border border-cyan-400/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input placeholder="Search leads or companies..." className="pl-10 bg-transparent border border-cyan-400/20 text-white placeholder:text-gray-500 focus:border-cyan-400" />
        </div>
        <Select>
          <SelectTrigger className="w-48 bg-transparent border border-cyan-400/20 text-gray-300">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f172a] border border-cyan-400/20 text-gray-300">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Quick filters:</span>
        {quickFilters.map((filter) => (
          <Button key={filter.value} variant={filter.variant} size="sm" className={`${filter.variant === "destructive"
            ? "bg-red-900/40 text-red-400 hover:bg-red-900/60"
            : filter.variant === "ghost"
              ? "text-gray-400 hover:text-white"
              : "bg-yellow-900/40 text-yellow-300 hover:bg-yellow-900/60"} transition-all`}>
            {filter.label}
          </Button>
        ))}
      </div>

      {/* 🔥 Enhanced Follow-Up Activities Table */}
      <Card className="overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/90 via-[#1e293b]/70 to-[#0f172a]/60 border border-cyan-400/20 shadow-[0_0_40px_rgba(0,255,255,0.1)] hover:shadow-[0_0_50px_rgba(0,255,255,0.25)] transition-all duration-500">
        <div className="p-6 border-b border-cyan-400/10 bg-gradient-to-r from-cyan-400/10 to-transparent flex items-center justify-between">
          <h3 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" /> Follow-Up Activities
          </h3>
          <span className="text-sm text-gray-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-400/20">
            {activities.length} activities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-cyan-400/10 uppercase text-xs tracking-wide">
                {["Lead", "Type", "Priority", "Scheduled Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b border-cyan-400/10 hover:bg-cyan-500/5 hover:shadow-[0_0_25px_rgba(0,255,255,0.1)] transition-all duration-300">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-cyan-600/30 to-blue-600/20 border border-cyan-400/20 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                        <AvatarFallback className="text-white font-semibold">{a.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{a.name}</div>
                        <div className="text-xs text-gray-400">{a.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{a.type}</td>
                  <td className="p-4">
                    <Badge className={`${a.priority === "High"
                      ? "bg-red-600/20 text-red-400 border border-red-500/30"
                      : a.priority === "Medium"
                        ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                        : "bg-green-600/15 text-green-400 border border-green-500/30"} backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.15)]`}>
                      {a.priority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm">{a.scheduled}</div>
                    <div className="text-xs text-gray-500">{a.time}</div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${a.status === "Overdue"
                      ? "bg-red-900/40 text-red-400 border border-red-400/30"
                      : a.status === "Pending"
                        ? "bg-yellow-900/40 text-yellow-400 border border-yellow-400/30"
                        : "bg-green-900/40 text-green-400 border border-green-400/30"} backdrop-blur-sm`}>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-900/30" onClick={() => openModal("view", activityToLead(a))}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-900/20" onClick={() => handleCompleteActivity(a.id)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-900/30" onClick={() => openModal("edit", activityToLead(a))}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <FollowModels popup={popup} lead={selectedLead} closePopup={closePopup} onUpdateLead={handleUpdateLead} />
    </div>
  );
};

export default Page;
