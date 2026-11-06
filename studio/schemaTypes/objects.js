// Small building blocks reused across the site's documents.
import { defineType, defineField, defineArrayMember } from "sanity";

export const MARKS_HELP = "Tip: wrap words in *single stars* for the highlight/italic style, or **double stars** for bold.";

// Helpers that keep the page schemas short
export const str = (name, title, extra = {}) => defineField({ name, title, type: "string", ...extra });
export const txt = (name, title, extra = {}) => defineField({ name, title, type: "text", rows: 3, ...extra });
export const photo = (name, title, extra = {}) => defineField({ name, title, type: "photo", ...extra });
export const list = (name, title, extra = {}) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })], ...extra });

// Names must match the icons in cms/icons.js
export const ICONS = [
  ["book", "Open book"], ["book-light", "Book with light"], ["stethoscope", "Stethoscope"],
  ["shield-plus", "Shield with cross"], ["shield-check", "Shield with tick"], ["net", "Mosquito net"],
  ["chat-heart", "Speech bubble with heart"], ["girl", "Girl / person"], ["phone-plus", "Phone with cross"],
  ["heart", "Heart"], ["heart-plus", "Heart with cross"], ["sprout", "Sprout"], ["sprout-ground", "Sprout in ground"],
  ["rings", "Two rings"], ["rings-plus", "Two rings joined"], ["scales", "Scales"], ["hand-heart", "Hand holding heart"],
  ["group", "Group of people"], ["home-heart", "Home with heart"], ["medal", "Medal"], ["gift", "Gift"],
].map(([value, title]) => ({ value, title }));

export const icon = (name = "icon", title = "Icon") =>
  defineField({ name, title, type: "string", options: { list: ICONS }, validation: (r) => r.required() });

export const photoType = defineType({
  name: "photo",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  description: "Use the hotspot to mark the most important part of the photo, so crops keep it in view.",
  fields: [
    defineField({
      name: "alt",
      title: "Description for screen readers and search",
      type: "string",
      description: "Say what is in the photo, e.g. \"A volunteer hands sanitary pads to a schoolgirl in Epe.\"",
      validation: (r) => r.required().warning("Every photo needs a description."),
    }),
  ],
});

export const linkType = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    str("label", "Text", { validation: (r) => r.required() }),
    str("href", "Goes to", {
      description: "A section on the page (#get-support, #contact…), a full web address, or mailto:/tel:.",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const buttonType = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    str("label", "Text", { validation: (r) => r.required() }),
    str("href", "Goes to", { validation: (r) => r.required() }),
    str("style", "Style", {
      options: { list: [{ title: "Green (main)", value: "primary" }, { title: "Outline", value: "secondary" }, { title: "Gold (donate)", value: "donate" }], layout: "radio" },
      initialValue: "primary",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const statType = defineType({
  name: "stat",
  title: "Figure",
  type: "object",
  fields: [
    str("prefix", "Small word before the number", { description: "e.g. \"Over\". Leave empty for none." }),
    defineField({ name: "number", title: "Number", type: "number", validation: (r) => r.required().min(0) }),
    str("label", "What it counts", { validation: (r) => r.required() }),
    defineField({ name: "highlight", title: "Rose colour (girls)", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { n: "number", label: "label", prefix: "prefix" },
    prepare: ({ n, label, prefix }) => ({ title: `${prefix ? prefix + " " : ""}${n?.toLocaleString("en-GB") ?? ""} ${label ?? ""}` }),
  },
});

export const faqItemType = defineType({
  name: "faqItem",
  title: "Question",
  type: "object",
  fields: [
    str("question", "Question", {
      description: "Write it the way people would ask it, e.g. \"How can I get sanitary pads for my school?\"",
      validation: (r) => r.required(),
    }),
    txt("answer", "Answer", {
      rows: 5,
      description: "Answer in the first sentence, then add detail. 40 to 80 words works best for search and AI answers.",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const eventType = defineType({
  name: "outreachEvent",
  title: "Outreach",
  type: "object",
  fields: [
    str("title", "Name", { description: "e.g. \"Menstrual health outreach for schoolgirls\"", validation: (r) => r.required() }),
    defineField({ name: "start", title: "Starts", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "end", title: "Ends (optional)", type: "datetime" }),
    str("place", "Place", { description: "e.g. \"Epe Girls' Senior High School\"", validation: (r) => r.required() }),
    str("town", "Town and state", { description: "e.g. \"Epe, Lagos State\"" }),
    txt("description", "Who can come and what happens"),
  ],
  preview: { select: { title: "title", subtitle: "start" } },
});
