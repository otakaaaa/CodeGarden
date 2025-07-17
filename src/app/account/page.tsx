"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { updatePassword, signOut } from "@/lib/supabase/auth";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import { Text, Input } from "@/components/ui";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  
  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  
  // Account deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
    if (user) {
      // Initialize profile data
      setDisplayName(user.user_metadata?.display_name || "");
      setBio(user.user_metadata?.bio || "");
    }
  }, [user, authLoading, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // TODO: Implement profile update with Supabase
      // await updateProfile({ display_name: displayName, bio });
      setSuccess("プロフィールが更新されました");
      setIsEditingProfile(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "プロフィール更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

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

  const handleAccountDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      setError("確認のため「DELETE」と入力してください");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement account deletion
      // await deleteAccount();
      alert("アカウント削除機能は近日実装予定です");
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "アカウント削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "プロフィール", icon: "👤" },
    { id: "security", label: "セキュリティ", icon: "🔒" },
    { id: "subscription", label: "プラン", icon: "💳" },
    { id: "usage", label: "使用状況", icon: "📊" },
    { id: "danger", label: "危険な操作", icon: "⚠️" },
  ];

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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Text variant="subtitle">基本情報</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? "キャンセル" : "編集"}
                </Button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <Input
                    label="表示名"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="表示名を入力"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      自己紹介
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="自己紹介を入力"
                    />
                  </div>
                  <Button type="submit" loading={loading}>
                    更新
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Text variant="caption" weight="semibold" color="muted">
                      メールアドレス
                    </Text>
                    <Text variant="body">{user.email}</Text>
                  </div>
                  <div>
                    <Text variant="caption" weight="semibold" color="muted">
                      表示名
                    </Text>
                    <Text variant="body">{displayName || "未設定"}</Text>
                  </div>
                  <div>
                    <Text variant="caption" weight="semibold" color="muted">
                      自己紹介
                    </Text>
                    <Text variant="body">{bio || "未設定"}</Text>
                  </div>
                  <div>
                    <Text variant="caption" weight="semibold" color="muted">
                      登録日
                    </Text>
                    <Text variant="body">
                      {new Date(user.created_at).toLocaleDateString("ja-JP")}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            {/* Password Change */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <Text variant="subtitle" className="mb-4">パスワード変更</Text>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <Input
                  type="password"
                  label="新しいパスワード"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8文字以上のパスワード"
                  required
                />
                <Input
                  type="password"
                  label="新しいパスワード確認"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="新しいパスワードを再入力"
                  required
                />
                <Button type="submit" loading={loading}>
                  パスワードを更新
                </Button>
              </form>
            </div>

            {/* Security Settings */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <Text variant="subtitle" className="mb-4">セキュリティ設定</Text>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Text variant="body" weight="medium">二段階認証</Text>
                    <Text variant="caption" color="muted">アカウントのセキュリティを強化</Text>
                  </div>
                  <Button variant="outline" size="sm">
                    設定（近日公開）
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Text variant="body" weight="medium">ログイン通知</Text>
                    <Text variant="caption" color="muted">新しいデバイスからのログイン時に通知</Text>
                  </div>
                  <Button variant="outline" size="sm">
                    設定（近日公開）
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "subscription":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <Text variant="subtitle" className="mb-4">現在のプラン</Text>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <Text variant="body" weight="semibold" color="success">Free プラン</Text>
                  <Text variant="caption" color="muted">1プロジェクト、ローカル保存のみ</Text>
                </div>
                <Button variant="primary" onClick={() => router.push("/pricing")}>
                  プランを変更
                </Button>
              </div>

              <div className="mt-6">
                <Text variant="body" weight="medium" className="mb-3">プランの特典</Text>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text variant="caption">1プロジェクト作成</Text>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text variant="caption">基本UIパーツ</Text>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text variant="caption">チュートリアル機能</Text>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "usage":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <Text variant="subtitle" className="mb-4">使用状況</Text>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Text variant="caption" color="muted">プロジェクト数</Text>
                  <Text variant="title">0 / 1</Text>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <Text variant="caption" color="muted">今月のアクティブ日数</Text>
                  <Text variant="title">0日</Text>
                  <Text variant="caption" color="muted">最後のログイン: 今日</Text>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Text variant="caption" color="muted">作成したコンポーネント</Text>
                  <Text variant="title">0個</Text>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <Text variant="caption" color="muted">学習時間</Text>
                  <Text variant="title">0時間</Text>
                </div>
              </div>
            </div>
          </div>
        );

      case "danger":
        return (
          <div className="space-y-6">
            {/* Logout */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-red-200">
              <Text variant="subtitle" className="mb-4" color="danger">ログアウト</Text>
              
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="body">現在のセッションからログアウトします</Text>
                  <Text variant="caption" color="muted">保存されていないデータは失われます</Text>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  ログアウト
                </Button>
              </div>
            </div>

            {/* Account Deletion */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-red-200">
              <Text variant="subtitle" className="mb-4" color="danger">アカウント削除</Text>
              
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <Text variant="body">アカウントとすべてのデータを完全に削除します</Text>
                    <Text variant="caption" color="muted">この操作は取り消すことができません</Text>
                  </div>
                  <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                    アカウントを削除
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <Text variant="body" weight="semibold" color="danger">注意！</Text>
                    <Text variant="caption">
                      この操作によりアカウント、プロジェクト、すべてのデータが完全に削除されます。
                      削除を実行するには下記に「DELETE」と入力してください。
                    </Text>
                  </div>
                  
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE と入力"
                  />
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="danger"
                      onClick={handleAccountDelete}
                      loading={loading}
                      disabled={deleteConfirmText !== "DELETE"}
                    >
                      完全に削除する
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText("");
                      }}
                    >
                      キャンセル
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Text variant="heading" className="mb-2">アカウント設定</Text>
          <Text variant="body" color="muted">
            プロフィール、セキュリティ、プランの管理ができます
          </Text>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    <Text variant="body" weight={activeTab === tab.id ? "medium" : "normal"}>
                      {tab.label}
                    </Text>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}