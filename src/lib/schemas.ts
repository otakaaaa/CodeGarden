import { z } from "zod";

// イベントアクション
export const eventActionSchema = z.object({
  type: z.enum(["setText", "setVariable", "showAlert"]),
  target: z.string().optional(),
  value: z.string(),
});

// ノードイベント
export const nodeEventSchema = z.object({
  type: z.enum(["onClick", "onChange", "onSubmit"]),
  action: eventActionSchema,
});

// ノードデータ
export const nodeDataSchema = z.object({
  label: z.string(),
  props: z.record(z.string(), z.any()).optional(),
  events: z.array(nodeEventSchema).optional(),
});

// React Flowノード
export const flowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["button", "text", "input"]),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: nodeDataSchema,
});

// React Flowエッジ
export const flowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
});

// プロジェクト設定
export const projectSettingsSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  previewMode: z.boolean().default(false),
  variables: z.record(z.string(), z.any()).default({}),
});

// プロジェクトデータ
export const projectDataSchema = z.object({
  nodes: z.array(flowNodeSchema).default([]),
  edges: z.array(flowEdgeSchema).default([]),
  settings: projectSettingsSchema,
});

// プロジェクト
export const projectSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1, "プロジェクト名は必須です"),
  data: projectDataSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_deleted: z.boolean().default(false),
});

// プロジェクト作成時の入力
export const createProjectSchema = z.object({
  name: z.string().min(1, "プロジェクト名は必須です"),
  data: projectDataSchema.optional(),
});

// プロジェクト更新時の入力
export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  data: projectDataSchema.optional(),
});

// UI状態
export const uiStateSchema = z.object({
  selectedNodeId: z.string().nullable().default(null),
  zoom: z.number().min(0.1).max(2).default(1),
  theme: z.enum(["light", "dark"]).default("light"),
  isPreviewMode: z.boolean().default(false),
  sidebarOpen: z.boolean().default(true),
});

// 型のエクスポート
export type EventAction = z.infer<typeof eventActionSchema>;
export type NodeEvent = z.infer<typeof nodeEventSchema>;
export type NodeData = z.infer<typeof nodeDataSchema>;
export type FlowNode = z.infer<typeof flowNodeSchema>;
export type FlowEdge = z.infer<typeof flowEdgeSchema>;
export type ProjectSettings = z.infer<typeof projectSettingsSchema>;
export type ProjectData = z.infer<typeof projectDataSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type UIState = z.infer<typeof uiStateSchema>;