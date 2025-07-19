"use client";

import { useState } from "react";
import { Node } from "reactflow";
import { NodeEvent } from "@/lib/schemas";
import Button from "@/components/ui/Button";
import EventConfigModal from "./EventConfigModal";

interface PropertyPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, updates: Record<string, unknown>) => void;
  allNodes: Node[];
}

export default function PropertyPanel({ selectedNode, onNodeUpdate, allNodes }: PropertyPanelProps) {
  const [label, setLabel] = useState(selectedNode?.data?.label || "");
  const [color, setColor] = useState(selectedNode?.data?.props?.color || "#3B82F6");
  const [size, setSize] = useState(selectedNode?.data?.props?.size || "medium");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [, setEventType] = useState<"onClick" | "onChange" | "onSubmit">("onClick");

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { label: newLabel });
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, {
        props: { ...selectedNode.data.props, color: newColor }
      });
    }
  };

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, {
        props: { ...selectedNode.data.props, size: newSize }
      });
    }
  };

  const openEventModal = (type: "onClick" | "onChange" | "onSubmit") => {
    setEventType(type);
    setIsEventModalOpen(true);
  };

  const handleEventsSave = (events: NodeEvent[]) => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { events });
    }
  };

  const getAvailableNodes = () => {
    return allNodes.map(node => ({
      id: node.id,
      label: node.data?.label || node.id,
      type: node.data?.componentType || "unknown",
    }));
  };

  const getCurrentEvents = (): NodeEvent[] => {
    return selectedNode?.data?.events || [];
  };

  if (!selectedNode) {
    return (
      <div className="w-64 bg-gray-900 border-l border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-white mb-4">プロパティ</h2>
        <p className="text-gray-300 text-center mt-8">
          コンポーネントを選択してください
        </p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-900 border-l border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-white mb-4">プロパティ</h2>
      
      <div className="space-y-4">
        {/* Component Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            タイプ
          </label>
          <div className="text-sm text-gray-200 bg-gray-800 p-2 rounded border border-gray-600">
            {selectedNode.data.componentType || "default"}
          </div>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            テキスト
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="テキストを入力"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            色
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-8 rounded border border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-3 py-1 text-sm bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            サイズ
          </label>
          <select
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>

        {/* Events Section */}
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-md font-semibold text-white mb-3">イベント</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-left justify-start"
              onClick={() => openEventModal("onClick")}
            >
              📱 イベントを設定
            </Button>
            
            {getCurrentEvents().length > 0 && (
              <div className="mt-2 text-xs text-gray-300">
                {getCurrentEvents().length}個のイベントが設定済み
              </div>
            )}
          </div>
        </div>

        {/* Node Info */}
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-md font-semibold text-white mb-2">ノード情報</h3>
          <div className="text-xs text-gray-300 space-y-1">
            <p>ID: {selectedNode.id}</p>
            <p>位置: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</p>
          </div>
        </div>
      </div>

      {/* Event Configuration Modal */}
      {selectedNode && (
        <EventConfigModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleEventsSave}
          nodeId={selectedNode.id}
          nodeType={selectedNode.data?.componentType || "unknown"}
          initialEvents={getCurrentEvents()}
          availableNodes={getAvailableNodes()}
        />
      )}
    </div>
  );
}