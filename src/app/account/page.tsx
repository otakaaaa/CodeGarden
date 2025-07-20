"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { updatePassword, signOut } from "@/lib/supabase/auth";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import { Text } from "@/components/ui";
import { 
  createCustomer, 
  getCustomerSubscriptions, 
  cancelSubscription, 
  reactivateSubscription,
  createCustomerPortalSession 
} from "@/lib/stripe/client";
import { getPlanByPriceId } from "@/lib/stripe/config";
import { supabase } from "@/lib/supabase";

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
  
  // Subscription management
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

interface Subscription {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      price: {
        id: string;
      };
    }>;
  };
  created: number;
}


  const initializeStripeData = useCallback(async () => {
    if (!user) return;
    
    try {
      // First, check if user has subscription in local database
      const { data: localSubscription, error: dbError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (dbError && dbError.code !== "PGRST116") { // PGRST116 = not found
        console.error("Error fetching local subscription:", dbError);
      }

      if (localSubscription && localSubscription.stripe_customer_id) {
        setCustomerId(localSubscription.stripe_customer_id);
        
        // If subscription exists in DB and is active, use Stripe API for latest data
        if (localSubscription.status === "active" || localSubscription.status === "trialing") {
          const subscriptionsResponse = await getCustomerSubscriptions(localSubscription.stripe_customer_id);
          setSubscriptions(subscriptionsResponse.subscriptions || []);
        } else {
          // Use local data for inactive subscriptions
          setSubscriptions([]);
        }
      } else {
        // Create or get customer if not in local DB
        const customerResponse = await createCustomer(
          user.email!,
          user.user_metadata?.display_name || user.email!,
          user.id
        );
        setCustomerId(customerResponse.customerId);
        
        // Get subscriptions from Stripe
        const subscriptionsResponse = await getCustomerSubscriptions(customerResponse.customerId);
        setSubscriptions(subscriptionsResponse.subscriptions || []);
      }
    } catch (error) {
      console.error("Failed to initialize Stripe data:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
    if (user) {
      // Initialize profile data
      setDisplayName(user.user_metadata?.display_name || "");
      setBio(user.user_metadata?.bio || "");
      
      // Initialize Stripe customer and subscriptions
      initializeStripeData();
    }
  }, [user, authLoading, router, initializeStripeData]);

  // Function to get subscription info from local DB
  // const getLocalSubscriptionInfo = async (): Promise<UserSubscription | null> => {
  //   if (!user) return null;
  //   
  //   const { data, error } = await supabase
  //     .from("user_subscriptions")
  //     .select("*")
  //     .eq("user_id", user.id)
  //     .single();

  //   if (error) {
  //     console.error("Error fetching subscription:", error);
  //     return null;
  //   }

  //   return data;
  // };

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

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!window.confirm("サブスクリプションをキャンセルしますか？現在の期間終了時に終了されます。")) {
      return;
    }

    setSubscriptionLoading(true);
    try {
      await cancelSubscription(subscriptionId);
      setSuccess("サブスクリプションがキャンセルされました。現在の期間終了時に終了されます。");
      await initializeStripeData(); // Refresh subscription data
    } catch {
      setError("サブスクリプションのキャンセルに失敗しました。");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleReactivateSubscription = async (subscriptionId: string) => {
    setSubscriptionLoading(true);
    try {
      await reactivateSubscription(subscriptionId);
      setSuccess("サブスクリプションが再開されました。");
      await initializeStripeData(); // Refresh subscription data
    } catch {
      setError("サブスクリプションの再開に失敗しました。");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleCustomerPortal = async () => {
    if (!customerId) return;

    setSubscriptionLoading(true);
    try {
      const { url } = await createCustomerPortalSession(customerId);
      window.location.href = url;
    } catch {
      setError("カスタマーポータルの起動に失敗しました。");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const getCurrentSubscription = () => {
    return subscriptions.find(sub => sub.status === "active" || sub.status === "trialing");
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
        <div className="min-h-screen bg-black">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-700 border-t-green-500"></div>
          </div>
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
            <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <Text variant="subtitle" className="text-white">基本情報</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  {isEditingProfile ? "キャンセル" : "編集"}
                </Button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      表示名
                    </label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="表示名を入力"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      自己紹介
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-500"
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
                    <Text variant="caption" weight="semibold" className="text-gray-400">
                      メールアドレス
                    </Text>
                    <Text variant="body" className="text-white">{user.email}</Text>
                  </div>
                  <div>
                    <Text variant="caption" weight="semibold" className="text-gray-400">
                      表示名
                    </Text>
                    <Text variant="body" className="text-white">{displayName || "未設定"}</Text>
                  </div>
                  <div>
                    <Text variant="caption" weight="semibold" className="text-gray-400">
                      自己紹介
                    </Text>
                    <Text variant="body" className="text-white">{bio || "未設定"}</Text>
                  </div>
                  <div>
                    <Text variant="caption" weight="semibold" className="text-gray-400">
                      登録日
                    </Text>
                    <Text variant="body" className="text-white">
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
            <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-gray-800">
              <Text variant="subtitle" className="mb-4 text-white">パスワード変更</Text>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    新しいパスワード
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8文字以上のパスワード"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    新しいパスワード確認
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="新しいパスワードを再入力"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-500"
                  />
                </div>
                <Button type="submit" loading={loading}>
                  パスワードを更新
                </Button>
              </form>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-gray-800">
              <Text variant="subtitle" className="mb-4 text-white">セキュリティ設定</Text>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <Text variant="body" weight="medium" className="text-white">二段階認証</Text>
                    <Text variant="caption" className="text-gray-400">アカウントのセキュリティを強化</Text>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700">
                    設定（近日公開）
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <Text variant="body" weight="medium" className="text-white">ログイン通知</Text>
                    <Text variant="caption" className="text-gray-400">新しいデバイスからのログイン時に通知</Text>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700">
                    設定（近日公開）
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "subscription":
        const currentSubscription = getCurrentSubscription();
        const plan = currentSubscription ? getPlanByPriceId(currentSubscription.items.data[0]?.price.id) : null;

        return (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <Text variant="subtitle" className="text-white">現在のプラン</Text>
                {customerId && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCustomerPortal}
                    loading={subscriptionLoading}
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    請求情報を管理
                  </Button>
                )}
              </div>
              
              {currentSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg border border-blue-800">
                    <div>
                      <Text variant="body" weight="semibold" className="text-blue-400">
                        {plan?.name || "Pro"} プラン
                      </Text>
                      <Text variant="caption" className="text-gray-400">
                        ステータス: {currentSubscription.status === "active" ? "有効" : 
                                   currentSubscription.status === "trialing" ? "トライアル中" : 
                                   currentSubscription.cancel_at_period_end ? "キャンセル済み" : "不明"}
                      </Text>
                      <Text variant="caption" className="text-gray-400">
                        次回更新: {new Date(currentSubscription.current_period_end * 1000).toLocaleDateString("ja-JP")}
                      </Text>
                    </div>
                    <div className="flex space-x-2">
                      {currentSubscription.cancel_at_period_end ? (
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleReactivateSubscription(currentSubscription.id)}
                          loading={subscriptionLoading}
                        >
                          再開
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelSubscription(currentSubscription.id)}
                          loading={subscriptionLoading}
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          キャンセル
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => router.push("/pricing")} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        プラン変更
                      </Button>
                    </div>
                  </div>

                  {plan && (
                    <div className="mt-6">
                      <Text variant="body" weight="medium" className="mb-3 text-white">プランの特典</Text>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            <Text variant="caption" className="text-gray-300">{feature}</Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-800">
                  <div>
                    <Text variant="body" weight="semibold" className="text-green-400">Free プラン</Text>
                    <Text variant="caption" className="text-gray-400">1プロジェクト、ローカル保存のみ</Text>
                  </div>
                  <Button variant="primary" onClick={() => router.push("/pricing")}>
                    プランをアップグレード
                  </Button>
                </div>
              )}
            </div>

            {/* Subscription History */}
            {subscriptions.length > 0 && (
              <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-gray-800">
                <Text variant="subtitle" className="mb-4 text-white">サブスクリプション履歴</Text>
                <div className="space-y-3">
                  {subscriptions.map((subscription, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <Text variant="body" weight="medium" className="text-white">
                          {getPlanByPriceId(subscription.items.data[0]?.price.id)?.name || "Unknown Plan"}
                        </Text>
                        <Text variant="caption" className="text-gray-400">
                          {subscription.status === "active" ? "有効" : 
                           subscription.status === "canceled" ? "キャンセル済み" : 
                           subscription.status}
                        </Text>
                      </div>
                      <Text variant="caption" className="text-gray-400">
                        {new Date(subscription.created * 1000).toLocaleDateString("ja-JP")}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "usage":
        return (
          <div className="space-y-6">
            <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-gray-800">
              <Text variant="subtitle" className="mb-4 text-white">使用状況</Text>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
                  <Text variant="caption" className="text-gray-400">プロジェクト数</Text>
                  <Text variant="title" className="text-white">0 / 1</Text>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
                
                <div className="bg-green-900/20 p-4 rounded-lg border border-green-800">
                  <Text variant="caption" className="text-gray-400">今月のアクティブ日数</Text>
                  <Text variant="title" className="text-white">0日</Text>
                  <Text variant="caption" className="text-gray-400">最後のログイン: 今日</Text>
                </div>
                
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800">
                  <Text variant="caption" className="text-gray-400">作成したコンポーネント</Text>
                  <Text variant="title" className="text-white">0個</Text>
                </div>
                
                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800">
                  <Text variant="caption" className="text-gray-400">学習時間</Text>
                  <Text variant="title" className="text-white">0時間</Text>
                </div>
              </div>
            </div>
          </div>
        );

      case "danger":
        return (
          <div className="space-y-6">
            {/* Logout */}
            <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-red-800">
              <Text variant="subtitle" className="mb-4 text-red-400">ログアウト</Text>
              
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="body" className="text-white">現在のセッションからログアウトします</Text>
                  <Text variant="caption" className="text-gray-400">保存されていないデータは失われます</Text>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="border-gray-700 hover:bg-gray-800">
                  ログアウト
                </Button>
              </div>
            </div>

            {/* Account Deletion */}
            <div className="bg-gray-900 shadow-sm rounded-lg p-6 border border-red-800">
              <Text variant="subtitle" className="mb-4 text-red-400">アカウント削除</Text>
              
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <Text variant="body" className="text-white">アカウントとすべてのデータを完全に削除します</Text>
                    <Text variant="caption" className="text-gray-400">この操作は取り消すことができません</Text>
                  </div>
                  <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                    アカウントを削除
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-700">
                    <Text variant="body" weight="semibold" className="text-red-400">注意！</Text>
                    <Text variant="caption" className="text-gray-300">
                      この操作によりアカウント、プロジェクト、すべてのデータが完全に削除されます。
                      削除を実行するには下記に「DELETE」と入力してください。
                    </Text>
                  </div>
                  
                  <input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE と入力"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 placeholder-gray-500"
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
                      className="border-gray-700 hover:bg-gray-800"
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
      <div className="min-h-screen bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Text variant="heading" className="mb-2 text-white">アカウント設定</Text>
            <Text variant="body" className="text-gray-400">
              プロフィール、セキュリティ、プランの管理ができます
            </Text>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-900/20 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="bg-gray-900 shadow-sm rounded-lg border border-gray-800 p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-green-900/30 text-green-400 border-green-700"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <span className="mr-3 text-lg">{tab.icon}</span>
                      <Text
                        className="text-white"
                        variant="body"
                        weight={activeTab === tab.id ? "medium" : "normal"}
                      >
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
      </div>
    </MainLayout>
  );
}