"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/supabase/auth";

export default function Header() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CG</span>
            </div>
            <span className="text-xl font-bold text-white">CodeGarden</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              料金プラン
            </Link>
            {user && (
              <Link
                href="/projects"
                className="text-gray-300 hover:text-white transition-colors"
              >
                プロジェクト
              </Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-400"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/account"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  アカウント
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg transition-colors border border-gray-700"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-green-500/25"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}