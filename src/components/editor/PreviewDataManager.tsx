"use client";

import { useState, useEffect } from "react";
import { Node } from "reactflow";


export interface PreviewData {
  nodeValues: Record<string, string>;
  variables: Record<string, unknown>;
  history: Array<{
    action: string;
    timestamp: Date;
    data: unknown;
  }>;
}

export function usePreviewData(nodes: Node[]) {
  const [data, setData] = useState<PreviewData>({
    nodeValues: {},
    variables: {},
    history: [],
  });

  // ノードが変更された時にデータをリセット
  useEffect(() => {
    const nodeIds = nodes.map(node => node.id);
    const currentNodeIds = Object.keys(data.nodeValues);
    
    // 新しいノードがある場合、または削除されたノードがある場合
    if (nodeIds.length !== currentNodeIds.length || 
        !nodeIds.every(id => currentNodeIds.includes(id))) {
      const newNodeValues: Record<string, string> = {};
      nodeIds.forEach(id => {
        newNodeValues[id] = data.nodeValues[id] || "";
      });

      setData(prev => ({
        ...prev,
        nodeValues: newNodeValues,
        history: [
          ...prev.history,
          {
            action: "ノード構成が変更されました",
            timestamp: new Date(),
            data: { nodeCount: nodeIds.length },
          },
        ],
      }));
    }
  }, [nodes, data.nodeValues]);

  const updateNodeValue = (nodeId: string, value: string) => {
    setData(prev => ({
      ...prev,
      nodeValues: { ...prev.nodeValues, [nodeId]: value },
      history: [
        ...prev.history,
        {
          action: `ノード ${nodeId} の値を更新`,
          timestamp: new Date(),
          data: { nodeId, value },
        },
      ],
    }));
  };

  const updateVariable = (name: string, value: unknown) => {
    setData(prev => ({
      ...prev,
      variables: { ...prev.variables, [name]: value },
      history: [
        ...prev.history,
        {
          action: `変数 ${name} を更新`,
          timestamp: new Date(),
          data: { name, value },
        },
      ],
    }));
  };

  const addHistoryEntry = (action: string, historyData?: unknown) => {
    setData(prev => ({
      ...prev,
      history: [
        ...prev.history,
        {
          action,
          timestamp: new Date(),
          data: historyData,
        },
      ],
    }));
  };

  const resetData = () => {
    const nodeIds = nodes.map(node => node.id);
    const newNodeValues: Record<string, string> = {};
    nodeIds.forEach(id => {
      newNodeValues[id] = "";
    });

    setData({
      nodeValues: newNodeValues,
      variables: {},
      history: [
        {
          action: "プレビューデータがリセットされました",
          timestamp: new Date(),
          data: { nodeCount: nodeIds.length },
        },
      ],
    });
  };

  const exportData = () => {
    return {
      nodeValues: data.nodeValues,
      variables: data.variables,
      exportedAt: new Date().toISOString(),
    };
  };

  const importData = (importedData: Partial<PreviewData>) => {
    setData(prev => ({
      ...prev,
      ...importedData,
      history: [
        ...prev.history,
        {
          action: "データをインポートしました",
          timestamp: new Date(),
          data: importedData,
        },
      ],
    }));
  };

  return {
    data,
    updateNodeValue,
    updateVariable,
    addHistoryEntry,
    resetData,
    exportData,
    importData,
  };
}