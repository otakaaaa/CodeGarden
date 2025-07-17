"use client";

import { useState, useEffect } from "react";
import { NodeEvent, EventAction } from "@/lib/schemas";
import { Button, Input, Text } from "@/components/ui";

interface EventConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (events: NodeEvent[]) => void;
  nodeId: string;
  nodeType: string;
  initialEvents?: NodeEvent[];
  availableNodes: Array<{ id: string; label: string; type: string }>;
}

export default function EventConfigModal({
  isOpen,
  onClose,
  onSave,
  nodeId,
  nodeType,
  initialEvents = [],
  availableNodes,
}: EventConfigModalProps) {
  const [events, setEvents] = useState<NodeEvent[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const getAvailableEventTypes = () => {
    switch (nodeType) {
      case "button":
        return ["onClick"];
      case "input":
        return ["onChange", "onSubmit"];
      case "text":
        return []; // テキストは通常イベントを持たない
      default:
        return ["onClick"];
    }
  };

  const addEvent = () => {
    const availableTypes = getAvailableEventTypes();
    if (availableTypes.length === 0) return;

    const newEvent: NodeEvent = {
      type: availableTypes[0] as "onClick" | "onChange" | "onSubmit",
      action: {
        type: "showAlert",
        value: "こんにちは！",
      },
    };

    setEvents([...events, newEvent]);
  };

  const updateEvent = (index: number, updatedEvent: NodeEvent) => {
    const newEvents = [...events];
    newEvents[index] = updatedEvent;
    setEvents(newEvents);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEventAction = (
    eventIndex: number,
    actionUpdates: Partial<EventAction>
  ) => {
    const event = events[eventIndex];
    const updatedEvent: NodeEvent = {
      ...event,
      action: { ...event.action, ...actionUpdates },
    };
    updateEvent(eventIndex, updatedEvent);
  };

  const handleSave = () => {
    onSave(events);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="title">イベント設定</Text>
              <Text variant="caption" color="muted">
                ノード: {nodeId} ({nodeType})
              </Text>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Text color="muted">イベントが設定されていません</Text>
              <Text variant="caption" color="muted" className="mt-2">
                「イベントを追加」ボタンでイベントを追加してください
              </Text>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Text variant="subtitle">イベント {eventIndex + 1}</Text>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeEvent(eventIndex)}
                    >
                      削除
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* イベントタイプ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        イベントタイプ
                      </label>
                      <select
                        value={event.type}
                        onChange={(e) =>
                          updateEvent(eventIndex, {
                            ...event,
                            type: e.target.value as "onClick" | "onChange" | "onSubmit",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {getAvailableEventTypes().map((type) => (
                          <option key={type} value={type}>
                            {type === "onClick"
                              ? "クリック時"
                              : type === "onChange"
                              ? "入力変更時"
                              : "送信時"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* アクションタイプ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        アクション
                      </label>
                      <select
                        value={event.action.type}
                        onChange={(e) =>
                          updateEventAction(eventIndex, {
                            type: e.target.value as "setText" | "setVariable" | "showAlert",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="showAlert">アラート表示</option>
                        <option value="setText">テキスト設定</option>
                        <option value="setVariable">変数設定</option>
                      </select>
                    </div>

                    {/* ターゲット（setText、setVariableの場合） */}
                    {(event.action.type === "setText" || event.action.type === "setVariable") && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {event.action.type === "setText" ? "対象ノード" : "変数名"}
                        </label>
                        {event.action.type === "setText" ? (
                          <select
                            value={event.action.target || ""}
                            onChange={(e) =>
                              updateEventAction(eventIndex, { target: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">このノード</option>
                            {availableNodes
                              .filter((node) => node.type === "text" || node.type === "input")
                              .map((node) => (
                                <option key={node.id} value={node.id}>
                                  {node.label} ({node.id})
                                </option>
                              ))}
                          </select>
                        ) : (
                          <Input
                            value={event.action.target || ""}
                            onChange={(e) =>
                              updateEventAction(eventIndex, { target: e.target.value })
                            }
                            placeholder="変数名を入力"
                          />
                        )}
                      </div>
                    )}

                    {/* 値 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {event.action.type === "showAlert"
                          ? "メッセージ"
                          : event.action.type === "setText"
                          ? "設定するテキスト"
                          : "設定する値"}
                      </label>
                      <Input
                        value={event.action.value}
                        onChange={(e) =>
                          updateEventAction(eventIndex, { value: e.target.value })
                        }
                        placeholder={
                          event.action.type === "showAlert"
                            ? "表示するメッセージ"
                            : event.action.type === "setText"
                            ? "テキスト（${変数名}、#{ノードID}が使用可能）"
                            : "値"
                        }
                      />
                      <Text variant="caption" color="muted" className="mt-1">
                        ${"{変数名}"} でプロジェクト変数、#{"{ノードID}"} でノードの値を参照できます
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={addEvent}
            disabled={getAvailableEventTypes().length === 0}
          >
            イベントを追加
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </div>
    </div>
  );
}