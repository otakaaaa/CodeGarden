"use client";

import { useState, useEffect, useRef } from "react";
import { Node, Edge } from "reactflow";
import { getEventEngine, initializeEventEngine } from "@/lib/eventEngine";
import { Button, Text, Input } from "@/components/ui";
import { usePreviewData } from "./PreviewDataManager";

interface PreviewPanelProps {
  nodes: Node[];
  edges: Edge[];
}

export default function PreviewPanel({ nodes }: PreviewPanelProps) {
  const {
    data: previewData,
    updateNodeValue,
    updateVariable,
    addHistoryEntry,
    resetData,
  } = usePreviewData(nodes);

  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [consoleLog, setConsoleLog] = useState<Array<{ type: "info" | "error" | "event"; message: string; timestamp: Date }>>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  // プレビューエンジンの初期化
  useEffect(() => {
    if (nodes.length > 0) {
      const nodeData: Record<string, unknown> = {};

      nodes.forEach(node => {
        nodeData[node.id] = {
          ...node.data,
          value: previewData.nodeValues[node.id] || "",
        };
      });

      // プレビュー専用のイベントエンジンを初期化
      initializeEventEngine({
        variables: previewData.variables,
        nodes: nodeData,
        onVariableChange: (name, value) => {
          updateVariable(name, value);
          setConsoleLog(prev => [
            ...prev,
            {
              type: "info",
              message: `変数 ${name} が ${value} に変更されました`,
              timestamp: new Date(),
            },
          ]);
        },
        onNodeUpdate: (nodeId, updates) => {
          if (updates && typeof updates === 'object' && 'label' in updates) {
            addHistoryEntry(`ノード ${nodeId} のテキストが "${updates.label}" に変更されました`);
            setConsoleLog(prev => [
              ...prev,
              {
                type: "info",
                message: `ノード ${nodeId} のテキストが "${updates.label}" に変更されました`,
                timestamp: new Date(),
              },
            ]);
          }
        },
        onShowAlert: (message) => {
          addHistoryEntry(`アラート: ${message}`);
          setConsoleLog(prev => [
            ...prev,
            {
              type: "event",
              message: `アラート: ${message}`,
              timestamp: new Date(),
            },
          ]);
          alert(message);
        },
      });
    }
  }, [nodes, previewData.variables, previewData.nodeValues, updateVariable, addHistoryEntry]);

  // コンソールの自動スクロール
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLog]);

  const handleInputChange = (nodeId: string, value: string) => {
    updateNodeValue(nodeId, value);

    const eventEngine = getEventEngine();
    if (eventEngine) {
      eventEngine.executeNodeEvents(nodeId, "onChange", { value });
    }
  };

  const handleButtonClick = (nodeId: string, label: string) => {
    addHistoryEntry(`ボタン "${label}" がクリックされました`);
    setConsoleLog(prev => [
      ...prev,
      {
        type: "event",
        message: `ボタン "${label}" がクリックされました`,
        timestamp: new Date(),
      },
    ]);

    const eventEngine = getEventEngine();
    if (eventEngine) {
      eventEngine.executeNodeEvents(nodeId, "onClick");
    }
  };

  const resetPreview = () => {
    setIsResetting(true);
    resetData();
    setConsoleLog([
      {
        type: "info",
        message: "プレビューがリセットされました",
        timestamp: new Date(),
      },
    ]);
    setTimeout(() => setIsResetting(false), 500);
  };

  const clearConsole = () => {
    setConsoleLog([]);
  };

  const renderComponent = (node: Node) => {
    const { componentType, label, props = {} } = node.data;
    const { color = "#3B82F6", size = "md", variant = "primary" } = props;
    const currentValue = previewData.nodeValues[node.id] || "";

    const commonStyle = {
      position: "absolute" as const,
      left: node.position.x,
      top: node.position.y,
    };

    switch (componentType) {
      case "button":
        return (
          <div key={node.id} style={commonStyle}>
            <Button
              variant={variant}
              size={size}
              style={color !== "#3B82F6" ? { backgroundColor: color } : undefined}
              onClick={() => handleButtonClick(node.id, label)}
              className={isResetting ? "animate-pulse" : ""}
            >
              {label}
            </Button>
          </div>
        );

      case "text":
        const textProps = node.data.props || {};
        const textEngine = getEventEngine();
        let displayText = textProps.text || label;
        
        // Check if the node has a text property that needs evaluation
        if (textEngine && textProps.text) {
          displayText = textEngine.evaluateExpression(textProps.text);
        }
        
        return (
          <div key={node.id} style={commonStyle}>
            <Text
              variant="body"
              size={size}
              style={color !== "#3B82F6" ? { color } : undefined}
              className={isResetting ? "animate-pulse" : ""}
            >
              {displayText}
            </Text>
          </div>
        );

      case "input":
        const inputProps = node.data.props || {};
        const eventEngine = getEventEngine();
        let inputValue = currentValue;
        
        // Check if the node has a value property that needs evaluation
        if (eventEngine && inputProps.value) {
          inputValue = eventEngine.evaluateExpression(inputProps.value);
        }
        
        return (
          <div key={node.id} style={commonStyle}>
            <Input
              variant="default"
              size={size}
              placeholder={inputProps.placeholder || label}
              value={inputValue}
              onChange={(e) => handleInputChange(node.id, e.target.value)}
              style={color !== "#3B82F6" ? { borderColor: color } : undefined}
              className={isResetting ? "animate-pulse" : ""}
            />
          </div>
        );

      case "list":
        const listProps = node.data.props || {};
        const listEngine = getEventEngine();
        let items: Array<{ id: string; text: string; completed?: boolean }> = [];
        
        if (listEngine && listProps.arrayKey) {
          const arrayValue = listEngine.getVariable(listProps.arrayKey);
          if (Array.isArray(arrayValue)) {
            items = arrayValue.map((item: unknown, index: number) => {
              if (
                typeof item === "object" && 
                item !== null && 
                "id" in item && 
                "text" in item &&
                typeof (item as Record<string, unknown>).id === "string" &&
                typeof (item as Record<string, unknown>).text === "string"
              ) {
                return {
                  id: (item as Record<string, unknown>).id as string,
                  text: (item as Record<string, unknown>).text as string,
                  completed: "completed" in item && typeof (item as Record<string, unknown>).completed === "boolean" 
                    ? (item as Record<string, unknown>).completed as boolean 
                    : undefined
                };
              }
              return {
                id: index.toString(),
                text: String(item),
                completed: false
              };
            });
          }
        }
        
        return (
          <div key={node.id} style={commonStyle}>
            <div className="bg-white p-4 rounded border shadow-sm min-w-[200px] max-w-[400px]">
              <div className="text-xs text-gray-500 mb-2">{label}</div>
              {items.length === 0 ? (
                <div className="text-gray-900 text-sm p-4 text-center">
                  {listProps.emptyMessage || "アイテムがありません"}
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center">
                        <span className={`flex-1 text-gray-900 ${item.completed ? "line-through" : ""}`}>
                          {item.text}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div
            key={node.id}
            className="p-2 bg-gray-100 border border-gray-300 rounded"
            style={commonStyle}
          >
            {label || "Unknown Component"}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-black flex flex-col">
      {/* Preview Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">プレビュー</h2>
          <p className="text-sm text-gray-300">作成したアプリの動作を確認できます</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
          >
            {showDebugPanel ? "デバッグを隠す" : "デバッグを表示"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetPreview}
            disabled={isResetting}
          >
            {isResetting ? "リセット中..." : "リセット"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Preview Area */}
        <div className={`${showDebugPanel ? "flex-1" : "w-full"} relative bg-white overflow-hidden`}>
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🎨</div>
                <Text variant="title" className="mb-2 text-black">まだコンポーネントがありません</Text>
                <Text variant="caption" className="text-gray-700">左のパレットからコンポーネントを追加してください</Text>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full p-4">
              {nodes.map(renderComponent)}
            </div>
          )}

          {/* Preview Status */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span>プレビューモード</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {nodes.length}個のコンポーネント
              </div>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
            {/* Debug Header */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <Text variant="subtitle" className="text-white">デバッグパネル</Text>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearConsole}
                  className="text-gray-300 hover:text-white"
                >
                  クリア
                </Button>
              </div>
            </div>

            {/* Variables */}
            <div className="px-4 py-3 border-b border-gray-700">
              <Text variant="caption" weight="semibold" className="mb-2 text-white">プロジェクト変数</Text>
              {Object.keys(previewData.variables).length === 0 ? (
                <Text variant="caption" className="text-gray-400">変数なし</Text>
              ) : (
                <div className="space-y-1">
                  {Object.entries(previewData.variables).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="font-mono text-gray-300">{key}:</span>
                      <span className="font-mono text-blue-400">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Node Values */}
            <div className="px-4 py-3 border-b border-gray-700">
              <Text variant="caption" weight="semibold" className="mb-2 text-white">ノード値</Text>
              {Object.keys(previewData.nodeValues).length === 0 ? (
                <Text variant="caption" className="text-gray-400">値なし</Text>
              ) : (
                <div className="space-y-1">
                  {Object.entries(previewData.nodeValues).map(([nodeId, value]) => (
                    <div key={nodeId} className="text-xs">
                      <div className="font-mono text-gray-300">{nodeId}:</div>
                      <div className="font-mono text-green-400 ml-2">&quot;{value}&quot;</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Console */}
            <div className="flex-1 flex flex-col">
              <div className="px-4 py-2 border-b border-gray-700">
                <Text variant="caption" weight="semibold" className="text-white">イベントログ</Text>
              </div>
              <div 
                ref={consoleRef}
                className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
              >
                {consoleLog.length === 0 ? (
                  <Text variant="caption" className="text-gray-400">ログなし</Text>
                ) : (
                  consoleLog.map((log, index) => (
                    <div key={index} className="text-xs border-l-2 pl-2" style={{
                      borderColor: log.type === "error" ? "#ef4444" : log.type === "event" ? "#10b981" : "#6b7280"
                    }}>
                      <div className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${
                          log.type === "error" ? "bg-red-500" : 
                          log.type === "event" ? "bg-green-500" : "bg-gray-400"
                        }`}></span>
                        <span className="text-gray-400">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-gray-200">
                        {log.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}