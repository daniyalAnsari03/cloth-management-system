"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  Package,
  ShoppingCart,
  Store,
  HandCoins,
  Receipt,
  BarChart3,
  Tags,
  Menu,
  X as XIcon,
} from "lucide-react";
import { MasterReset } from "./MasterReset";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/production", label: "Production", icon: Shirt },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/payments", label: "Payments", icon: HandCoins },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/fabric-types", label: "Fabric Types", icon: Tags },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-40 flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-bg-sidebar text-white shadow-lg transition-all duration-250 hover:bg-white/5 active:scale-90 sm:left-4 sm:top-4 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Luxury backdrop */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-500 ease-out lg:hidden ${
          open
            ? "bg-black/70 backdrop-blur-md opacity-100 pointer-events-auto"
            : "bg-black/0 backdrop-blur-0 opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* Luxury sidebar panel */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-dvh w-72 flex-col bg-bg-sidebar text-white transition-all duration-500 will-change-transform ${
          open
            ? "translate-x-0 scale-x-100"
            : "-translate-x-full scale-x-95"
        } lg:translate-x-0 lg:scale-x-100 lg:w-64`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-5 sm:px-6 sm:py-6">
          <div>
            <h1 className="font-display text-lg tracking-wider text-gold-400 sm:text-xl">
              Banarsi Fabric
            </h1>
            <p className="mt-0.5 text-[10px] font-medium tracking-wider uppercase text-white/30 sm:text-[11px]">
              Management System
            </p>
          </div>
          <button
            onClick={close}
            className="icon-btn text-white/20 hover:text-white/60 lg:hidden"
            aria-label="Close menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4 sm:px-3 sm:py-5">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const staggerDelay = index * 60;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? "bg-gradient-to-r from-gold-500/12 to-transparent text-gold-400 border-l-2 border-gold-400 rounded-r-lg"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/90 hover:translate-x-1"
                } ${open ? "nav-mobile-enter" : ""}`}
                style={{ animationDelay: `${staggerDelay}ms` }}
              >
                <Icon className={`nav-icon h-5 w-5 shrink-0 transition-all duration-200 ${
                  isActive ? "text-gold-400" : "text-white/20 group-hover:text-white/60"
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 px-2 py-2 sm:px-3 sm:py-2">
          <MasterReset />
        </div>

        <div className="border-t border-white/5 px-4 py-3 sm:px-6 sm:py-4">
          <div className="gold-divider mb-3" />
          <p className="text-[10px] font-medium tracking-wider text-white/15 sm:text-[11px]">
            DH DaniYaal Developer
          </p>
        </div>
      </aside>
    </>
  );
}
