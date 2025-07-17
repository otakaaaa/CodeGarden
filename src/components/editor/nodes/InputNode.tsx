import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
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
  events?: Array<{
    type: "onChange" | "onFocus" | "onBlur";
    action: {
      type: string;
      value: string;
      target?: string;
    };
  }>;
}

export interface InputNodeProps extends NodeProps {
  data: InputNodeData;
}

const InputNode = memo(({ data, selected }: InputNodeProps) => {
  const { label, props = {} } = data;
  const { 
    variant = "default", 
    size = "md", 
    type = "text",
    placeholder,
    color
  } = props;

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
          onChange={(e) => {
            // プレビューモードでのみイベントを実行
            console.log(`Input changed: ${e.target.value}`);
          }}
        />
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