"use client";

import {
  Search,
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
  Trash,
  Users,
  UserPlus,
  CheckCircle,
  Flame,
} from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
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
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LeadsAddModal from "@/components/LeadsAddModal";
import LeadViewModal from "@/components/LeadViewModal";
import LeadsEditModal from "@/components/LeadEditModal";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  tag: string;
  value: string;
  created: string;
  avatar?: string;
}

const getSourceIcon = (source: string) => {
  const icons: { [key: string]: string } = {
    Facebook: "📘",
    Google: "🟢",
    Website: "🌐",
    Referral: "👥",
    Instagram: "📷",
  };
  return icons[source] || "•";
};

export default function LeadsPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [popup, setPopup] = useState<null | "add" | "view" | "edit" | "delete">(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const closePopup = () => setPopup(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : data.leads || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDeleteLead = async (leadId: string): Promise<void> => {
    try {
      toast.loading("Deleting lead...");
      const res = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
      const data = await res.json();
      toast.dismiss();

      if (!res.ok) {
        toast.error(`❌ Failed to delete: ${data.error || "Unknown error"}`);
        return;
      }

      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      toast.success("🗑️ Lead deleted successfully!");
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.dismiss();
      toast.error("Something went wrong while deleting the lead");
    }
  };

  const openModal = (action: "view" | "edit", lead: Lead) => {
    setSelectedLead(lead);
    setPopup(action);
  };

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const now = new Date();
    const week = new Date();
    week.setDate(now.getDate() - 7);
    const newThisWeek = leads.filter(
      (l) => new Date(l.created) >= week && new Date(l.created) <= now
    ).length;
    const hot = leads.filter((l) => l.tag.toLowerCase() === "hot").length;

    return [
      { title: "Total Leads", value: total, icon: Users, color: "cyan" },
      { title: "New This Week", value: newThisWeek, icon: UserPlus, color: "blue" },
      { title: "Converted", value: "—", icon: CheckCircle, color: "green" },
      { title: "Hot Leads", value: hot, icon: Flame, color: "orange" },
    ];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  // UI
  return (
    <div className="p-8 space-y-8 min-h-screen text-white">
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Lead Management
          </h2>
          <p className="text-gray-400">Manage and track your leads efficiently</p>
        </div>

        <div className="flex gap-2">
          {/* Facebook Button with "Coming Soon" hover */}
          <Button
            variant="outline"
            onMouseEnter={() => setHovered("facebook")}
            onMouseLeave={() => setHovered(null)}
            className="bg-blue-900/30 text-blue-400 border border-blue-500/20 hover:shadow-[0_0_15px_rgba(0,122,255,0.3)] transition-all"
          >
            <FaFacebook className="mr-2 text-[#0866ff]" />
            {hovered === "facebook" ? "Coming Soon" : "Import from Meta"}
          </Button>

          {/* Google Button with "Coming Soon" hover */}
          <Button
            variant="outline"
            onMouseEnter={() => setHovered("google")}
            onMouseLeave={() => setHovered(null)}
            className="bg-red-900/30 text-red-400 border border-red-500/20 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all"
          >
            <FaGoogle className="mr-2" />
            {hovered === "google" ? "Coming Soon" : "Import from Google"}
          </Button>

          {/* Upload CSV */}
          <Button
            onClick={() => router.push("/leadform")}
            className="bg-emerald-900/30 text-emerald-400 border border-emerald-400/20 hover:shadow-[0_0_15px_rgba(0,255,150,0.3)] transition-all"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload CSV
          </Button>

          {/* Add Lead */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition-all text-white shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card
            key={s.title}
            className="p-6 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-400/20 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:scale-[1.03] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">{s.title}</p>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg bg-${s.color}-500/20`}
              >
                <s.icon className={`w-6 h-6 text-${s.color}-400`} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-white">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 py-5 px-4 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/40 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-transparent border border-cyan-400/20 text-white placeholder:text-gray-500 focus:border-cyan-400"
          />
        </div>

        <Select onValueChange={setSelectedTag}>
          <SelectTrigger className="w-48 bg-transparent border border-cyan-400/20 text-gray-300">
            <SelectValue placeholder="Filter by Tag" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f172a] text-gray-300 border border-cyan-400/20">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="cold">Cold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/40 border border-cyan-400/20 shadow-[0_0_25px_rgba(0,255,255,0.1)]">
        <div className="flex items-center justify-between border-b border-cyan-400/10 pb-4 mb-4">
          <h3 className="text-xl font-semibold text-cyan-300">
            Leads ({filteredLeads.length})
          </h3>
          <Button variant="outline" className="border-cyan-400/30 text-cyan-300">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-6">Loading leads...</p>
        ) : error ? (
          <p className="text-red-400 text-center py-6">{error}</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-cyan-400/10">
                  {[
                    "Lead",
                    "Contact",
                    "Source",
                    "Stage",
                    "Tag",
                    "Value",
                    "Created",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-sm font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-cyan-400/10 hover:bg-white/5 transition-all"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-cyan-500/30">
                        <AvatarFallback className="text-white font-semibold">
                          {lead.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{lead.name}</p>
                        <p className="text-sm text-gray-400">{lead.company}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{lead.email}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </td>
                    <td className="p-4 flex items-center gap-2 text-sm">
                      {getSourceIcon(lead.source)} {lead.source}
                    </td>
                    <td className="p-4">
                      <Badge className="bg-cyan-900/30 text-cyan-300 border border-cyan-400/20">
                        {lead.stage}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={`${
                          lead.tag === "HOT"
                            ? "bg-red-900/30 text-red-400 border border-red-500/30"
                            : lead.tag === "WARM"
                            ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                            : "bg-blue-900/30 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {lead.tag}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold text-cyan-300">
                      {lead.value}
                    </td>
                    <td className="p-4 text-sm text-gray-400">{lead.created}</td>
                    <td className="p-4 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-300 hover:bg-cyan-500/10"
                        onClick={() => openModal("view", lead)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-300 hover:bg-yellow-500/10"
                        onClick={() => openModal("edit", lead)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showAddModal && (
        <LeadsAddModal
          onClose={() => setShowAddModal(false)}
          onLeadAdded={fetchLeads}
        />
      )}

      {popup === "view" && selectedLead && (
        <LeadViewModal lead={selectedLead} closePopup={closePopup} />
      )}
      {popup === "edit" && selectedLead && (
        <LeadsEditModal
          leadId={selectedLead.id}
          onClose={closePopup}
          onLeadUpdated={fetchLeads}
        />
      )}
    </div>
  );
}
