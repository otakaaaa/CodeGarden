import { ProjectData } from "./schemas";

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  components: number;
  data: ProjectData;
}

export const templateData: Record<string, ProjectData> = {
  "hello-world": {
    nodes: [
      {
        id: "text-1",
        type: "text",
        position: { x: 100, y: 100 },
        data: {
          label: "Hello Worldテキスト",
          props: {
            text: "Hello, World!",
            fontSize: 24,
            color: "#000000",
            fontWeight: "bold",
          },
        },
      },
      {
        id: "button-1",
        type: "button",
        position: { x: 100, y: 200 },
        data: {
          label: "クリックボタン",
          props: {
            text: "クリックしてね",
            variant: "primary",
          },
          events: [
            {
              type: "onClick",
              action: {
                type: "showAlert",
                value: "Hello, World!",
              },
            },
          ],
        },
      },
    ],
    edges: [],
    settings: {
      theme: "light",
      previewMode: false,
      variables: {},
    },
  },
  "form-example": {
    nodes: [
      {
        id: "text-1",
        type: "text",
        position: { x: 100, y: 50 },
        data: {
          label: "タイトル",
          props: {
            text: "ユーザー登録",
            fontSize: 20,
            color: "#000000",
            fontWeight: "bold",
          },
        },
      },
      {
        id: "input-1",
        type: "input",
        position: { x: 100, y: 120 },
        data: {
          label: "名前入力",
          props: {
            placeholder: "お名前を入力してください",
            type: "text",
            required: true,
          },
          events: [
            {
              type: "onChange",
              action: {
                type: "setVariable",
                target: "userName",
                value: "input_value",
              },
            },
          ],
        },
      },
      {
        id: "input-2",
        type: "input",
        position: { x: 100, y: 200 },
        data: {
          label: "メール入力",
          props: {
            placeholder: "メールアドレスを入力してください",
            type: "email",
            required: true,
          },
          events: [
            {
              type: "onChange",
              action: {
                type: "setVariable",
                target: "userEmail",
                value: "input_value",
              },
            },
          ],
        },
      },
      {
        id: "button-1",
        type: "button",
        position: { x: 100, y: 280 },
        data: {
          label: "登録ボタン",
          props: {
            text: "登録する",
            variant: "primary",
          },
          events: [
            {
              type: "onClick",
              action: {
                type: "showAlert",
                value: "登録完了しました！",
              },
            },
          ],
        },
      },
    ],
    edges: [],
    settings: {
      theme: "light",
      previewMode: false,
      variables: {
        userName: "",
        userEmail: "",
      },
    },
  },
  "interactive-demo": {
    nodes: [
      {
        id: "text-1",
        type: "text",
        position: { x: 100, y: 50 },
        data: {
          label: "タイトル",
          props: {
            text: "カウンターアプリ",
            fontSize: 20,
            color: "#000000",
            fontWeight: "bold",
          },
        },
      },
      {
        id: "text-2",
        type: "text",
        position: { x: 100, y: 120 },
        data: {
          label: "カウンター表示",
          props: {
            text: "0",
            fontSize: 32,
            color: "#0066cc",
            fontWeight: "bold",
          },
        },
      },
      {
        id: "button-1",
        type: "button",
        position: { x: 50, y: 200 },
        data: {
          label: "減少ボタン",
          props: {
            text: "-",
            variant: "secondary",
          },
          events: [
            {
              type: "onClick",
              action: {
                type: "setVariable",
                target: "counter",
                value: "-1",
              },
            },
          ],
        },
      },
      {
        id: "button-2",
        type: "button",
        position: { x: 120, y: 200 },
        data: {
          label: "増加ボタン",
          props: {
            text: "+",
            variant: "primary",
          },
          events: [
            {
              type: "onClick",
              action: {
                type: "setVariable",
                target: "counter",
                value: "1",
              },
            },
          ],
        },
      },
      {
        id: "button-3",
        type: "button",
        position: { x: 190, y: 200 },
        data: {
          label: "リセットボタン",
          props: {
            text: "リセット",
            variant: "ghost",
          },
          events: [
            {
              type: "onClick",
              action: {
                type: "setVariable",
                target: "counter",
                value: "0",
              },
            },
          ],
        },
      },
      {
        id: "text-3",
        type: "text",
        position: { x: 100, y: 280 },
        data: {
          label: "説明文",
          props: {
            text: "ボタンを押してカウンターを操作してみよう",
            fontSize: 14,
            color: "#666666",
            fontWeight: "normal",
          },
        },
      },
    ],
    edges: [],
    settings: {
      theme: "light",
      previewMode: false,
      variables: {
        counter: 0,
      },
    },
  },
};

export function getTemplateData(templateId: string): ProjectData | null {
  return templateData[templateId] || null;
}