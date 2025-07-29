import { ReactNode } from "react";

interface ListProps {
  items: Array<{ id: string; text: string; completed?: boolean }>;
  renderItem?: (item: { id: string; text: string; completed?: boolean }, index: number) => ReactNode;
  className?: string;
  emptyMessage?: string;
}

export default function List({ items, renderItem, className = "", emptyMessage = "アイテムがありません" }: ListProps) {
  if (!items || items.length === 0) {
    return (
      <div className={`text-gray-900 text-sm p-4 text-center ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <li key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          {renderItem ? (
            renderItem(item, index)
          ) : (
            <div className="flex items-center">
              <span className={`flex-1 text-gray-900 ${item.completed ? "line-through" : ""}`}>
                {item.text}
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}