import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";

export default function PricingPage() {
  const plans = [
    {
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
                >
                  {plan.name === "Free" ? "無料で始める" : "プランを選択"}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              よくある質問
            </h2>
            <p className="text-gray-600 mb-8">
              ご不明な点がございましたら、お気軽にお問い合わせください
            </p>
            <Button variant="outline">
              お問い合わせ
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}