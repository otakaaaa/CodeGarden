"use client";

interface ComponentPaletteProps {
  onAddComponent: (type: string) => void;
}

export default function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const components = [
    {
      type: "button",
      name: "ボタン",
      icon: "🔘",
      description: "クリック可能なボタン",
    },
    {
      type: "text",
      name: "テキスト", 
      icon: "📝",
      description: "テキスト表示",
    },
    {
      type: "input",
      name: "入力欄",
      icon: "📝",
      description: "テキスト入力欄",
    },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-white mb-4">コンポーネント</h2>
      
      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.type}
            className="bg-gray-800 rounded-lg border border-gray-600 p-3 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => onAddComponent(component.type)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{component.icon}</span>
              <div>
                <h3 className="font-medium text-white">{component.name}</h3>
                <p className="text-sm text-gray-300">{component.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-md font-semibold text-white mb-3">使い方</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>1. コンポーネントをクリックして追加</p>
          <p>2. 編集エリアで位置を調整</p>
          <p>3. 右パネルでプロパティを設定</p>
        </div>
      </div>
    </div>
  );
}