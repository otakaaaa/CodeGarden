import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeEvent } from "@/lib/schemas";
import { getEventEngine } from "@/lib/eventEngine";
import Button from "@/components/ui/Button";

interface ButtonNodeData {
  label: string;
  componentType: "button";
  props?: {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    color?: string;
  };
  events?: NodeEvent[];
}

export interface ButtonNodeProps extends NodeProps {
  data: ButtonNodeData;
}

const ButtonNode = memo(({ data, selected, id }: ButtonNodeProps) => {
  const { label, props = {}, events = [] } = data;
  const { variant = "primary", size = "md", color } = props;

  const handleClick = () => {
    const eventEngine = getEventEngine();
    if (eventEngine) {
      eventEngine.executeNodeEvents(id, "onClick");
    } else {
      console.log(`Button clicked: ${label} (No event engine)`);
    }
  };

  return (
    <div className={`relative ${selected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-400"
      />
      
      <Button
        variant={variant}
        size={size}
        style={color ? { backgroundColor: color } : undefined}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {label}
        {events.length > 0 && (
          <span className="ml-2 text-xs opacity-75">⚡</span>
        )}
      </Button>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-400"
      />
    </div>
  );
});

ButtonNode.displayName = "ButtonNode";

export default ButtonNode;