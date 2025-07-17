"use client";

import { Node, Edge } from "reactflow";

interface PreviewPanelProps {
  nodes: Node[];
  edges: Edge[];
}

export default function PreviewPanel({ nodes }: PreviewPanelProps) {
  const renderComponent = (node: Node) => {
    const { componentType, label, props = {} } = node.data;
    const { color = "#3B82F6", size = "medium" } = props;

    const sizeClasses = {
      small: "px-3 py-1 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    };

    const baseClasses = "rounded-md font-medium transition-colors";

    switch (componentType) {
      case "button":
        return (
          <button
            key={node.id}
            className={`${baseClasses} ${sizeClasses[size as keyof typeof sizeClasses]} text-white hover:opacity-90`}
            style={{
              backgroundColor: color,
              position: "absolute",
              left: node.position.x,
              top: node.position.y,
            }}
            onClick={() => {
              // TODO: Execute configured click events
              console.log(`Button clicked: ${label}`);
            }}
          >
            {label}
          </button>
        );

      case "text":
        return (
          <div
            key={node.id}
            className={`${sizeClasses[size as keyof typeof sizeClasses]}`}
            style={{
              color: color,
              position: "absolute",
              left: node.position.x,
              top: node.position.y,
            }}
          >
            {label}
          </div>
        );

      case "input":
        return (
          <input
            key={node.id}
            type="text"
            placeholder={label}
            className={`${sizeClasses[size as keyof typeof sizeClasses]} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            style={{
              position: "absolute",
              left: node.position.x,
              top: node.position.y,
              borderColor: color,
            }}
            onChange={(e) => {
              // TODO: Execute configured input events
              console.log(`Input changed: ${e.target.value}`);
            }}
          />
        );

      default:
        return (
          <div
            key={node.id}
            className="p-2 bg-gray-100 border border-gray-300 rounded"
            style={{
              position: "absolute",
              left: node.position.x,
              top: node.position.y,
            }}
          >
            {label || "Unknown Component"}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-white">
      {/* Preview Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
        <h2 className="text-lg font-semibold text-gray-900">プレビュー</h2>
        <p className="text-sm text-gray-600">作成したアプリの動作を確認できます</p>
      </div>

      {/* Preview Area */}
      <div className="relative h-full bg-white overflow-hidden">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg font-medium">まだコンポーネントがありません</p>
              <p className="text-sm">左のパレットからコンポーネントを追加してください</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full p-4">
            {nodes.map(renderComponent)}
          </div>
        )}

        {/* Preview Controls */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>プレビューモード</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}