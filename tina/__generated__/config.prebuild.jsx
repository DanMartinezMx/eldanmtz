// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.HEAD || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "content/posts",
        format: "mdx",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => values?.title?.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "") || ""
          }
        },
        fields: [
          { name: "title", type: "string", required: true, isTitle: true },
          { name: "createdAt", type: "datetime", required: true },
          { name: "updatedAt", type: "datetime" },
          { name: "description", type: "string", required: true, ui: { component: "textarea" } },
          {
            name: "category",
            type: "string",
            required: true,
            options: [
              "Recomendaciones",
              "Random",
              "Personal",
              "Cine y TV",
              "Juegos",
              "Viajes",
              "Tech",
              "Foodies",
              "Coding",
              "Connie"
            ]
          },
          { name: "tags", type: "string", list: true },
          { name: "draft", type: "boolean" },
          { name: "image", type: "string" },
          { name: "body", type: "rich-text", isBody: true }
        ]
      },
      {
        name: "microblog",
        label: "Microblog",
        path: "content/microblog",
        format: "mdx",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
              return `${date}-${Math.random().toString(36).slice(2, 6)}`;
            }
          }
        },
        fields: [
          { name: "title", type: "string", required: true, isTitle: true },
          { name: "createdAt", type: "datetime", required: true },
          {
            name: "body",
            type: "string",
            ui: { component: "textarea" },
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
