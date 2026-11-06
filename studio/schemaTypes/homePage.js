// The home page: one tab per section, in the order they appear on the site.
import { defineType, defineField, defineArrayMember } from "sanity";
import { str, txt, list, photo, icon, MARKS_HELP } from "./objects.js";

const section = (name, title, fields, extra = {}) =>
  defineField({ name, title, type: "object", group: name, fields, options: { collapsible: false }, ...extra });

const links = (name, title) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "link" })] });
const stats = (name, title) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "stat" })] });
const formFields = (fields) => defineField({ name: "form", title: "Form wording", type: "object", options: { collapsible: true, collapsed: true }, fields });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    ["hero", "Top"], ["about", "About"], ["programmes", "Programmes"], ["where", "Where we work"],
    ["impact", "Impact"], ["values", "Values"], ["support", "Get Support"], ["involved", "Get Involved"],
    ["donate", "Donate"], ["outreach", "Outreach and events"], ["gallery", "Gallery"], ["faq", "FAQ"],
    ["newsletter", "Newsletter"], ["contact", "Contact"],
  ].map(([name, title], i) => ({ name, title, default: i === 0 })),
  fields: [
    section("hero", "Top of the page", [
      txt("title", "Main heading", { rows: 2, description: MARKS_HELP, validation: (r) => r.required() }),
      txt("lead", "Intro"),
      defineField({ name: "buttons", title: "Buttons", type: "array", of: [defineArrayMember({ type: "button" })] }),
      str("privacyNote", "Privacy note under the buttons"),
      photo("image", "Photo", { description: "Shown in a tall arch on computers (cropped to 4:5 around the hotspot)." }),
      photo("mobileImage", "Phone photo (optional)", { description: "A wider crop for phones. Leave empty to reuse the photo above." }),
      str("caption", "Photo caption"),
    ]),

    section("about", "About", [
      str("eyebrow", "Small label"), str("title", "Heading"), txt("body", "Text", { rows: 5 }),
      str("linkLabel", "Link text"), str("linkHref", "Link goes to"),
      photo("image", "Photo"), str("caption", "Photo caption"),
      ...["mission", "vision"].map((n) => defineField({
        name: n, title: n === "mission" ? "Mission" : "Vision", type: "object", options: { collapsible: true },
        fields: [str("label", "Label"), txt("lead", "Statement"), txt("more", "More detail (optional)"), photo("image", "Photo"), str("caption", "Photo caption")],
      })),
      str("symbolsLabel", "Symbols list name (for screen readers)"),
      defineField({
        name: "symbols", title: "Symbols", type: "array",
        of: [defineArrayMember({ type: "object", name: "symbol", fields: [str("label", "Word"), icon()], preview: { select: { title: "label", subtitle: "icon" } } })],
      }),
    ]),

    section("programmes", "Programmes", [
      str("title", "Heading"), str("intro", "Intro"), photo("image", "Photo"), str("caption", "Photo caption"),
      defineField({
        name: "items", title: "Programmes", type: "array",
        of: [defineArrayMember({
          type: "object", name: "programme",
          fields: [
            str("name", "Name", { validation: (r) => r.required() }),
            icon(),
            str("status", "Status", { options: { list: [{ title: "Running now", value: "now" }, { title: "With partners", value: "partner" }], layout: "radio" }, initialValue: "now" }),
            txt("text", "What it is"),
            str("audience", "Who it is for"),
            defineField({ name: "highlight", title: "Rose colour (girls' programme)", type: "boolean", initialValue: false }),
            links("actions", "Links"),
          ],
          preview: { select: { title: "name", subtitle: "status" } },
        })],
      }),
      str("statusNowLabel", "\"Running now\" label"), str("statusPartnerLabel", "\"With partners\" label"),
      str("audienceLabel", "\"For\" label"),
      txt("note", "Note under the list", { rows: 4, description: MARKS_HELP }),
    ]),

    section("where", "Where we work", [
      str("title", "Heading"), txt("body", "Text"), photo("image", "Photo"), str("caption", "Photo caption"),
      str("stopsLabel", "Places list name (for screen readers)"),
      defineField({
        name: "stops", title: "Communities reached", type: "array",
        of: [defineArrayMember({
          type: "object", name: "stop", fields: [str("place", "Place"), str("area", "Area (optional)", { description: "Shown smaller after a comma, e.g. Ile-Ife." })],
          preview: { select: { title: "place", subtitle: "area" } },
        })],
      }),
      str("nextLabel", "Last stop text"), str("nextButtonLabel", "Button text"), str("nextButtonHref", "Button goes to"),
    ]),

    section("impact", "Impact", [
      str("eyebrow", "Small label"), str("title", "Heading"), str("intro", "Intro"),
      defineField({ name: "asOf", title: "Figures as of", type: "date", description: "Shown under the intro. Dated figures are trusted more by search and AI answers." }),
      stats("major", "Big figures"), stats("minor", "Smaller figures"),
      photo("image", "Photo"), str("caption", "Photo caption"),
      str("checksTitle", "Health checks heading"), list("checks", "Health checks offered"),
      str("buttonLabel", "Button text"), str("buttonHref", "Button goes to"),
    ]),

    section("values", "Values", [
      str("eyebrow", "Small label"), str("title", "Heading"), str("intro", "Intro"), photo("image", "Photo"),
      defineField({
        name: "items", title: "Values", type: "array",
        of: [defineArrayMember({
          type: "object", name: "value",
          fields: [
            str("name", "Name"), txt("text", "Text", { rows: 2 }), icon(),
            str("color", "Colour", { options: { list: ["sage", "rose", "gold"], layout: "radio" }, initialValue: "sage" }),
          ],
          preview: { select: { title: "name", subtitle: "text" } },
        })],
      }),
    ]),

    section("support", "Get Support", [
      str("title", "Heading"), txt("body", "Text", { rows: 4 }),
      str("quickLabel", "Quick links list name (for screen readers)"),
      str("whatsappLabel", "WhatsApp link text"), str("whatsappNote", "WhatsApp small text"),
      str("whatsappMessage", "WhatsApp message people start with"),
      str("callLabel", "Call link text"),
      str("referralLabel", "Referral link text"), str("referralNote", "Referral small text"),
      formFields([
        str("title", "Form heading"), str("requiredNote", "Required note"),
        str("nameLabel", "Name question"), str("nameHelp", "Name hint"),
        str("contactLabel", "Contact question"), str("contactHelp", "Contact hint"),
        str("preferredLabel", "Contact method question"),
        str("helpLabel", "Help question"), txt("privacyNote", "Privacy note", { rows: 2 }),
        list("helpOptions", "Kinds of help"),
        str("referralOption", "Which kind of help the \"Request a referral\" link picks", { description: "Must match one of the kinds of help exactly." }),
        str("ageLabel", "Age question"),
        list("ageOptions", "Age groups", { description: "The FIRST age group is treated as under 18 (asks for a parent or guardian)." }),
        str("guardianLabel", "Guardian question"), str("guardianHelp", "Guardian hint"),
        txt("consentText", "Consent text", { rows: 2 }),
        txt("emergency", "Emergency note", { rows: 2, description: MARKS_HELP }),
        str("submitLabel", "Send button"), str("doneTitle", "Thank-you heading"),
        txt("doneText", "Thank-you text", { rows: 2, description: "Replaced by a message with the reply method once a form service is connected." }),
        str("doneEmergency", "Thank-you emergency note"),
      ]),
      str("disclaimerTitle", "Disclaimer heading"), txt("disclaimer", "Health disclaimer", { rows: 5 }),
    ]),

    section("involved", "Get Involved", [
      str("eyebrow", "Small label"), str("title", "Heading"), txt("body", "Text", { rows: 4 }),
      photo("image", "Photo"), str("caption", "Photo caption"),
      str("waysLabel", "Ways list name (for screen readers)"),
      defineField({
        name: "ways", title: "Ways to help", type: "array",
        of: [defineArrayMember({ type: "object", name: "way", fields: [str("label", "Text"), icon()], preview: { select: { title: "label" } } })],
      }),
      txt("closing", "Closing line", { rows: 2, description: MARKS_HELP }),
      formFields([
        str("title", "Form heading"), str("nameLabel", "Name question"), str("contactLabel", "Contact question"),
        str("roleLabel", "Role question"), list("roleOptions", "Roles"),
        list("orgRoles", "Roles that are asked for an organisation name"),
        str("orgLabel", "Organisation question"),
        str("messageLabel", "Message question"), str("messageHelp", "Message hint"),
        txt("consentText", "Consent text", { rows: 2 }), str("submitLabel", "Send button"),
        str("whatsappLabel", "WhatsApp link text"), str("whatsappMessage", "WhatsApp message people start with"),
        str("doneTitle", "Thank-you heading"), str("doneText", "Thank-you text"),
      ]),
    ]),

    section("donate", "Donate", [
      str("title", "Heading"), txt("body", "Text", { rows: 4 }),
      str("howTitle", "\"How to give\" heading"), txt("howText", "How to give", { rows: 4, description: "Add bank details here when they are ready." }),
      str("whatsappLabel", "WhatsApp button"), str("whatsappMessage", "WhatsApp message people start with"),
      str("emailLabel", "Email button"), str("emailSubject", "Email subject"),
      photo("image", "Photo"), str("useTitle", "\"How your gift is used\" heading"), list("uses", "Uses of gifts"),
      txt("note", "Note", { rows: 2 }), str("thanks", "Thank-you line"),
    ]),

    section("outreach", "Outreach and events", [
      str("title", "Heading"), txt("body", "Text"),
      defineField({ name: "video", title: "Film", type: "file", options: { accept: "video/mp4" }, description: "MP4, ideally under 10 MB. Leave empty to keep the current film." }),
      photo("poster", "Film cover image"),
      str("videoLabel", "Film description (for screen readers)"),
      str("playLabel", "Play button text"), str("playNote", "Play button small text"),
      txt("videoCaption", "Film caption", { rows: 2 }),
      str("upcomingTitle", "\"Upcoming\" heading"),
      txt("upcomingText", "Text when no outreach is scheduled", { rows: 2 }),
      defineField({
        name: "events", title: "Upcoming outreaches", type: "array", of: [defineArrayMember({ type: "outreachEvent" })],
        description: "Past dates are hidden automatically at the next site update. Each one is also published as an event for Google and AI search.",
      }),
      str("instagramLabel", "Instagram button text"), str("askLabel", "\"Ask about an outreach\" link text"),
    ]),

    section("gallery", "Gallery", [
      str("eyebrow", "Small label"), str("title", "Heading"), str("intro", "Intro"),
      defineField({
        name: "items", title: "Photos", type: "array",
        of: [defineArrayMember({
          type: "object", name: "galleryItem",
          fields: [
            photo("image", "Photo", { validation: (r) => r.required() }),
            str("caption", "Caption"),
            str("layout", "Size", { options: { list: [{ title: "Normal", value: "normal" }, { title: "Wide", value: "wide" }, { title: "Big", value: "big" }], layout: "radio" }, initialValue: "normal" }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        })],
      }),
      str("instagramTitle", "Instagram tile heading"), str("instagramText", "Instagram tile text"),
    ]),

    section("faq", "Frequently asked questions", [
      defineField({ name: "enabled", title: "Show this section", type: "boolean", initialValue: true }),
      str("eyebrow", "Small label"), str("title", "Heading"), str("intro", "Intro"),
      defineField({
        name: "items", title: "Questions", type: "array", of: [defineArrayMember({ type: "faqItem" })],
        description: "These answers are also published as FAQ data, which Google and AI assistants use to answer questions directly.",
      }),
    ]),

    section("newsletter", "Newsletter", [
      str("title", "Heading"), txt("text", "Text", { rows: 2 }), str("emailLabel", "Email question"),
      str("submitLabel", "Button"), str("consentText", "Consent text"), str("doneText", "Thank-you text"),
    ]),

    section("contact", "Contact", [
      str("title", "Heading"), txt("body", "Text", { rows: 2 }),
      formFields([
        str("title", "Form heading"), str("nameLabel", "Name question"), str("contactLabel", "Contact question"),
        str("messageLabel", "Message question"), str("replyLabel", "Reply method question"),
        txt("consentText", "Consent text", { rows: 2 }), str("submitLabel", "Send button"),
        str("doneTitle", "Thank-you heading"), str("doneText", "Thank-you text"),
      ]),
    ]),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
