"use client";
import React, { useEffect, useState } from "react";
import { Eye, Key } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Integrations() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [provider, setProvider] = useState("whatsapp-business-api");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: apiKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save API key.");
        return;
      }

      toast.success("API key saved successfully!");
      setApiKey("");
      setApiSecret("");
    } catch (error) {
      toast.error("Something went wrong while saving the API key.");
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await axios.get("/api/token");
        console.log("Fetched Tokens:", res.data);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      }
    };
    fetchTokens();
  }, []);

  return (
    <div className="min-h-screen text-white p-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Integrations
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your third-party integrations and API connections.
          </p>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="w-full ">
        <div
          className="
          group 
          relative 
          rounded-2xl 
          backdrop-blur-xl 
          bg-gradient-to-br from-[#0f172a]/90 via-[#1e293b]/60 to-[#0f172a]/70 
          border border-cyan-400/20 
          shadow-[0_0_20px_rgba(0,255,255,0.08)] 
          hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]
          hover:scale-[1.01]
          transition-all duration-500
          overflow-hidden
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/10 before:to-blue-500/10 before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100
        "
        >
          {/* Header Section */}
          <div className="flex items-center gap-3 border-b border-cyan-400/10 pb-4 mb-6 relative z-10 p-8 pt-6">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
              <Key className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">WhatsApp Integration</h2>
              <p className="text-sm text-gray-400">
                Connect your WhatsApp Business API to send campaigns
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="relative z-10 px-8 pb-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-sm font-semibold text-cyan-300">
                WhatsApp Business API
              </span>
              <span className="text-sm text-gray-400">
                Securely manage and authenticate your API access
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Key */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  API Key
                </label>
                <input
                  type="text"
                  name="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your WhatsApp API Key"
                  className="h-11 rounded-lg border border-cyan-400/20 bg-[#0f172a]/50 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/40 transition-all"
                  required
                />
              </div>

              {/* API Secret */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  API Secret (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    name="apiSecret"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="Enter your WhatsApp API Secret"
                    className="h-11 w-full rounded-lg border border-cyan-400/20 bg-[#0f172a]/50 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-cyan-400 hover:text-white transition"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Provider Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  Provider
                </label>
                <select
                  name="provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="h-11 rounded-lg border border-cyan-400/20 bg-[#0f172a]/50 text-sm text-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                >
                  <option value="whatsapp-business-api">
                    WhatsApp Business API
                  </option>
                  <option value="twilio">Twilio</option>
                  <option value="360dialog">360Dialog</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
