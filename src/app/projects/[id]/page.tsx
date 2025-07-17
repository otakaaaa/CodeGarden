"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ReactFlow, {
  Node,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchProject, saveProject, updateNodes, updateEdges } from "@/lib/slices/currentProjectSlice";
import Button from "@/components/ui/Button";
import ComponentPalette from "@/components/editor/ComponentPalette";
import PropertyPanel from "@/components/editor/PropertyPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";
import { ButtonNode, TextNode, InputNode } from "@/components/editor/nodes";
import { initializeEventEngine, resetEventEngine } from "@/lib/eventEngine";

// カスタムノードタイプの定義
const nodeTypes: NodeTypes = {
  buttonNode: ButtonNode,
  textNode: TextNode,
  inputNode: InputNode,
};

export default function ProjectEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [projectVariables, setProjectVariables] = useState<Record<string, unknown>>({});

  const { project, loading, error } = useAppSelector((state) => state.currentProject);

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    if (id) {
      dispatch(fetchProject(id as string));
    }
  }, [user, id, dispatch, router]);

  useEffect(() => {
    if (project?.data?.nodes) {
      // Convert schema nodes to ReactFlow format
      const nodeTypeMap = {
        button: "buttonNode",
        text: "textNode",
        input: "inputNode",
      };

      const reactFlowNodes = project.data.nodes.map(node => ({
        id: node.id,
        type: nodeTypeMap[node.type as keyof typeof nodeTypeMap] || "default",
        position: node.position,
        data: {
          ...node.data,
          componentType: node.type,
        },
      }));
      setNodes(reactFlowNodes);
    }
    if (project?.data?.edges) {
      // Convert schema edges to ReactFlow format
      const reactFlowEdges = project.data.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || "default",
      }));
      setEdges(reactFlowEdges);
    }
  }, [project, setNodes, setEdges]);

  // イベントエンジンの初期化
  useEffect(() => {
    if (nodes.length > 0) {
      const nodeData: Record<string, unknown> = {};
      nodes.forEach(node => {
        nodeData[node.id] = {
          ...node.data,
          value: "", // 初期値
        };
      });

      initializeEventEngine({
        variables: projectVariables,
        nodes: nodeData,
        onVariableChange: (name, value) => {
          setProjectVariables(prev => ({ ...prev, [name]: value }));
        },
        onNodeUpdate: (nodeId, updates) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId && updates && typeof updates === 'object' 
                ? { ...node, data: { ...node.data, ...updates } } 
                : node
            )
          );
        },
        onShowAlert: (message) => {
          alert(message); // 後でより良いアラート実装に変更可能
        },
      });
    }

    // クリーンアップ
    return () => {
      if (nodes.length === 0) {
        resetEventEngine();
      }
    };
  }, [nodes, projectVariables, setNodes]);

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const onNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
  };

  const handleSave = async () => {
    if (project) {
      // Convert ReactFlow nodes to our schema format
      const schemaNodes = nodes.map(node => ({
        id: node.id,
        type: (node.data.componentType || "button") as "button" | "text" | "input",
        position: node.position,
        data: {
          label: node.data.label || "",
          props: node.data.props || {},
          events: node.data.events || [],
        },
      }));

      // Convert ReactFlow edges to our schema format  
      const schemaEdges = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      }));

      dispatch(updateNodes(schemaNodes));
      dispatch(updateEdges(schemaEdges));
      
      dispatch(saveProject({
        projectId: project.id,
        projectData: {
          name: project.name,
          data: {
            ...project.data,
            nodes: schemaNodes,
            edges: schemaEdges,
          },
        },
      }));
    }
  };

  const addComponent = (type: string) => {
    const nodeTypeMap = {
      button: "buttonNode",
      text: "textNode", 
      input: "inputNode",
    };

    const labelMap = {
      button: "ボタン",
      text: "テキスト",
      input: "入力欄",
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: nodeTypeMap[type as keyof typeof nodeTypeMap] || "default",
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: {
        label: labelMap[type as keyof typeof labelMap] || type,
        componentType: type,
        props: {},
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">エラーが発生しました</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/projects")}>
            プロジェクト一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">プロジェクトが見つかりません</h1>
          <Button onClick={() => router.push("/projects")}>
            プロジェクト一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
          >
            ← 戻る
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {showPreview && (
            <Button
              variant="outline"
              onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
            >
              {isFullscreenPreview ? "縮小表示" : "フルスクリーン"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "編集モード" : "プレビュー"}
          </Button>
          {!showPreview && (
            <Button onClick={handleSave}>
              保存
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 flex">
        {showPreview ? (
          isFullscreenPreview ? (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
              {/* Fullscreen Preview Header */}
              <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{project.name} - プレビュー</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsFullscreenPreview(false)}
                  >
                    フルスクリーン終了
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    編集に戻る
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <PreviewPanel nodes={nodes} edges={edges} />
              </div>
            </div>
          ) : (
            <PreviewPanel nodes={nodes} edges={edges} />
          )
        ) : (
          <>
            {/* Component Palette */}
            <ComponentPalette onAddComponent={addComponent} />

            {/* Main Editor Area */}
            <div className="flex-1 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => onNodeSelect(node)}
                onPaneClick={() => onNodeSelect(null)}
                fitView
              >
                <Background />
                <Controls />
                <Panel position="top-left">
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">操作方法</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 左のパレットからコンポーネントをドラッグ</li>
                      <li>• ノードをクリックして選択</li>
                      <li>• 右のパネルでプロパティを編集</li>
                    </ul>
                  </div>
                </Panel>
              </ReactFlow>
            </div>

            {/* Property Panel */}
            <PropertyPanel
              selectedNode={selectedNode}
              allNodes={nodes}
              onNodeUpdate={(nodeId, updates) => {
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
                  )
                );
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}