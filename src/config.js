// Site settings for the scripts. They are edited in the Studio (Site settings → Forms and
// Contact details) and written into the page at build time as <script id="site-config">.
//
// Endpoints: where each form sends its answers (for example a Formspree or Web3Forms URL).
// Empty means "not connected yet": the form checks the answers, then tells people honestly
// that it could not send and offers WhatsApp, instead of pretending it worked.

const defaults = {
  supportEndpoint: "", // Get Support form
  involvedEndpoint: "", // Get Involved form
  contactEndpoint: "", // Contact form
  newsletterEndpoint: "", // Newsletter sign-up (needs a mailing service with double opt-in)
  // The reply time promised after someone asks for support, e.g. "2 working days".
  // Empty means the message says "as soon as we can".
  replyTime: "",
  // Used in "message us on WhatsApp" fallbacks
  whatsapp: "https://wa.me/2347052429995",
};

function fromPage() {
  try {
    return JSON.parse(document.getElementById("site-config")?.textContent || "{}");
  } catch {
    return {};
  }
}

export const config = { ...defaults, ...fromPage() };
