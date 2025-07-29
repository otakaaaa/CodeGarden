import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import List from "@/components/ui/List";
import { getEventEngine } from "@/lib/eventEngine";

interface ListNodeData {
  label: string;
  componentType: "list";
  props?: {
    arrayKey?: string;
    emptyMessage?: string;
  };
}

export interface ListNodeProps extends NodeProps {
  data: ListNodeData;
}

const ListNode = memo(({ data, selected }: ListNodeProps) => {
  const { label, props = {} } = data;
  const { arrayKey = "items", emptyMessage = "アイテムがありません" } = props;

  const eventEngine = getEventEngine();
  let items: Array<{ id: string; text: string; completed?: boolean }> = [];
  
  if (eventEngine && arrayKey) {
    const arrayValue = eventEngine.getVariable(arrayKey);
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
    <div className={`relative ${selected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-400"
      />
      
      <div className="bg-white p-4 rounded border shadow-sm min-w-[200px] max-w-[400px]">
        <div className="text-xs text-gray-500 mb-2">{label}</div>
        <List items={items} emptyMessage={emptyMessage} />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-400"
      />
    </div>
  );
});

ListNode.displayName = "ListNode";

export default ListNode;