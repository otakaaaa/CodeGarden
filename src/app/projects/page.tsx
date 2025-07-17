"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProjects, createProject } from "@/lib/slices/projectsSlice";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      dispatch(fetchProjects());
    }
  }, [user, authLoading, dispatch, router]);

  const handleCreateProject = async () => {
    setCreateLoading(true);
    try {
      const result = await dispatch(createProject({ name: "新しいプロジェクト" }));
      if (createProject.fulfilled.match(result)) {
        router.push(`/projects/${result.payload.id}`);
      }
    } catch (err) {
      console.error("プロジェクト作成エラー:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-green-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">プロジェクト</h1>
            <p className="mt-2 text-gray-600">
              あなたのプロジェクト一覧です
            </p>
          </div>
          <Button onClick={handleCreateProject} loading={createLoading}>
            新しいプロジェクト
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              プロジェクトがありません
            </h3>
            <p className="text-gray-600 mb-6">
              最初のプロジェクトを作成して、プログラミング学習を始めましょう
            </p>
            <Button onClick={handleCreateProject} loading={createLoading}>
              プロジェクトを作成
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {project.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {project.data.nodes.length} パーツ
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  最終更新: {new Date(project.updated_at).toLocaleDateString("ja-JP")}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 6l-4-2v4l4-2z" clipRule="evenodd" />
                  </svg>
                  プレビュー
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}