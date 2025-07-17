import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeEvent } from "@/lib/schemas";
import { getEventEngine } from "@/lib/eventEngine";
import Input from "@/components/ui/Input";

interface InputNodeData {
  label: string;
  componentType: "input";
  props?: {
    variant?: "default" | "filled" | "flushed" | "unstyled";
    size?: "sm" | "md" | "lg";
    type?: "text" | "email" | "password" | "number" | "tel" | "url";
    placeholder?: string;
    color?: string;
  };
  events?: NodeEvent[];
}

export interface InputNodeProps extends NodeProps {
  data: InputNodeData;
}

const InputNode = memo(({ data, selected, id }: InputNodeProps) => {
  const { label, props = {}, events = [] } = data;
  const { 
    variant = "default", 
    size = "md", 
    type = "text",
    placeholder,
    color
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventEngine = getEventEngine();
    if (eventEngine) {
      eventEngine.executeNodeEvents(id, "onChange", { value: e.target.value });
    } else {
      console.log(`Input changed: ${e.target.value} (No event engine)`);
    }
  };

  return (
    <div className={`relative ${selected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-400"
      />
      
      <div className="bg-white p-2 rounded border shadow-sm">
        <Input
          variant={variant}
          size={size}
          type={type}
          placeholder={placeholder || label}
          style={color ? { borderColor: color } : undefined}
          onChange={handleChange}
        />
        {events.length > 0 && (
          <div className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
            ⚡
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-400"
      />
    </div>
  );
});

InputNode.displayName = "InputNode";

export default InputNode;