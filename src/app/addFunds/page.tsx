"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import type { AddFundsResponse } from "@/types/api";

const WALLETS = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1q0dly0gy6zvsqudx7cxh56auwjhg43wylt4xwya",
  },
  {
    name: "Tether (ERC20)",
    symbol: "USDT",
    address: "0x3e09cE4993814b438e220bE2bD04e5fd4C166179",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: "0x3e09cE4993814b438e220bE2bD04e5fd4C166179",
  },
  {
    name: "Ripple",
    symbol: "XRP",
    address: "rag4voiXTrLszwWVQDngtABMMBZTgBzWsM",
  },
  {
    name: "Solana",
    symbol: "SOL",
    address: "9fY3jXfbb4KQ6yzorKRqaKF2hzKz4jT4oFhfd4j3Kn78",
  },
  {
    name: "Tether (BEP20)",
    symbol: "USDT-BSC",
    address: "0x3e09cE4993814b438e220bE2bD04e5fd4C166179",
  },
];

export default function AddFundsPage() {
  const [selected, setSelected] = useState<any | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const showAlert = (msg: string, autoClose = true) => {
    setAlertMsg(msg);
    if (autoClose) setTimeout(() => setAlertMsg(null), 3000);
  };

  const confirm = async () => {
    if (!selected) return showAlert("⚠️ Choose a wallet");
    if (!amount || Number(amount) < 1000)
      return showAlert("⚠️ Minimum investment is $1000");
    if (Number(amount) > 5000)
      return showAlert("⚠️ Maximum investment is $5000");
    if (!user) return showAlert("⚠️ Please log in to continue");

    setLoading(true);
    try {
      const res = await fetch("/api/addFunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.email,
          amount: Number(amount),
          currency: selected.symbol,
          address: selected.address,
        }),
      });

      let data: AddFundsResponse | null = null;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) throw new Error(data?.message || "Request failed");

      showAlert("✅ Deposit request sent for approval.");
      setAmount("");
      setSelected(null);
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err: any) {
      console.error("AddFunds error:", err);
      showAlert(`❌ ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#0b1130] text-slate-200 relative">
        <h1 className="text-2xl font-semibold mb-6 text-center md:text-left">
          Add Fund
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {WALLETS.map((w) => (
            <div
              key={w.symbol}
              className="bg-[#162446] p-6 rounded-xl flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <div className="w-20 h-20 rounded bg-slate-800 mb-4 flex items-center justify-center text-lg">
                {w.symbol}
              </div>
              <h3 className="font-semibold mb-1 text-center">{w.name}</h3>
              <button
                onClick={() => setSelected(w)}
                className="mt-3 bg-green-500 hover:bg-green-400 px-4 py-2 rounded text-black font-semibold w-full sm:w-auto"
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 sm:px-0">
            <div className="bg-[#0f2a57] p-6 sm:p-8 rounded-xl w-full max-w-sm sm:max-w-md shadow-2xl">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-center sm:text-left">
                Send {selected.symbol}
              </h2>
              <p className="text-sm text-slate-300 mb-3">
                Send to this address:
              </p>
              <div className="bg-slate-800 p-3 rounded mb-4 break-all text-green-300 text-xs sm:text-sm">
                {selected.address}
              </div>

              <input
                type="number"
                placeholder="Enter USD amount (min $1000, max $5000)"
                value={amount === "" ? "" : Number(amount).toString()}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full p-2 rounded bg-slate-800 mb-3 text-white text-sm"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirm}
                  disabled={loading}
                  className="flex-1 bg-green-500 py-2 rounded hover:bg-green-400 disabled:opacity-60 text-sm font-semibold"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 bg-red-500 py-2 rounded hover:bg-red-400 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {alertMsg && (
          <div className="fixed bottom-6 right-6 bg-[#1b2b55] text-white px-6 py-3 rounded-lg shadow-lg border-l-4 border-green-400 animate-fade-in z-50 text-sm sm:text-base max-w-[90%] sm:max-w-sm">
            {alertMsg}
          </div>
        )}
      </main>
    </div>
  );
}
