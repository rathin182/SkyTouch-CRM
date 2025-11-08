"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  Crown,
  Shield,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Eye,
  SquarePen,
  Plus,
} from "lucide-react";
import EditEmployee from "@/components/EmployeeEdit";
import EmployeeView from "@/components/EmployeeView";
import CreateUser from "@/components/CreateUser";

export interface BackendUser {
  id: string;
  email?: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export default function Employees() {
  const router = useRouter();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState("User Role");
  const [roleOpen, setRoleOpen] = useState(false);
  const [popup, setPopup] = useState<null | "view" | "edit">(null);
  const [selectedUser, setSelectedUser] = useState<BackendUser | null>(null);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  // Fetch Users
  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/auth/user", { method: "GET", credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else if (data?.users) setUsers(data.users);
        else setUsers([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const closepop = () => setPopup(null);
  const openModal = (action: "view" | "edit", user: BackendUser) => {
    setSelectedUser(user);
    setPopup(action);
  };

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const counts = users.reduce(
      (a, u) => {
        const role = u.role.toUpperCase();
        if (role.includes("ADMIN")) a.admins++;
        else if (role.includes("EMPLOYEE")) a.employees++;
        else a.customers++;
        return a;
      },
      { admins: 0, employees: 0, customers: 0 }
    );

    return [
      {
        value: total,
        title: "Total Users",
        icon: <Users className="w-6 h-6 text-cyan-300" />,
        color: "from-cyan-500/20 to-blue-500/10",
      },
      {
        value: counts.customers,
        title: "Customers",
        icon: <UserCheck className="w-6 h-6 text-green-300" />,
        color: "from-green-500/20 to-emerald-500/10",
      },
      {
        value: counts.employees,
        title: "Employees",
        icon: <Crown className="w-6 h-6 text-yellow-300" />,
        color: "from-yellow-500/20 to-orange-500/10",
      },
      {
        value: counts.admins,
        title: "Admins",
        icon: <Shield className="w-6 h-6 text-red-300" />,
        color: "from-red-500/20 to-pink-500/10",
      },
    ];
  }, [users]);

  // Filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
    );
    if (selectedRole !== "User Role") {
      list = list.filter((u) => {
        const r = u.role.toLowerCase();
        if (selectedRole === "Admin") return r.includes("admin");
        if (selectedRole === "Employee") return r.includes("employee");
        if (selectedRole === "Other")
          return !r.includes("admin") && !r.includes("employee");
        return true;
      });
    }
    return list;
  }, [users, search, selectedRole]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // 🧠 Local gradient avatar generator
  const Avatar = ({ name }: { name: string }) => {
    const initials = name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
    const bg = [
      "from-cyan-500 to-blue-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
    ][(name.charCodeAt(0) + name.length) % 4];
    return (
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold text-sm bg-gradient-to-br ${bg} border border-cyan-400/20 shadow-[0_0_10px_rgba(0,255,255,0.2)]`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen  text-white p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="text-gray-400 mt-1">Manage users, roles, and access</p>
        </div>
        <button
          onClick={() => setOpenCreateUser(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-lg font-medium shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
        <CreateUser open={openCreateUser} close={() => setOpenCreateUser(false)} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl backdrop-blur-lg bg-gradient-to-br ${s.color} border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-gray-400">{s.title}</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 backdrop-blur-lg bg-gradient-to-br from-[#0f172a]/70 to-[#1e293b]/40 border border-cyan-400/20 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.1)]">
        <input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-transparent border border-cyan-400/30 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
        />
        <div className="relative">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="px-4 py-2 flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-[#0f172a]/60 text-gray-300 hover:bg-cyan-500/10"
          >
            {selectedRole}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                roleOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {roleOpen && (
            <div className="absolute z-50 mt-2 w-40 bg-[#0f172a] border border-cyan-400/20 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.15)]">
              {["Admin", "Employee", "Other"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRole(r);
                    setRoleOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-cyan-500/10"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/70 border border-cyan-400/20 shadow-[0_0_30px_rgba(0,255,255,0.1)] p-6 overflow-x-auto transition-all">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading users...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="text-gray-400 border-b border-cyan-400/10">
              <tr className="uppercase text-xs tracking-wider">
                <th className="p-4 text-left">Avatar</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-cyan-400/10 hover:bg-cyan-500/5 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all"
                >
                  <td className="p-4">
                    <Avatar name={u.name} />
                  </td>
                  <td className="p-4 font-medium text-white">{u.name}</td>
                  <td className="p-4 text-gray-400">{u.email ?? "—"}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-lg border border-cyan-400/20 text-cyan-300 bg-cyan-900/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(u.createdAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openModal("view", u)}
                        className="text-cyan-300 hover:text-cyan-100 hover:scale-110 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("edit", u)}
                        className="text-yellow-300 hover:text-yellow-100 hover:scale-110 transition-all"
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 py-4 backdrop-blur-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.15)]">
        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className="p-2 rounded-md border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="p-2 rounded-md border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-1 rounded-lg border border-cyan-400/20 text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="p-2 rounded-md border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
          className="p-2 rounded-md border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modals */}
      {popup === "edit" && selectedUser && (
        <EditEmployee
          user={selectedUser}
          open={popup === "edit"}
          close={closepop}
          onUpdated={fetchUsers}
        />
      )}
      {popup === "view" && selectedUser && (
        <EmployeeView user={selectedUser} close={closepop} />
      )}
    </div>
  );
}
