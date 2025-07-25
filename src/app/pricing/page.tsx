"use client";

import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { createCheckoutSession, createCustomer, getStripe } from "@/lib/stripe/client";
import { getPriceId } from "@/lib/stripe/config";

export default function PricingPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [loading, setLoading] = useState(false);
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "¥0",
      period: "永久無料",
      description: "プログラミング学習を始めたい方に",
      features: [
        "1プロジェクト",
        "ローカル保存のみ",
        "基本UIパーツ（Button, Text, Input）",
        "基本イベント（onClick）",
        "チュートリアル",
      ],
      limitations: [
        "クラウド保存なし",
        "公開リンクなし",
        "高度ロジックなし",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "¥980",
      period: "/月",
      description: "本格的にプログラミングを学びたい方に",
      features: [
        "無制限プロジェクト",
        "クラウド保存",
        "公開リンク共有",
        "条件分岐・ループ",
        "変数システム",
        "PDF/コードエクスポート",
      ],
      popular: true,
    },
    {
      id: "team",
      name: "Team",
      price: "¥3,800",
      period: "/月",
      description: "チーム・教育機関向け",
      features: [
        "Proの全機能",
        "リアルタイム共同編集",
        "メンバー管理",
        "チーム分析",
        "カスタム統合",
      ],
    },
  ];

  const faqs = [
    {
      question: "無料プランでどこまで学習できますか？",
      answer: "基本的なUI作成とイベント処理を学べます。Button、Text、Inputの配置やクリックイベントの設定など、プログラミングの基礎概念を理解するのに十分です。"
    },
    {
      question: "プランの変更はいつでもできますか？",
      answer: "はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次の請求サイクルから適用されます。"
    },
    {
      question: "学習データはどのように保護されますか？",
      answer: "すべてのデータは暗号化され、SOC2準拠のセキュアなサーバーで管理されています。お客様のプライバシーを最優先に考えています。"
    },
    {
      question: "チームプランでは何人まで利用できますか？",
      answer: "チームプランでは最大50人まで利用可能です。それ以上の人数をご希望の場合は、エンタープライズプランをご相談ください。"
    },
    {
      question: "返金保証はありますか？",
      answer: "有料プランには30日間の返金保証があります。ご満足いただけない場合、理由を問わずご利用開始から30日以内であれば全額返金いたします。"
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    
    try {
      if (planId === "free") {
        // Free plan - redirect to signup
        window.location.href = "/auth/signup?plan=free";
        return;
      }

      if (!user) {
        // User not logged in - redirect to signup with selected plan
        window.location.href = `/auth/signup?plan=${planId}`;
        return;
      }

      // Create or get Stripe customer
      const customerResponse = await createCustomer(
        user.email!,
        user.user_metadata?.display_name || user.email!,
        user.id
      );

      // Get the price ID for the selected plan
      const priceId = getPriceId(planId);
      if (!priceId) {
        throw new Error("価格IDが見つかりません");
      }

      // Create checkout session
      const { sessionId } = await createCheckoutSession({
        priceId,
        customerId: customerResponse.customerId,
        successUrl: `${window.location.origin}/account?success=true&plan=${planId}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      });

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe initialization failed");
      }
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Plan selection error:", error);
      alert("決済処理でエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <MainLayout>
      <div className="bg-black min-h-screen">
      <div className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              料金プラン
            </h1>
            <p className="mt-4 text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              あなたの学習スタイルに合わせてプランをお選びください
            </p>
            {/* <div className="mt-8 inline-flex items-center bg-green-900 text-green-300 px-4 py-2 rounded-full font-semibold border border-green-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              30日間返金保証
            </div> */}
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-br from-green-950 to-green-900 border-2 border-green-500 shadow-xl"
                    : "bg-gray-900 border-2 border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      人気プラン
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 font-medium ml-2">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-300 font-medium">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-200 font-medium">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation) => (
                    <li key={limitation} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-400">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className={`w-full ${!plan.popular ? "!bg-gray-800 !text-white hover:!bg-gray-700 !border-gray-600" : ""}`}
                  size="lg"
                  onClick={() => handlePlanSelect(plan.id)}
                  loading={loading && selectedPlan === plan.id}
                  disabled={loading}
                >
                  {plan.name === "Free" ? "無料で始める" : 
                   loading && selectedPlan === plan.id ? "処理中..." : "プランを選択"}
                </Button>
              </div>
            ))}
          </div>

          {/* Compare Plans */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                プラン比較表
              </h2>
              <p className="text-gray-300 font-medium">
                各プランの機能を詳しく比較できます
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-900 rounded-lg shadow-md border border-gray-700">
                <thead>
                  <tr className="border-b-2 border-gray-700 bg-gray-800">
                    <th className="text-left py-4 px-6 font-bold text-white">機能</th>
                    <th className="text-center py-4 px-6 font-bold text-white">Free</th>
                    <th className="text-center py-4 px-6 font-bold text-green-400 bg-gradient-to-b from-green-950 to-green-900">Pro</th>
                    <th className="text-center py-4 px-6 font-bold text-white">Team</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6 text-gray-300 font-medium">プロジェクト数</td>
                    <td className="py-4 px-6 text-center text-gray-400 font-semibold">1個</td>
                    <td className="py-4 px-6 text-center text-green-400 font-semibold bg-green-950">無制限</td>
                    <td className="py-4 px-6 text-center text-gray-400 font-semibold">無制限</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6 text-gray-300 font-medium">クラウド保存</td>
                    <td className="py-4 px-6 text-center text-red-400 font-bold">✗</td>
                    <td className="py-4 px-6 text-center text-green-400 font-bold bg-green-950">✓</td>
                    <td className="py-4 px-6 text-center text-green-400 font-bold">✓</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6 text-gray-300 font-medium">公開リンク</td>
                    <td className="py-4 px-6 text-center text-red-400 font-bold">✗</td>
                    <td className="py-4 px-6 text-center text-green-400 font-bold bg-green-950">✓</td>
                    <td className="py-4 px-6 text-center text-green-400 font-bold">✓</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6 text-gray-300 font-medium">共同編集</td>
                    <td className="py-4 px-6 text-center text-red-400 font-bold">✗</td>
                    <td className="py-4 px-6 text-center text-red-400 font-bold bg-green-950">✗</td>
                    <td className="py-4 px-6 text-center text-green-400 font-bold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                よくある質問
              </h2>
              <p className="text-gray-300 font-medium mb-8">
                ご不明な点がございましたら、お気軽にお問い合わせください
              </p>
              <Button
                variant="outline"
                className="!bg-gray-800 !text-white hover:!bg-gray-700 !border-gray-600"
                onClick={() => setShowFAQ(!showFAQ)}
              >
                {showFAQ ? "FAQを閉じる" : "FAQを表示"}
              </Button>
            </div>

            {showFAQ && (
              <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg shadow-md border-2 border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-gray-300 font-medium mb-4">
                他にご質問がございましたらお気軽にお問い合わせください
              </p>
              <Button 
                variant="outline" 
                className="!bg-gray-800 !text-white hover:!bg-gray-700 !border-gray-600"
                onClick={() => window.location.href = "mailto:support@codegarden.jp"}
              >
                お問い合わせ
              </Button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-green-900 to-green-800 rounded-2xl p-12 text-center shadow-xl border-2 border-green-600">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              今すぐプログラミング学習を始めましょう
            </h2>
            <p className="text-lg text-green-100 font-medium mb-8 max-w-2xl mx-auto">
              CodeGardenで視覚的にプログラミングを学び、実際のアプリケーション開発スキルを身につけることができます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => handlePlanSelect("free")}>
                無料で始める
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="!bg-gray-800 !text-white hover:!bg-gray-700 !border-gray-600"
                onClick={() => handlePlanSelect("pro")}
              >
                Proプランを選択
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}