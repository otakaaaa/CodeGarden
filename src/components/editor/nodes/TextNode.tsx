import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Text from "@/components/ui/Text";

interface TextNodeData {
  label: string;
  componentType: "text";
  props?: {
    variant?: "body" | "caption" | "subtitle" | "title" | "heading";
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: string;
    align?: "left" | "center" | "right" | "justify";
  };
}

export interface TextNodeProps extends NodeProps {
  data: TextNodeData;
}

const TextNode = memo(({ data, selected }: TextNodeProps) => {
  const { label, props = {} } = data;
  const { 
    variant = "body", 
    size, 
    weight = "normal", 
    color,
    align = "left"
  } = props;

  return (
    <div className={`relative ${selected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-400"
      />
      
      <div className="bg-white p-2 rounded border shadow-sm min-w-20">
        <Text
          variant={variant}
          size={size}
          weight={weight}
          align={align}
          style={color ? { color } : undefined}
        >
          {label}
        </Text>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-400"
      />
    </div>
  );
});

TextNode.displayName = "TextNode";

export default TextNode;