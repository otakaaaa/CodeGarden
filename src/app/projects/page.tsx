"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProjects, createProject, deleteProject } from "@/lib/slices/projectsSlice";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import { Text, Input } from "@/components/ui";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { 
  Search, X, Grid3X3, List, Copy, Trash2, 
  ArrowRight, FileText, Hand, FileInput, Sparkles,
  Package, Plus, Layers, ChevronRight, Play,
  Archive
} from "lucide-react";
import { getTemplateData } from "@/lib/templates";

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
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectName: string;
  }>({
    isOpen: false,
    projectId: null,
    projectName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Templates
  const templates = [
    {
      id: "blank",
      name: "空のプロジェクト",
      description: "何もない状態から始める",
      icon: FileText,
      components: 0,
    },
    {
      id: "hello-world",
      name: "Hello World",
      description: "最初のボタンとテキスト",
      icon: Hand,
      components: 2,
    },
    {
      id: "form-example",
      name: "フォーム例",
      description: "入力フォームのサンプル",
      icon: FileInput,
      components: 4,
    },
    {
      id: "interactive-demo",
      name: "インタラクティブデモ",
      description: "イベント機能のデモ",
      icon: Sparkles,
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
      let projectName = "新しいプロジェクト";
      let projectData = undefined;

      if (templateId && templateId !== "blank") {
        const template = templates.find(t => t.id === templateId);
        if (template) {
          projectName = template.name;
          const templateDataResult = getTemplateData(templateId);
          if (templateDataResult) {
            projectData = templateDataResult;
          }
        }
      }
      
      const result = await dispatch(createProject({ 
        name: projectName,
        data: projectData
      }));
      
      if (createProject.fulfilled.match(result)) {
        setShowTemplateModal(false);
        router.push(`/editor?id=${result.payload.id}`);
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
        router.push(`/editor?id=${result.payload.id}`);
      }
    } catch (err) {
      console.error("プロジェクト複製エラー:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setDeleteModalState({
      isOpen: true,
      projectId,
      projectName: project.name,
    });
  };

  const confirmDeleteProject = async () => {
    if (!deleteModalState.projectId) return;

    setIsDeleting(true);
    try {
      const result = await dispatch(deleteProject(deleteModalState.projectId));
      if (deleteProject.fulfilled.match(result)) {
        setDeleteModalState({ isOpen: false, projectId: null, projectName: "" });
      }
    } catch (err) {
      console.error("プロジェクト削除エラー:", err);
    } finally {
      setIsDeleting(false);
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
                leftIcon={<Search className="w-5 h-5 text-gray-500" />}
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
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-green-900 text-green-400" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  <List className="w-5 h-5" />
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
              <Archive className="w-12 h-12 text-gray-500" />
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
                  href={`/editor?id=${project.id}`}
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
                          <Play className="w-4 h-4 mr-1" />
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
                      <Copy className="w-4 h-4" />
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
                      <Trash2 className="w-4 h-4" />
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
            <div className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <Text variant="title" className="text-white">新しいプロジェクトを作成</Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateModal(false)}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>
                <Text variant="body" className="mt-2 text-gray-400">
                  空のプロジェクトから始めるか、テンプレートを選択してください
                </Text>
              </div>

              <div className="p-6">
                {/* 空のプロジェクトセクション */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Plus className="w-6 h-6 text-green-400 mr-2" />
                    <Text variant="heading" className="text-white">空のプロジェクト</Text>
                  </div>
                  <button
                    onClick={() => handleCreateProject("blank")}
                    disabled={createLoading}
                    className="w-full text-left p-6 bg-gradient-to-r from-green-900 to-green-800 border-2 border-green-600 rounded-lg hover:from-green-800 hover:to-green-700 transition-all disabled:opacity-50 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Text variant="title" className="mb-1 text-white group-hover:text-green-100">
                          空のプロジェクト
                        </Text>
                        <Text variant="body" className="text-green-200">
                          何もない状態から自由に作成できます
                        </Text>
                        <div className="flex items-center mt-3 space-x-4">
                          <div className="flex items-center text-green-300">
                            <Layers className="w-4 h-4 mr-1" />
                            完全にカスタマイズ可能
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-green-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* テンプレートセクション */}
                <div>
                  <div className="flex items-center mb-4">
                    <Package className="w-6 h-6 text-gray-400 mr-2" />
                    <Text variant="heading" className="text-white">テンプレート</Text>
                  </div>
                  <Text variant="body" className="text-gray-400 mb-6">
                    学習に最適なサンプルプロジェクトから始めましょう
                  </Text>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templates.filter(t => t.id !== "blank").map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleCreateProject(template.id)}
                        disabled={createLoading}
                        className="text-left p-5 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-600 hover:bg-gray-750 transition-all disabled:opacity-50 group"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-start space-x-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                              {template.icon && <template.icon className="w-5 h-5 text-gray-300" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Text variant="body" weight="medium" className="mb-1 text-white group-hover:text-green-400 transition-colors truncate">
                                {template.name}
                              </Text>
                              <Text variant="caption" className="text-gray-400 line-clamp-2">
                                {template.description}
                              </Text>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-500">
                                <Layers className="w-4 h-4 mr-1" />
                                <Text variant="caption" className="text-gray-500">
                                  {template.components}個
                                </Text>
                              </div>
                              <ChevronRight className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState({ isOpen: false, projectId: null, projectName: "" })}
          onConfirm={confirmDeleteProject}
          title="プロジェクトを削除"
          message="このプロジェクトとすべての関連データが完全に削除されます。この操作は取り消せません。"
          itemName={deleteModalState.projectName}
          isDeleting={isDeleting}
        />
      </div>
      </div>
    </MainLayout>
  );
}