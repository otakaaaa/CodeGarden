import { EventAction, NodeEvent } from "./schemas";

// イベント実行コンテキスト
export interface EventContext {
  variables: Record<string, unknown>;
  nodes: Record<string, unknown>;
  onVariableChange?: (name: string, value: unknown) => void;
  onNodeUpdate?: (nodeId: string, updates: unknown) => void;
  onShowAlert?: (message: string) => void;
}

// イベントエンジンクラス
export class EventEngine {
  private context: EventContext;

  constructor(context: EventContext) {
    this.context = context;
  }

  // コンテキストを更新
  updateContext(newContext: Partial<EventContext>) {
    this.context = { ...this.context, ...newContext };
  }

  // 変数の値を取得
  getVariable(name: string): unknown {
    return this.context.variables[name];
  }

  // 変数の値を設定
  setVariable(name: string, value: unknown) {
    this.context.variables[name] = value;
    this.context.onVariableChange?.(name, value);
  }

  // ノードの値を取得
  getNodeValue(nodeId: string): unknown {
    const node = this.context.nodes[nodeId] as Record<string, unknown> | undefined;
    return node?.value;
  }

  // ノードの値を設定
  setNodeValue(nodeId: string, value: unknown) {
    const currentNode = this.context.nodes[nodeId] as Record<string, unknown> | undefined;
    this.context.nodes[nodeId] = {
      ...currentNode,
      value,
    };
    this.context.onNodeUpdate?.(nodeId, { value });
  }

  // ノードのテキスト/ラベルを設定
  setNodeText(nodeId: string, text: string) {
    const currentNode = this.context.nodes[nodeId] as Record<string, unknown> | undefined;
    this.context.nodes[nodeId] = {
      ...currentNode,
      label: text,
    };
    this.context.onNodeUpdate?.(nodeId, { label: text });
  }

  // アラート表示
  showAlert(message: string) {
    this.context.onShowAlert?.(message);
  }

  // 単一のアクションを実行
  executeAction(action: EventAction, sourceNodeId?: string): void {
    try {
      switch (action.type) {
        case "setText":
          if (action.target) {
            this.setNodeText(action.target, action.value);
          } else if (sourceNodeId) {
            this.setNodeText(sourceNodeId, action.value);
          }
          break;

        case "setVariable":
          if (action.target) {
            // 特殊な値の処理
            let value: unknown = action.value;
            if (action.value === "input_value" && sourceNodeId) {
              value = this.getNodeValue(sourceNodeId);
            } else {
              value = this.evaluateExpression(action.value);
            }
            this.setVariable(action.target, value);
          }
          break;

        case "showAlert":
          this.showAlert(this.evaluateExpression(action.value));
          break;

        case "pushToArray":
          if (action.arrayKey) {
            const array = this.getVariable(action.arrayKey) as unknown[];
            if (!Array.isArray(array)) {
              this.setVariable(action.arrayKey, []);
            }
            const currentArray = (this.getVariable(action.arrayKey) as unknown[]) || [];
            
            // 新しいアイテムの値を評価
            let itemValue: unknown = action.value;
            if (action.value === "input_value" && sourceNodeId) {
              itemValue = this.getNodeValue(sourceNodeId);
            } else {
              itemValue = this.evaluateExpression(action.value);
            }
            
            // TODOアイテムの場合、オブジェクトとして追加
            if (action.itemKey) {
              const newItem = {
                id: Date.now().toString(),
                text: itemValue,
                completed: false
              };
              this.setVariable(action.arrayKey, [...currentArray, newItem]);
            } else {
              this.setVariable(action.arrayKey, [...currentArray, itemValue]);
            }
          }
          break;

        case "removeFromArray":
          if (action.arrayKey && action.value) {
            const array = this.getVariable(action.arrayKey) as unknown[];
            if (Array.isArray(array)) {
              const filteredArray = array.filter((item: unknown) => {
                if (typeof item === "object" && item !== null && "id" in item) {
                  return (item as { id: string }).id !== action.value;
                }
                return item !== action.value;
              });
              this.setVariable(action.arrayKey, filteredArray);
            }
          }
          break;

        case "clearArray":
          if (action.arrayKey) {
            this.setVariable(action.arrayKey, []);
          }
          break;

        default:
          console.warn(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Error executing action:`, error);
    }
  }

  // ノードイベントを実行
  executeEvent(event: NodeEvent, sourceNodeId: string, eventData?: Record<string, unknown>): void {
    try {
      console.log(`Executing ${event.type} event on node ${sourceNodeId}`);
      
      // イベントタイプに応じた前処理
      switch (event.type) {
        case "onChange":
          // 入力値を変数に保存
          if (eventData?.value !== undefined) {
            this.setNodeValue(sourceNodeId, eventData.value);
          }
          break;
      }

      // アクションを実行
      this.executeAction(event.action, sourceNodeId);
    } catch (error) {
      console.error(`Error executing event:`, error);
    }
  }

  // ノードの全イベントを実行
  executeNodeEvents(
    nodeId: string, 
    eventType: "onClick" | "onChange" | "onSubmit",
    eventData?: Record<string, unknown>
  ): void {
    const node = this.context.nodes[nodeId] as Record<string, unknown> | undefined;
    const events = node?.events as NodeEvent[] | undefined;
    if (!events) return;

    const matchingEvents = events.filter(
      (event: NodeEvent) => event.type === eventType
    );

    matchingEvents.forEach((event: NodeEvent) => {
      this.executeEvent(event, nodeId, eventData);
    });
  }

  // 式の評価（変数の置換など）
  evaluateExpression(expression: string): string {
    let result = expression;
    
    // ${variableName} または ${variableName.property} 形式の変数を置換
    result = result.replace(/\$\{([^}]+)\}/g, (match, varPath) => {
      const parts = varPath.trim().split('.');
      let value: unknown = this.getVariable(parts[0]);
      
      // ドット記法でプロパティにアクセス
      for (let i = 1; i < parts.length && value !== undefined && value !== null; i++) {
        if (typeof value === 'object') {
          value = (value as Record<string, unknown>)[parts[i]];
        }
      }
      
      return value !== undefined ? String(value) : match;
    });

    // #{nodeId} 形式のノード値を置換
    result = result.replace(/#\{([^}]+)\}/g, (match, nodeId) => {
      const value = this.getNodeValue(nodeId.trim());
      return value !== undefined ? String(value) : match;
    });

    return result;
  }

  // デバッグ情報を取得
  getDebugInfo(): EventContext {
    return { ...this.context };
  }
}

// グローバルイベントエンジンインスタンス
let globalEventEngine: EventEngine | null = null;

// グローバルイベントエンジンを初期化
export function initializeEventEngine(context: EventContext): EventEngine {
  globalEventEngine = new EventEngine(context);
  return globalEventEngine;
}

// グローバルイベントエンジンを取得
export function getEventEngine(): EventEngine | null {
  return globalEventEngine;
}

// グローバルイベントエンジンをリセット
export function resetEventEngine(): void {
  globalEventEngine = null;
}