"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import {
  FaWallet,
  FaHistory,
  FaPlusCircle,
  FaMoneyBillWave,
  FaListAlt,
  FaPaperPlane,
  FaUserFriends,
  FaCopy,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// ✅ Define a clear type for balances
interface Balances {
  mainBalance: number;
  interestBalance: number;
  totalDeposit: number;
  totalEarn: number;
  roiCompleted: number;
  roiSpeed: number;
  roiRedeemed: number;
  rewardPoints: number;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [balances, setBalances] = useState<Balances>({
    mainBalance: 0,
    interestBalance: 0,
    totalDeposit: 0,
    totalEarn: 0,
    roiCompleted: 0,
    roiSpeed: 0,
    roiRedeemed: 0,
    rewardPoints: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Fetch balances from API with type safety
  useEffect(() => {
    let mounted = true;

    async function fetchBal() {
      if (!user) return;
      try {
        const res = await fetch(
          `/api/dashboard?user=${encodeURIComponent(user.email)}`
        );

        // ✅ Type the JSON properly
        const json: Balances = await res.json();

        if (mounted) setBalances(json);
      } catch (e) {
        console.error("Failed to fetch balances:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBal();
    const t = setInterval(fetchBal, 5000);

    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [user]);

  // ✅ Prevent background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  // ✅ Helper format function
  const formatMoney = (val: any) =>
    typeof val === "number" && !isNaN(val) ? val.toFixed(2) : "0.00";

  // ✅ Referral link and copy handler
  const referralLink = user
    ? `https://yourapp.com/signup?ref=${encodeURIComponent(user.email)}`
    : "";

  const copyReferralLink = async () => {
    if (referralLink) {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ Sidebar links
  const balanceFields = [
    { label: "Main Balance", key: "mainBalance" },
    { label: "Interest Balance", key: "interestBalance" },
    { label: "Total Deposit", key: "totalDeposit" },
    { label: "Total Earn", key: "totalEarn" },
  ];

  const navItems = [
    { icon: <FaWallet />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaPlusCircle />, label: "Add Fund", path: "/addFunds" },
    { icon: <FaHistory />, label: "Deposit History", path: "/depositHistory" },
    { icon: <FaUserFriends />, label: "Referral", path: "referral" },
  ];

  const otherLinks = [
    {
      icon: <FaMoneyBillWave />,
      label: "Investment Plans",
      path: "/investmentPlans",
    },
    { icon: <FaListAlt />, label: "Transaction", path: "/transaction" },
    { icon: <FaPaperPlane />, label: "Withdrawal", path: "/withdrawal" },
    {
      icon: <FaPaperPlane />,
      label: "Withdrawal History",
      path: "/withdrawalHistory",
    },
  ];

  return (
    <>
      {/* ✅ Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          title="Open sidebar"
          onClick={() => setMobileOpen(true)}
          className="text-white bg-[#0f1a36] p-2 rounded-lg shadow-lg hover:bg-[#14244d] transition"
        >
          <FaBars size={22} />
        </button>
      </div>

      {/* ✅ Sidebar (desktop + mobile) */}
      <aside
        className={`fixed md:static top-0  left-0 z-40 h-[150vh]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300
          ${collapsed ? "w-20" : "w-72"}
          bg-[#0f1a36] text-slate-200 flex flex-col justify-between
          shadow-2xl border-r border-slate-800 overflow-y-auto`}
      >
        {/* Mobile close button */}
        <div className="flex justify-between items-center mb-4 mt-5 md:hidden">
          <button
            title="close"
            onClick={() => setMobileOpen(false)}
            className="text-white hover:text-red-400"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div>
          {/* Collapse toggle (desktop) */}
          <div className="hidden md:flex justify-end mb-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-400 hover:text-white"
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {/* ✅ Account Balances */}
          <div className="mb-8 border rounded-lg p-4 bg-[#0f2a57]">
            {!collapsed && (
              <>
                <h4 className="text-sm text-slate-300">
                  Account Balance{" "}
                  <span className="ml-2 text-xs px-2 py-1 bg-yellow-400 text-black rounded">
                    USD
                  </span>
                </h4>

                {loading ? (
                  <p className="text-sm text-slate-400 mt-3">
                    Loading balances...
                  </p>
                ) : (
                  balanceFields.map(({ label, key }) => (
                    <div key={key} className="mt-3">
                      <p className="text-xs text-slate-300">{label}</p>
                      <p className="text-lg font-semibold mt-1">
                        ${formatMoney(balances[key as keyof Balances])}
                      </p>
                    </div>
                  ))
                )}

                {/* Quick actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => router.push("/addFunds")}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => router.push("/investmentPlans")}
                    className="flex-1 bg-slate-700 text-white py-2 rounded hover:bg-slate-600"
                  >
                    Invest
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ✅ Navigation Links */}
          <nav className="space-y-4">
            {navItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.path === "referral") {
                    setShowReferralModal(true);
                  } else {
                    router.push(item.path);
                    setMobileOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  pathname === item.path
                    ? "bg-green-600 text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>
            ))}

            {!collapsed && (
              <div className="border-t border-slate-700 my-4"></div>
            )}

            {otherLinks.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  router.push(item.path);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  pathname === item.path
                    ? "bg-green-600 text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>
            ))}
          </nav>
        </div>

        {/* ✅ Logout Button */}
        <div
          onClick={() => {
            logout();
            setMobileOpen(false);
          }}
          className="flex items-center gap-3 px-3 py-2 mt-6 cursor-pointer text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </div>
      </aside>

      {/* ✅ Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
        ></div>
      )}

      {/* ✅ Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#0f1a36] p-6 rounded-lg w-96 text-white relative shadow-2xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-3">Referral Program</h2>
            <p className="text-sm text-slate-400 mb-4">
              Invite friends and earn rewards! Copy your referral link below and
              share it with others.
            </p>

            <div className="bg-[#0f2a57] px-3 py-2 rounded flex justify-between items-center mb-4">
              <span className="truncate text-xs">{referralLink}</span>
              <button
                title="Copy referral link"
                onClick={copyReferralLink}
                className="text-green-400 hover:text-green-300 ml-2"
              >
                <FaCopy />
              </button>
            </div>

            {copied && (
              <p className="text-green-400 text-xs mb-3 animate-pulse">
                ✅ Referral link copied!
              </p>
            )}

            <button
              onClick={() => setShowReferralModal(false)}
              className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
