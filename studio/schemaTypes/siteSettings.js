import { defineType, defineField, defineArrayMember } from "sanity";
import { str, txt, list, photo } from "./objects.js";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "org", title: "Organisation", default: true },
    { name: "contact", title: "Contact details" },
    { name: "header", title: "Header, banner and footer" },
    { name: "seo", title: "Search and sharing" },
    { name: "aeo", title: "AI answers" },
    { name: "forms", title: "Forms" },
  ],
  fields: [
    // Organisation
    str("orgName", "Full name", { group: "org", validation: (r) => r.required() }),
    str("shortName", "Short name", { group: "org", description: "Shown large in the header logo." }),
    str("subName", "Name second line", { group: "org", description: "Shown small under the short name." }),
    list("alternateNames", "Other names people search for", { group: "org", description: "e.g. VWIG, vwigcare." }),
    str("slogan", "Slogan", { group: "org" }),
    txt("orgDescription", "One-paragraph description", { group: "org", description: "Used by search engines in structured data." }),

    // Contact
    str("phone", "Phone (as shown)", { group: "contact", description: "e.g. +234 705 242 9995" }),
    str("whatsapp", "WhatsApp number", { group: "contact", description: "Digits only, with country code, e.g. 2347052429995" }),
    str("email", "Email", { group: "contact" }),
    str("instagram", "Instagram handle", { group: "contact", description: "Without the @, e.g. vwigcare" }),

    // Header, banner, footer
    defineField({
      name: "nav", title: "Menu links", type: "array", group: "header",
      of: [defineArrayMember({ type: "link" })],
    }),
    str("donateLabel", "Donate button text", { group: "header" }),
    str("supportLabel", "Get Support button text", { group: "header", description: "Also used for the sticky button on phones." }),
    defineField({
      name: "announcement", title: "Announcement bar", type: "object", group: "header",
      options: { collapsible: true },
      fields: [
        defineField({ name: "enabled", title: "Show the announcement bar", type: "boolean", initialValue: true }),
        str("bold", "Bold start"),
        str("text", "Rest of the message"),
      ],
    }),
    defineField({
      name: "footer", title: "Footer", type: "object", group: "header",
      fields: [
        str("mission", "Mission line"),
        str("copyright", "Copyright line"),
        str("registration", "Registered name and number", { description: "Optional, e.g. CAC registration number." }),
      ],
    }),

    // SEO
    defineField({
      name: "seo", title: "Search results and social previews", type: "object", group: "seo",
      fields: [
        str("title", "Page title in Google", { description: "About 50–60 characters.", validation: (r) => r.max(70).warning("Long titles get cut off.") }),
        txt("description", "Description in Google", { rows: 2, validation: (r) => r.max(170).warning("Long descriptions get cut off.") }),
        str("ogTitle", "Title when shared (WhatsApp, Facebook…)"),
        txt("ogDescription", "Description when shared", { rows: 2 }),
        txt("twitterDescription", "Description when shared on X/Twitter", { rows: 2 }),
        photo("ogImage", "Preview image when shared", { description: "1200 × 630 works best. Leave empty to keep the current one." }),
        str("ogImageAlt", "Preview image description"),
      ],
    }),

    // AEO
    defineField({
      name: "aeo", title: "Answer engines (ChatGPT, Perplexity, Google AI Overviews…)", type: "object", group: "aeo",
      description: "Facts that AI assistants read from the site's structured data and llms.txt. Keep them accurate and plain.",
      fields: [
        txt("summary", "Plain summary of the organisation", {
          rows: 5,
          description: "3–4 sentences: who you are, what you do, for whom, and where. AI tools often quote this word for word.",
        }),
        defineField({
          name: "areasServed", title: "Areas served", type: "array",
          of: [defineArrayMember({
            type: "object", name: "area",
            fields: [str("name", "Name"), str("kind", "Type", { options: { list: ["City", "State", "Country"] }, initialValue: "State" })],
            preview: { select: { title: "name", subtitle: "kind" } },
          })],
        }),
        list("topics", "Topics you are an authority on", { description: "e.g. Menstrual health, Period poverty, Cervical screening." }),
        defineField({ name: "foundingDate", title: "Year founded (optional)", type: "string", validation: (r) => r.regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, { name: "year" }) }),
        defineField({
          name: "allowAiTraining", title: "Allow AI companies to train on the site", type: "boolean", initialValue: true,
          description: "AI search and answer tools are always allowed (so you can be cited). Turn this off to block training-only crawlers such as GPTBot, Google-Extended and CCBot.",
        }),
      ],
    }),

    // Forms
    defineField({
      name: "forms", title: "Where form answers are sent", type: "object", group: "forms",
      description: "Web addresses from a form service (e.g. Formspree or Web3Forms). Empty means not connected yet: people are offered WhatsApp instead.",
      fields: [
        defineField({ name: "supportEndpoint", title: "Get Support form", type: "url" }),
        defineField({ name: "involvedEndpoint", title: "Get Involved form", type: "url" }),
        defineField({ name: "contactEndpoint", title: "Contact form", type: "url" }),
        defineField({ name: "newsletterEndpoint", title: "Newsletter sign-up", type: "url" }),
        str("replyTime", "Promised reply time", { description: "e.g. \"2 working days\". Empty says \"as soon as we can\"." }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings, SEO and AI answers" }) },
});
