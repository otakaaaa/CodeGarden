import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              組み立てながら学ぶ、
              <br />
              <span className="text-green-400">ノーコードの新しいカタチ</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              プログラミングの基礎概念を、コードを書かずに直感的に学べる学習プラットフォーム。
              UIパーツをドラッグ&ドロップで配置し、イベントを設定することで、
              自然にプログラミングの論理的思考を身につけられます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  無料で始める
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                  料金プランを見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              プログラミング学習の新しいアプローチ
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              従来のコード記述ではなく、視覚的な操作で学ぶ革新的な学習方法
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                ドラッグ&ドロップで直感的
              </h3>
              <p className="text-gray-400 leading-relaxed">
                ボタン、テキスト、入力欄などのUIパーツを画面上に配置するだけ。
                コードを書かずにアプリの見た目を作成できます。
              </p>
            </div>

            <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                イベントで動きを学ぶ
              </h3>
              <p className="text-gray-400 leading-relaxed">
                クリック、入力などのイベントを設定することで、
                プログラムがどのように動作するかを体験的に理解できます。
              </p>
            </div>

            <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                リアルタイムプレビュー
              </h3>
              <p className="text-gray-400 leading-relaxed">
                作成したアプリをその場で実行・テストできます。
                変更が即座に反映されるので、試行錯誤しながら学習を進められます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              3ステップで始めるプログラミング学習
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                パーツを配置
              </h3>
              <p className="text-gray-400">
                ボタン、テキスト、入力欄を画面上にドラッグ&ドロップで配置します
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                イベントを設定
              </h3>
              <p className="text-gray-400">
                各パーツにクリックや入力などのイベントを設定し、動作を定義します
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                プレビューで確認
              </h3>
              <p className="text-gray-400">
                作成したアプリをその場で実行し、動作を確認しながら学習を深めます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              こんな方におすすめ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                プログラミング初学者
              </h3>
              <p className="text-gray-400">
                プログラミングに興味があるけれど、どこから始めればいいかわからない方。
                コードを書く前に、プログラミングの考え方を理解したい方に最適です。
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                教育機関・指導者
              </h3>
              <p className="text-gray-400">
                学校や塾で生徒にプログラミングを教える際の教材として。
                視覚的で分かりやすいため、幅広い年齢層の学習者に対応できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            今すぐプログラミング学習を始めよう
          </h2>
          <p className="text-xl text-green-200 mb-8">
            無料プランでは1つのプロジェクトを作成できます。
            まずはお気軽にお試しください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-8 bg-white text-green-700 hover:bg-gray-100"
              >
                無料でアカウント作成
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-8 bg-white/10 text-white border-2 border-white/50 hover:bg-white hover:text-green-700 font-semibold backdrop-blur-sm"
              >
                プランを比較する
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}