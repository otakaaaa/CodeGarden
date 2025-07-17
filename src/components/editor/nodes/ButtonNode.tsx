import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Button from "@/components/ui/Button";

interface ButtonNodeData {
  label: string;
  componentType: "button";
  props?: {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    color?: string;
  };
  events?: Array<{
    type: "onClick";
    action: {
      type: string;
      value: string;
      target?: string;
    };
  }>;
}

export interface ButtonNodeProps extends NodeProps {
  data: ButtonNodeData;
}

const ButtonNode = memo(({ data, selected }: ButtonNodeProps) => {
  const { label, props = {} } = data;
  const { variant = "primary", size = "md", color } = props;

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
        onClick={() => {
          // プレビューモードでのみイベントを実行
          console.log(`Button clicked: ${label}`);
        }}
      >
        {label}
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