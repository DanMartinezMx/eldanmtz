// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
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
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "description", label: "Description" },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              "Tech",
              "Coding",
              "Gaming",
              "Foodies",
              "Cine y TV",
              "Viajes",
              "Personal",
              "Random",
              "Recomendaciones",
              "Connie"
            ]
          },
          { type: "datetime", name: "createdAt", label: "Created At", required: true },
          { type: "image", name: "image", label: "Cover Image" },
          { type: "boolean", name: "draft", label: "Draft" },
          { type: "rich-text", name: "body", label: "Body", isBody: true }
        ]
      },
      {
        name: "microblog",
        label: "Microblog",
        path: "content/microblog",
        format: "mdx",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "createdAt", label: "Created At", required: true },
          { type: "rich-text", name: "body", label: "Body", isBody: true }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
