export interface PlanConfig {
  id: string;
  name: string;
  priceId: string;
  price: string;
  interval: string;
  features: string[];
  popular?: boolean;
}

// Stripe価格ID（実際のStripeダッシュボードで作成したPrice IDに置き換えてください）
export const STRIPE_PLANS: PlanConfig[] = [
  {
    id: "pro",
    name: "Pro",
    priceId: "price_1RmftwQS9Pb71yy7MD66BaFg", // 実際のPrice IDに置き換え
    price: "¥980",
    interval: "月",
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
    priceId: "price_1RmfuUQS9Pb71yy7KpJImXUD", // 実際のPrice IDに置き換え
    price: "¥3,800",
    interval: "月",
    features: [
      "Proの全機能",
      "リアルタイム共同編集",
      "メンバー管理",
      "チーム分析",
      "カスタム統合",
    ],
  },
];

export function getPlanByPriceId(priceId: string): PlanConfig | undefined {
  return STRIPE_PLANS.find(plan => plan.priceId === priceId);
}

export function getPlanById(id: string): PlanConfig | undefined {
  return STRIPE_PLANS.find(plan => plan.id === id);
}

// テスト環境用の価格ID（Stripeのテストモード用）
export const TEST_PRICE_IDS = {
  pro: "price_1RmftwQS9Pb71yy7MD66BaFg",
  team: "price_1RmfuUQS9Pb71yy7KpJImXUD",
};

// 本番環境用の価格ID
export const PROD_PRICE_IDS = {
  pro: "price_prod_1234567890",
  team: "price_prod_0987654321",
};

// 環境に応じて価格IDを取得
export function getPriceId(planId: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  const priceIds = isProduction ? PROD_PRICE_IDS : TEST_PRICE_IDS;
  
  return priceIds[planId as keyof typeof priceIds] || "";
}