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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CG</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CodeGarden</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              料金プラン
            </Link>
            {user && (
              <Link
                href="/projects"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                プロジェクト
              </Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-green-500"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/account"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  アカウント
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
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