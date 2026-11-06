// The Studio's left-hand menu: one entry per page, in the order editors think about them.
export const SINGLETONS = new Set(["siteSettings", "homePage", "legalPage"]);

const single = (S, title, type, id) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(type).documentId(id).title(title));

export const structure = (S) =>
  S.list()
    .title("Website")
    .items([
      single(S, "Home page", "homePage", "homePage"),
      single(S, "Site settings, SEO and AI answers", "siteSettings", "siteSettings"),
      S.divider(),
      single(S, "Privacy policy", "legalPage", "privacyPage"),
      single(S, "Terms of use", "legalPage", "termsPage"),
    ]);
