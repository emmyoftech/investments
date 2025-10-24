'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/context/AuthContext';
import { useWithdrawals } from '@/lib/hooks/useWithdrawals';

interface Withdrawal {
  id: number;
  amount: number;
  address: string;
  currency: string;
  status: string;
  createdAt: string;
}

export default function WithdrawalHistory() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const { withdrawals, isLoading, isError, mutate } = useWithdrawals(userId);

  // ✅ Step 1: Fetch user ID using email (like in your withdrawal page)
  useEffect(() => {
    async function fetchUserId() {
      if (!user?.email) return;

      try {
        const res = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
        const data: { user?: { id: number } } = await res.json();

        if (res.ok && data.user) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error('❌ Failed to fetch user ID:', err);
      }
    }

    fetchUserId();
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#0b1130] text-slate-200">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center md:text-left">
            Withdrawal History
          </h1>

          {isLoading ? (
            <p className="text-slate-400 text-center">Loading...</p>
          ) : isError ? (
            <div className="text-center space-y-4">
              <p className="text-red-400">⚠️ Failed to load withdrawal history</p>
              <button
                onClick={() => mutate()}
                className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500 transition"
              >
                Retry
              </button>
            </div>
          ) : withdrawals.length === 0 ? (
            <p className="text-slate-400 text-center">No withdrawals yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg bg-slate-800/40">
              <table className="w-full text-sm sm:text-base border border-slate-700">
                <thead className="bg-slate-800/80">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Currency</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-right">Amount (USD)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr
                      key={w.id}
                      className="border-t border-slate-700 hover:bg-slate-700/30 transition"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(w.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{w.currency}</td>
                      <td className="px-4 py-2 break-all max-w-[160px] sm:max-w-none">
                        {w.address}
                      </td>
                      <td className="px-4 py-2 text-right">${w.amount.toFixed(2)}</td>
                      <td
                        className={`px-4 py-2 text-center font-semibold ${
                          w.status === 'Completed'
                            ? 'text-green-400'
                            : w.status === 'Rejected'
                              ? 'text-red-400'
                              : 'text-yellow-400'
                        }`}
                      >
                        {w.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
