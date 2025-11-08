"use client";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserPlus,
  Users as UsersIcon,
  TrendingUp as ChartIcon,
  Calendar,
  Plus,
  Edit,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import axios from "axios";

const stats = [
  {
    title: "Total Revenue",
    value: "₹1,250.00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    subtitle: "Trending up this month",
  },
  {
    title: "New Leads",
    value: "1,234",
    change: "-20%",
    trend: "down",
    icon: UserPlus,
    subtitle: "Down 20% this period",
  },
  {
    title: "Active Employees",
    value: "45,678",
    change: "+12.5%",
    trend: "up",
    icon: UsersIcon,
    subtitle: "Strong user retention",
  },
  {
    title: "Conversion Rate",
    value: "4.5%",
    change: "+4.5%",
    trend: "up",
    icon: ChartIcon,
    subtitle: "Steady performance increase",
  },
];

const leads = [
  {
    name: "Sarah Johnson",
    company: "Tech Solutions Inc",
    amount: "₹2,500",
    status: "New",
    avatar: "SJ",
    color: "bg-cyan-500/30",
  },
  {
    name: "Michael Chen",
    company: "Digital Marketing Pro",
    amount: "₹1,800",
    status: "Contacted",
    avatar: "MC",
    color: "bg-cyan-500/30",
  },
  {
    name: "Emily Davis",
    company: "Creative Agency",
    amount: "₹3,200",
    status: "In-Progress",
    avatar: "ED",
    color: "bg-cyan-500/30",
  },
  {
    name: "David Wilson",
    company: "E-commerce Store",
    amount: "₹4,100",
    status: "Qualified",
    avatar: "DW",
    color: "bg-cyan-500/30",
  },
];

const campaigns = [
  {
    name: "Summer Sale Campaign",
    status: "Active",
    sent: 1250,
    delivered: 1180,
    opened: 890,
    replied: 156,
  },
  {
    name: "Product Launch",
    status: "Completed",
    sent: 980,
    delivered: 945,
    opened: 720,
    replied: 98,
  },
  {
    name: "Follow-up Sequence",
    status: "Active",
    sent: 2100,
    delivered: 2050,
    opened: 1560,
    replied: 234,
  },
];

const reminders = [
  {
    name: "Rajesh Kumar",
    company: "Digital Solutions",
    type: "Call",
    time: "2:00 PM Today",
    color: "bg-red-900",
  },
  {
    name: "Priya Sharma",
    company: "Tech Startup",
    type: "Email",
    time: "Tomorrow 10 AM",
    color: "bg-yellow-900",
  },
  {
    name: "Amit Singh",
    company: "E-commerce Co",
    type: "Meeting",
    time: "Friday 3 PM",
    color: "bg-red-900",
  },
  {
    name: "Neha Gupta",
    company: "Marketing Agency",
    type: "Follow-up",
    time: "Next Monday",
    color: "bg-green-900",
  },
];

export default function Dashboard() {
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("/api/leads");
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="p-8 space-y-8  min-h-screen text-white">
      {/* Header */}
      <div className=" pb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your insights, leads & campaigns all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-lg border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-all duration-500 hover:scale-[1.03]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-20 transition-opacity"></div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-400/20">
                <stat.icon className="w-6 h-6 text-cyan-300" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span
                className={`text-sm ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-gray-500">{stat.subtitle}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Leads & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads */}
        <Card className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/40 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-cyan-300">
              Leads To Follow-Up With
            </h2>
            <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>

          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.name}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Avatar className={`${lead.color}`}>
                    <AvatarFallback className="text-white font-semibold">
                      {lead.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{lead.name}</p>
                    <p className="text-sm text-gray-400">{lead.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-cyan-300">{lead.amount}</p>
                  <Badge
                    className={`${
                      lead.status === "New"
                        ? "bg-cyan-900 text-cyan-400"
                        : lead.status === "Contacted"
                        ? "bg-orange-900 text-orange-400"
                        : lead.status === "In-Progress"
                        ? "bg-yellow-900 text-yellow-400"
                        : "bg-green-900 text-green-400"
                    }`}
                  >
                    {lead.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reminders */}
        <Card className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/40 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-cyan-300">
              Upcoming Reminders
            </h2>
            <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {reminders.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center`}
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{r.name}</p>
                    <p className="text-sm text-gray-400">{r.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-cyan-500/20 text-cyan-300 mb-1">
                    {r.type}
                  </Badge>
                  <p className="text-xs text-gray-400">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Campaigns + Ad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/40 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-cyan-300">
              Campaign Performance
            </h2>
          </div>

          {campaigns.map((c) => (
            <div key={c.name} className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-white">{c.name}</p>
                <Badge
                  className={`${
                    c.status === "Active"
                      ? "bg-green-900 text-green-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {c.status}
                </Badge>
              </div>
              <div className="grid grid-cols-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-white">{c.sent}</p>
                  <p className="text-xs text-gray-400">Sent</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-cyan-300">
                    {c.delivered}
                  </p>
                  <p className="text-xs text-gray-400">Delivered</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-300">
                    {c.opened}
                  </p>
                  <p className="text-xs text-gray-400">Opened</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-300">
                    {c.replied}
                  </p>
                  <p className="text-xs text-gray-400">Replied</p>
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Ad */}
        <Card className="p-8 text-center rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/40 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400/20 to-pink-400/10 flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-yellow-300" />
          </div>
          <h3 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center justify-center gap-2">
            Upgrade to Pro <Edit className="w-4 h-4 text-pink-400" />
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Remove ads and unlock premium analytics features.
          </p>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition-all text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            Get Pro Version
          </Button>
        </Card>
      </div>
    </div>
  );
}
