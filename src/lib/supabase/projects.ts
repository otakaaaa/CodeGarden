import { supabase } from "../supabase";
import { Project, CreateProject, UpdateProject, projectSchema } from "../schemas";

// 古いプロジェクトデータを新しい形式にマイグレーション
function migrateProjectData(item: Record<string, unknown>): Record<string, unknown> {
  // すでに新しい形式の場合はそのまま返す
  if (item.data && typeof item.data === "object" && item.data !== null && 
      "nodes" in item.data && Array.isArray((item.data as Record<string, unknown>).nodes)) {
    // ノードデータの構造をチェックして修正
    const migratedNodes = ((item.data as Record<string, unknown>).nodes as Record<string, unknown>[]).map((node: Record<string, unknown>) => {
      if (!node.data || typeof node.data !== "object" || node.data === null) {
        return node;
      }

      // 古い形式のノードデータを新しい形式に変換
      const migratedNode = { ...node };
      const nodeData = migratedNode.data as Record<string, unknown>;
      
      // data.labelが存在しない場合はデフォルト値を設定
      if (!("label" in nodeData) || !nodeData.label) {
        nodeData.label = `${node.type || "component"}-${node.id || "unknown"}`;
      }

      // プロパティがdataの直下にある場合はpropsに移動
      if (!("props" in nodeData) || !nodeData.props) {
        nodeData.props = {};
        
        // 既存のプロパティをpropsに移動
        const propsToMove = ["text", "fontSize", "color", "fontWeight", "placeholder", "type", "required", "variant"];
        propsToMove.forEach(prop => {
          if (prop in nodeData && nodeData[prop] !== undefined) {
            (nodeData.props as Record<string, unknown>)[prop] = nodeData[prop];
            delete nodeData[prop];
          }
        });
      }

      // イベントデータの構造をチェック
      if ("events" in nodeData && Array.isArray(nodeData.events)) {
        nodeData.events = (nodeData.events as Record<string, unknown>[]).map((event: Record<string, unknown>) => {
          if (event.action && typeof event.action === "object" && event.action !== null && 
              !("value" in event.action)) {
            (event.action as Record<string, unknown>).value = "";
          }
          return event;
        });
      }

      return migratedNode;
    });

    const itemData = item.data as Record<string, unknown>;
    const settings = (itemData.settings as Record<string, unknown>) || {};
    
    return {
      ...item,
      data: {
        nodes: migratedNodes,
        edges: itemData.edges || [],
        settings: {
          theme: settings.theme || "light",
          previewMode: settings.previewMode || false,
          variables: settings.variables || {},
        },
      },
    };
  }

  // 完全に古い形式の場合は基本構造を作成
  return {
    ...item,
    data: {
      nodes: [],
      edges: [],
      settings: {
        theme: "light",
        previewMode: false,
        variables: {},
      },
    },
  };
}

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

  // データマイグレーションとバリデーション
  const validatedData = data.map((item, index) => {
    // 古いデータ形式を新しい形式にマイグレーション
    const migratedItem = migrateProjectData(item);
    
    const result = projectSchema.safeParse(migratedItem);
    if (!result.success) {
      console.error(`Project validation error for item ${index}:`, result.error);
      console.error("Validation issues:", JSON.stringify(result.error.issues, null, 2));
      console.error("Migrated data:", JSON.stringify(migratedItem, null, 2));
      throw new Error(`プロジェクトデータが不正です (項目 ${index})`);
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

  // データマイグレーションとバリデーション
  const migratedData = migrateProjectData(data as Record<string, unknown>);
  
  const result = projectSchema.safeParse(migratedData);
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

  // データマイグレーションとバリデーション
  const migratedData = migrateProjectData(data as Record<string, unknown>);
  
  const result = projectSchema.safeParse(migratedData);
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

  // データマイグレーションとバリデーション
  const migratedData = migrateProjectData(data as Record<string, unknown>);
  
  const result = projectSchema.safeParse(migratedData);
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