"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function WithdrawalPage() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ✅ Fixed: Type-safe fetch for user ID
  useEffect(() => {
    async function fetchUserId() {
      if (!user?.email) return;

      try {
        const res = await fetch(
          `/api/user?email=${encodeURIComponent(user.email)}`
        );
        if (!res.ok) {
          console.error("❌ Failed to fetch user ID:", res.status);
          return;
        }

        // ✅ Define the response structure
        const data: { user?: { id: number } } = await res.json();

        if (data.user) setUserId(data.user.id);
      } catch (err) {
        console.error("❌ Error fetching user ID:", err);
      }
    }

    fetchUserId();
  }, [user]);

  const showAlert = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setAlert({ type, message });
  };

  async function handleWithdraw() {
    if (!amount || !address)
      return showAlert("warning", "⚠️ Please fill all fields.");
    if (!userId) return showAlert("error", "❌ User not found.");

    const payload = {
      userId,
      amount: parseFloat(amount),
      currency,
      address,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ Typed response
      const data: { success?: boolean; message?: string } = await res.json();

      if (res.ok && data.success) {
        showAlert("success", "✅ Withdrawal submitted successfully!");
        setTimeout(() => {
          window.location.href = "/withdrawalHistory";
        }, 2000);
      } else {
        showAlert("error", data.message || "❌ Failed to submit withdrawal.");
      }
    } catch (err) {
      console.error("⚠️ Network error:", err);
      showAlert("error", "⚠️ Network error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#0b1130] text-slate-200 relative">
        <div className="max-w-lg mx-auto w-full bg-[#162446]/60 p-6 sm:p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
            Withdraw Funds
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Amount (USD)
              </label>
              <input
                title="number"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Method
              </label>
              <select
                title="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="BTC">Bitcoin</option>
                <option value="USDT">Tether (ERC20)</option>
                <option value="ETH">Ethereum</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Wallet Address
              </label>
              <input
                title="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button
              disabled={loading || !userId}
              onClick={handleWithdraw}
              className={`w-full mt-2 py-2 rounded font-semibold transition ${
                loading || !userId
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading
                ? "Submitting..."
                : !userId
                  ? "Loading user..."
                  : "Submit Withdrawal"}
            </button>
          </div>
        </div>

        {/* ✅ Alert Popup */}
        {alert && (
          <div
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg border-l-4 animate-fade-in z-50 ${
              alert.type === "success"
                ? "bg-green-500/20 border-green-400 text-green-300"
                : alert.type === "error"
                  ? "bg-red-500/20 border-red-400 text-red-300"
                  : "bg-yellow-500/20 border-yellow-400 text-yellow-300"
            }`}
          >
            {alert.message}
          </div>
        )}
      </main>
    </div>
  );
}
