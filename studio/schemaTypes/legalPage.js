import { defineType, defineField, defineArrayMember } from "sanity";
import { str, txt } from "./objects.js";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    str("title", "Title", { validation: (r) => r.required() }),
    txt("description", "Description in Google", { rows: 2 }),
    defineField({ name: "updated", title: "Last updated", type: "date", description: "Shown on the page." }),
    defineField({
      name: "body", title: "Text", type: "array",
      of: [defineArrayMember({
        type: "block",
        styles: [{ title: "Paragraph", value: "normal" }, { title: "Heading", value: "h2" }, { title: "Small heading", value: "h3" }],
        lists: [{ title: "Bullets", value: "bullet" }, { title: "Numbers", value: "number" }],
      })],
    }),
    txt("pendingNote", "\"Being finalised\" note", { rows: 2, description: "Shown in grey below the text. Clear it once the final text is in." }),
    defineField({
      name: "hideFromSearch", title: "Hide from search engines", type: "boolean", initialValue: true,
      description: "Keep on while the text is a placeholder. Turn off when the final text is published.",
    }),
  ],
  preview: { select: { title: "title" } },
});
