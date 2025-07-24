import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

// サインアップ
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(`サインアップエラー: ${error.message}`);
  }

  return data;
}

// サインイン
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`サインインエラー: ${error.message}`);
  }

  return data;
}

// サインアウト
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`サインアウトエラー: ${error.message}`);
  }
}

// 現在のユーザー取得
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// パスワードリセット
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    throw new Error(`パスワードリセットエラー: ${error.message}`);
  }
}

// パスワード更新
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(`パスワード更新エラー: ${error.message}`);
  }
}