"use client";

import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import { Text } from "@/components/ui";
import { useState } from "react";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
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
        "プレミアムサポート",
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
        "優先サポート",
        "カスタム統合",
        "専用サポート担当",
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
    
    if (planId === "free") {
      // Free plan - redirect to signup
      window.location.href = "/auth/signup?plan=free";
    } else {
      // Paid plans - redirect to Stripe checkout (to be implemented)
      // For now, just show an alert
      alert(`${planId}プランの決済機能は近日実装予定です`);
    }
  };

  return (
    <MainLayout>
      <div className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              料金プラン
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              あなたの学習スタイルに合わせてプランをお選びください
            </p>
            <div className="mt-8 inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              30日間返金保証
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-green-50 border-2 border-green-500 shadow-lg"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      人気プラン
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation) => (
                    <li key={limitation} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={() => handlePlanSelect(plan.id)}
                  loading={selectedPlan === plan.id}
                >
                  {plan.name === "Free" ? "無料で始める" : "プランを選択"}
                </Button>
              </div>
            ))}
          </div>

          {/* Compare Plans */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                プラン比較表
              </h2>
              <p className="text-gray-600">
                各プランの機能を詳しく比較できます
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">機能</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-green-600 bg-green-50">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Team</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">プロジェクト数</td>
                    <td className="py-4 px-6 text-center text-gray-600">1個</td>
                    <td className="py-4 px-6 text-center text-green-600 bg-green-50">無制限</td>
                    <td className="py-4 px-6 text-center text-gray-600">無制限</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">クラウド保存</td>
                    <td className="py-4 px-6 text-center text-red-500">✗</td>
                    <td className="py-4 px-6 text-center text-green-500 bg-green-50">✓</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">公開リンク</td>
                    <td className="py-4 px-6 text-center text-red-500">✗</td>
                    <td className="py-4 px-6 text-center text-green-500 bg-green-50">✓</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">共同編集</td>
                    <td className="py-4 px-6 text-center text-red-500">✗</td>
                    <td className="py-4 px-6 text-center text-red-500 bg-green-50">✗</td>
                    <td className="py-4 px-6 text-center text-green-500">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">サポート</td>
                    <td className="py-4 px-6 text-center text-gray-600">コミュニティ</td>
                    <td className="py-4 px-6 text-center text-green-600 bg-green-50">メール</td>
                    <td className="py-4 px-6 text-center text-gray-600">専任担当</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                よくある質問
              </h2>
              <p className="text-gray-600 mb-8">
                ご不明な点がございましたら、お気軽にお問い合わせください
              </p>
              <Button
                variant="outline"
                onClick={() => setShowFAQ(!showFAQ)}
              >
                {showFAQ ? "FAQを閉じる" : "FAQを表示"}
              </Button>
            </div>

            {showFAQ && (
              <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <Text variant="body" color="muted">
                      {faq.answer}
                    </Text>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Text variant="body" color="muted" className="mb-4">
                他にご質問がございましたらお気軽にお問い合わせください
              </Text>
              <Button variant="outline" onClick={() => window.location.href = "mailto:support@codegarden.jp"}>
                お問い合わせ
              </Button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-green-50 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              今すぐプログラミング学習を始めましょう
            </h2>
            <Text variant="body" color="muted" className="mb-8 max-w-2xl mx-auto">
              CodeGardenで視覚的にプログラミングを学び、実際のアプリケーション開発スキルを身につけることができます。
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => handlePlanSelect("free")}>
                無料で始める
              </Button>
              <Button variant="outline" size="lg" onClick={() => handlePlanSelect("pro")}>
                Proプランを選択
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}