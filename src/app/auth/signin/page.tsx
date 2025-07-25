"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, resendConfirmationEmail } from "@/lib/supabase/auth";
import Button from "@/components/ui/Button";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/projects");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "ログインに失敗しました";
      setError(errorMessage);
      
      // メール未認証エラーをチェック
      if (errorMessage.includes("Email not confirmed") || errorMessage.includes("メールアドレスが確認されていません")) {
        setNeedsEmailConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError("");
    setResendSuccess(false);
    setResending(true);

    try {
      await resendConfirmationEmail(email);
      setResendSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "メール再送信に失敗しました");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CG</span>
            </div>
            <span className="text-2xl font-bold text-white">CodeGarden</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            まだアカウントをお持ちでない方は{" "}
            <Link href="/auth/signup" className="text-green-400 hover:text-green-300">
              新規登録
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
              {needsEmailConfirmation && (
                <div className="mt-3">
                  <Button
                    type="button"
                    onClick={handleResendEmail}
                    loading={resending}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    確認メールを再送信
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {resendSuccess && (
            <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-lg">
              確認メールを再送信しました。メールをご確認ください。
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-green-400 hover:text-green-300"
              >
                パスワードを忘れた方
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            ログイン
          </Button>
        </form>
      </div>
    </div>
  );
}