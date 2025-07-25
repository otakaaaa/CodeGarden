"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, resendConfirmationEmail } from "@/lib/supabase/auth";
import Button from "@/components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "アカウント作成に失敗しました");
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">
              確認メールを送信しました
            </h2>
            <p className="mt-2 text-gray-400">
              {email} に確認メールを送信しました。
              メール内のリンクをクリックしてアカウントを有効化してください。
            </p>
            {resendSuccess && (
              <div className="mt-4 bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-lg">
                確認メールを再送信しました
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              loading={resending}
              variant="primary"
              className="w-full"
            >
              確認メールを再送信
            </Button>
            <Button
              onClick={() => router.push("/auth/signin")}
              variant="outline"
              className="w-full"
            >
              ログインページに戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            アカウントを作成
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            既にアカウントをお持ちの方は{" "}
            <Link href="/auth/signin" className="text-green-400 hover:text-green-300">
              ログイン
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="8文字以上のパスワード"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                パスワード確認
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="パスワードを再入力"
              />
            </div>
          </div>

          <div className="text-sm text-gray-400">
            アカウントを作成することで、
            <Link href="/terms" className="text-green-400 hover:text-green-300">
              利用規約
            </Link>
            および
            <Link href="/privacy" className="text-green-400 hover:text-green-300">
              プライバシーポリシー
            </Link>
            に同意したものとみなされます。
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            アカウントを作成
          </Button>
        </form>
      </div>
    </div>
  );
}