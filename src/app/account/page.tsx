"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { updatePassword, signOut } from "@/lib/supabase/auth";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setLoading(false);
      return;
    }

    try {
      await updatePassword(newPassword);
      setSuccess("パスワードが更新されました");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "パスワード更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-green-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">アカウント設定</h1>

        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              プロフィール情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {user.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  登録日
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {new Date(user.created_at).toLocaleDateString("ja-JP")}
                </div>
              </div>
            </div>
          </div>

          {/* Password Update */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              パスワード変更
            </h2>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  新しいパスワード
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="8文字以上のパスワード"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  新しいパスワード確認
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="新しいパスワードを再入力"
                />
              </div>

              <Button type="submit" loading={loading}>
                パスワードを更新
              </Button>
            </form>
          </div>

          {/* Plan Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              プラン情報
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Free プラン</div>
                <div className="text-sm text-gray-600">1プロジェクト、ローカル保存のみ</div>
              </div>
              <Button variant="outline" onClick={() => router.push("/pricing")}>
                プランを変更
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white shadow rounded-lg p-6 border-red-200">
            <h2 className="text-lg font-medium text-red-900 mb-4">
              危険な操作
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">ログアウト</div>
                  <div className="text-sm text-gray-600">現在のセッションからログアウトします</div>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  ログアウト
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}