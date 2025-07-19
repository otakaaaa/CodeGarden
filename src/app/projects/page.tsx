"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProjects, createProject } from "@/lib/slices/projectsSlice";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import { Text, Input } from "@/components/ui";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  
  // UI states
  const [createLoading, setCreateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "updated" | "created">("updated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Templates
  const templates = [
    {
      id: "blank",
      name: "空のプロジェクト",
      description: "何もない状態から始める",
      icon: "📄",
      components: 0,
    },
    {
      id: "hello-world",
      name: "Hello World",
      description: "最初のボタンとテキスト",
      icon: "👋",
      components: 2,
    },
    {
      id: "form-example",
      name: "フォーム例",
      description: "入力フォームのサンプル",
      icon: "📝",
      components: 4,
    },
    {
      id: "interactive-demo",
      name: "インタラクティブデモ",
      description: "イベント機能のデモ",
      icon: "✨",
      components: 6,
    },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      dispatch(fetchProjects());
    }
  }, [user, authLoading, dispatch, router]);

  const handleCreateProject = async (templateId?: string) => {
    setCreateLoading(true);
    try {
      const projectName = templateId === "blank" ? "新しいプロジェクト" : 
                         templates.find(t => t.id === templateId)?.name || "新しいプロジェクト";
      
      const result = await dispatch(createProject({ 
        name: projectName,
        template: templateId 
      }));
      
      if (createProject.fulfilled.match(result)) {
        setShowTemplateModal(false);
        router.push(`/projects/${result.payload.id}`);
      }
    } catch (err) {
      console.error("プロジェクト作成エラー:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setCreateLoading(true);
    try {
      const result = await dispatch(createProject({ 
        name: `${project.name} のコピー`,
        data: project.data 
      }));
      
      if (createProject.fulfilled.match(result)) {
        router.push(`/projects/${result.payload.id}`);
      }
    } catch (err) {
      console.error("プロジェクト複製エラー:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("プロジェクトを削除しますか？この操作は取り消せません。")) {
      return;
    }

    try {
      // TODO: Implement delete project in slice
      // await dispatch(deleteProject(projectId));
      console.log("削除予定のプロジェクトID:", projectId);
      alert("プロジェクト削除機能は近日実装予定です");
    } catch (err) {
      console.error("プロジェクト削除エラー:", err);
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "updated":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh] bg-black">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-700 border-t-green-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <Text variant="heading" className="mb-2 text-white">
              プロジェクト({projects.length})
            </Text>
          </div>
          <Button onClick={() => setShowTemplateModal(true)} loading={createLoading}>
            新しいプロジェクト
          </Button>
        </div>

        {/* Search and Filters */}
        {projects.length > 0 && (
          <div className="mb-8 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="プロジェクトを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
                leftIcon={
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="updated">最新更新順</option>
                <option value="created">作成日順</option>
                <option value="name">名前順</option>
              </select>
              
              <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-green-900 text-green-400" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-green-900 text-green-400" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Projects Display */}
        {filteredProjects.length === 0 && projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <Text variant="title" className="mb-2 text-white">プロジェクトがありません</Text>
            <Text variant="body" className="mb-6 text-gray-400">
              最初のプロジェクトを作成して、プログラミング学習を始めましょう
            </Text>
            <Button onClick={() => setShowTemplateModal(true)} loading={createLoading}>
              プロジェクトを作成
            </Button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Text variant="title" className="mb-2 text-white">検索結果が見つかりません</Text>
            <Text variant="body" className="text-gray-400">
              検索条件を変更してお試しください
            </Text>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredProjects.map((project) => (
              <div key={project.id} className={`group relative bg-gray-900 border border-gray-800 rounded-lg ${viewMode === "grid" ? "p-6" : "p-4"} hover:border-gray-700 hover:shadow-lg hover:shadow-green-900/20 transition-all`}>
                {/* Project Link */}
                <Link
                  href={`/projects/${project.id}`}
                  className="block"
                >
                  <div className={`flex ${viewMode === "list" ? "items-center justify-between" : "flex-col"}`}>
                    <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className={"flex items-center"}>
                        <Text variant="subtitle" className="text-white group-hover:text-green-400 transition-colors">
                          {project.name}
                        </Text>
                      </div>
                      
                      <div className={"flex items-center space-x-4"}>
                        <Text variant="caption" className="text-gray-500">
                          最終更新: {new Date(project.updated_at).toLocaleDateString("ja-JP")}
                        </Text>
                        <Text variant="caption" className="text-gray-500">
                          {project.data.nodes.length} パーツ
                        </Text>
                      </div>
                      
                      {viewMode === "grid" && (
                        <div className="flex items-center text-sm text-gray-400 mt-4">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 6l-4-2v4l4-2z" clipRule="evenodd" />
                          </svg>
                          プレビュー
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Action Menu */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDuplicateProject(project.id);
                      }}
                      title="複製"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProject(project.id);
                      }}
                      title="削除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <Text variant="title" className="text-white">新しいプロジェクトを作成</Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateModal(false)}
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
                <Text variant="body" className="mt-2 text-gray-400">
                  テンプレートを選択してプロジェクトを始めましょう
                </Text>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleCreateProject(template.id)}
                      disabled={createLoading}
                      className="text-left p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-600 hover:bg-gray-800/70 transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <Text variant="body" weight="medium" className="mb-1 text-white">
                            {template.name}
                          </Text>
                          <Text variant="caption" className="mb-2 text-gray-400">
                            {template.description}
                          </Text>
                          <Text variant="caption" className="text-gray-500">
                            {template.components}個のコンポーネント
                          </Text>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </MainLayout>
  );
}