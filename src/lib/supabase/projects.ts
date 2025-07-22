import { supabase } from "../supabase";
import { Project, CreateProject, UpdateProject, projectSchema } from "../schemas";

// プロジェクト一覧取得
export async function fetchProjects(): Promise<Project[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("認証が必要です");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`プロジェクト取得エラー: ${error.message}`);
  }

  // Zodでバリデーション
  const validatedData = data.map((item) => {
    const result = projectSchema.safeParse(item);
    if (!result.success) {
      console.error("Project validation error:", result.error);
      throw new Error("プロジェクトデータが不正です");
    }
    return result.data;
  });

  return validatedData;
}

// プロジェクト詳細取得
export async function fetchProject(projectId: string): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("認証が必要です");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // プロジェクトが見つからない
    }
    throw new Error(`プロジェクト取得エラー: ${error.message}`);
  }

  // Zodでバリデーション
  const result = projectSchema.safeParse(data);
  if (!result.success) {
    console.error("Project validation error:", result.error);
    throw new Error("プロジェクトデータが不正です");
  }

  return result.data;
}

// プロジェクト作成
export async function createProject(projectData: CreateProject): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("認証が必要です");
  }

  const defaultData = {
    nodes: [],
    edges: [],
    settings: {
      theme: "light" as const,
      previewMode: false,
      variables: {},
    },
  };

  const insertData = {
    user_id: user.id,
    name: projectData.name,
    data: projectData.data || defaultData,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`プロジェクト作成エラー: ${error.message}`);
  }

  // Zodでバリデーション
  const result = projectSchema.safeParse(data);
  if (!result.success) {
    console.error("Project validation error:", result.error);
    throw new Error("作成されたプロジェクトデータが不正です");
  }

  return result.data;
}

// プロジェクト更新
export async function updateProject(projectId: string, projectData: UpdateProject): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("認証が必要です");
  }

  const updateData = {
    ...projectData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", projectId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`プロジェクト更新エラー: ${error.message}`);
  }

  // Zodでバリデーション
  const result = projectSchema.safeParse(data);
  if (!result.success) {
    console.error("Project validation error:", result.error);
    throw new Error("更新されたプロジェクトデータが不正です");
  }

  return result.data;
}

// プロジェクト削除（物理削除）
export async function deleteProject(projectId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("認証が必要です");
  }

  // RPC関数を使用して関連データも含めて削除
  const { error } = await supabase
    .rpc("delete_project_with_related_data", {
      project_id_param: projectId
    });

  if (error) {
    throw new Error(`プロジェクト削除エラー: ${error.message}`);
  }
}