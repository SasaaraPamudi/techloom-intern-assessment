import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 border-b border-slate-700/60 backdrop-blur-md px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
            P
          </div>
          <span className="font-bold text-white tracking-wide text-lg">POS<span className="text-blue-400">System</span></span>
        </div>

        <nav className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 p-1.5 rounded-xl shadow-inner">
          <Link
            to="/products"
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive('/products')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Products
          </Link>

          <Link
            to="/pos"
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive('/pos')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Cash Register
          </Link>

          <Link
            to="/checkout"
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive('/checkout')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Checkout
          </Link>

          <Link
            to="/orders"
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive('/orders')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Order History
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-slate-300 font-medium">System Online</span>
        </div>

      </div>
    </header>
  );
}