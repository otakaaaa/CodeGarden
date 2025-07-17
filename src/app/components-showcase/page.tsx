"use client";

import { useState } from "react";
import { Button, Text, Input } from "@/components/ui";

export default function ComponentsShowcasePage() {
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Text variant="heading" size="2xl" className="mb-4">
            UIコンポーネント ショーケース
          </Text>
          <Text variant="body" color="muted">
            CodeGardenで使用するUIコンポーネントの一覧です
          </Text>
        </div>

        <div className="space-y-12">
          {/* Button Component */}
          <section className="bg-white rounded-lg p-8 shadow-sm">
            <Text variant="title" className="mb-6">
              Button コンポーネント
            </Text>
            
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  バリエーション
                </Text>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  サイズ
                </Text>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  ステート
                </Text>
                <div className="flex flex-wrap gap-3">
                  <Button>Normal</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Text Component */}
          <section className="bg-white rounded-lg p-8 shadow-sm">
            <Text variant="title" className="mb-6">
              Text コンポーネント
            </Text>
            
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  バリエーション
                </Text>
                <div className="space-y-2">
                  <Text variant="heading">見出し（Heading）</Text>
                  <Text variant="title">タイトル（Title）</Text>
                  <Text variant="subtitle">サブタイトル（Subtitle）</Text>
                  <Text variant="body">本文（Body）</Text>
                  <Text variant="caption">キャプション（Caption）</Text>
                </div>
              </div>

              {/* Colors */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  カラー
                </Text>
                <div className="space-y-2">
                  <Text color="default">デフォルト</Text>
                  <Text color="muted">ミュート</Text>
                  <Text color="primary">プライマリ</Text>
                  <Text color="secondary">セカンダリ</Text>
                  <Text color="success">成功</Text>
                  <Text color="warning">警告</Text>
                  <Text color="danger">危険</Text>
                </div>
              </div>

              {/* Weights */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  フォントウェイト
                </Text>
                <div className="space-y-2">
                  <Text weight="normal">Normal</Text>
                  <Text weight="medium">Medium</Text>
                  <Text weight="semibold">Semibold</Text>
                  <Text weight="bold">Bold</Text>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  テキスト配置
                </Text>
                <div className="space-y-2">
                  <Text align="left" className="border p-2">左寄せ</Text>
                  <Text align="center" className="border p-2">中央寄せ</Text>
                  <Text align="right" className="border p-2">右寄せ</Text>
                </div>
              </div>
            </div>
          </section>

          {/* Input Component */}
          <section className="bg-white rounded-lg p-8 shadow-sm">
            <Text variant="title" className="mb-6">
              Input コンポーネント
            </Text>
            
            <div className="space-y-6">
              {/* Basic */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  基本
                </Text>
                <div className="space-y-4 max-w-md">
                  <Input
                    placeholder="基本の入力欄"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input
                    label="ラベル付き"
                    placeholder="入力してください"
                    helperText="これはヘルパーテキストです"
                  />
                  <Input
                    label="必須項目"
                    placeholder="必須入力"
                    isRequired
                  />
                </div>
              </div>

              {/* Variants */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  バリエーション
                </Text>
                <div className="space-y-4 max-w-md">
                  <Input variant="default" placeholder="Default" />
                  <Input variant="filled" placeholder="Filled" />
                  <Input variant="flushed" placeholder="Flushed" />
                  <Input variant="unstyled" placeholder="Unstyled" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  サイズ
                </Text>
                <div className="space-y-4 max-w-md">
                  <Input size="sm" placeholder="Small" />
                  <Input size="md" placeholder="Medium" />
                  <Input size="lg" placeholder="Large" />
                </div>
              </div>

              {/* Types */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  タイプ
                </Text>
                <div className="space-y-4 max-w-md">
                  <Input type="text" placeholder="Text" />
                  <Input 
                    type="email" 
                    label="メールアドレス"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input 
                    type="password" 
                    label="パスワード"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input type="number" placeholder="Number" />
                </div>
              </div>

              {/* States */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  ステート
                </Text>
                <div className="space-y-4 max-w-md">
                  <Input placeholder="Normal" />
                  <Input placeholder="Disabled" disabled />
                  <Input 
                    placeholder="Error state"
                    error="エラーメッセージです"
                    isInvalid
                  />
                </div>
              </div>

              {/* With Icons */}
              <div>
                <Text variant="subtitle" className="mb-3">
                  アイコン付き
                </Text>
                <div className="space-y-4 max-w-md">
                  <Input 
                    placeholder="検索..."
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                  <Input 
                    placeholder="設定"
                    rightIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Text variant="caption" color="muted">
            このページは開発用のショーケースです
          </Text>
        </div>
      </div>
    </div>
  );
}