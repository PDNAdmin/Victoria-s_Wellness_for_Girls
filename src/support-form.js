// Get Support form: validation in plain words, guardian field for under 18s,
// the "Request a referral" shortcut, spam protection, and an honest send.
// Messages are the copy doc's own wording (section 4).
import { config } from "./config.js";
import { getLenis } from "./motion.js";

const MSG = {
  firstName: "Please tell us your first name.",
  contact: "That phone number or email doesn't look right. Please check it.",
  help: "Please choose the kind of help you need.",
  age: "Please choose your age group.",
  guardian: "Please add a parent or guardian's phone number or email.",
  consent: "Please tick the box so we can reply to you.",
};

const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const looksLikePhone = (v) => /^\+?[\d\s()-]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 7;
const validContact = (v) => looksLikeEmail(v) || looksLikePhone(v);

const MIN_SECONDS_BETWEEN_SENDS = 30;

export function initSupportForm() {
  const form = document.querySelector("[data-support-form]");
  if (!form) return;
  const done = document.querySelector("[data-support-done]");
  const status = form.querySelector("[data-form-status]");
  const guardian = form.querySelector("[data-guardian]");
  const submit = form.querySelector('button[type="submit"]');
  const whatsapp = config.whatsapp;
  const submitLabel = submit.textContent;
  // The first age group (marked data-minor) is the under-18 one, whatever its wording
  const minorValue = form.querySelector('input[name="age"][data-minor]')?.value;
  let lastSent = 0;

  /* ---------- Show or clear one field's error ---------- */
  const fieldEl = (name) => form.querySelector(`[data-field="${name}"]`);
  const setError = (name, message) => {
    const f = fieldEl(name);
    if (!f) return;
    const err = f.querySelector(".err");
    f.classList.toggle("is-invalid", !!message);
    err.textContent = message || "";
    err.hidden = !message;
    f.querySelectorAll("input").forEach((i) => {
      if (i.type === "radio" || i.type === "checkbox" || i.type === "text") {
        message ? i.setAttribute("aria-invalid", "true") : i.removeAttribute("aria-invalid");
      }
    });
  };

  /* ---------- Rules ---------- */
  const value = (name) => {
    const el = form.elements[name];
    if (!el) return "";
    if (el instanceof RadioNodeList) return el.value;
    if (el.type === "checkbox") return el.checked;
    return el.value.trim();
  };
  const checks = {
    firstName: () => (value("firstName") ? "" : MSG.firstName),
    contact: () => (validContact(value("contact")) ? "" : MSG.contact),
    help: () => (value("help") ? "" : MSG.help),
    age: () => (value("age") ? "" : MSG.age),
    guardian: () => (value("age") !== minorValue || validContact(value("guardian")) ? "" : MSG.guardian),
    consent: () => (value("consent") ? "" : MSG.consent),
  };

  // Re-check a field once it has been corrected, so errors clear as people fix them
  form.addEventListener("input", (e) => {
    const name = e.target.name;
    if (checks[name] && fieldEl(name)?.classList.contains("is-invalid")) setError(name, checks[name]());
  });
  form.addEventListener("change", (e) => {
    const name = e.target.name;
    if (checks[name] && fieldEl(name)?.classList.contains("is-invalid")) setError(name, checks[name]());
    if (name === "age") toggleGuardian();
  });

  /* ---------- Guardian question only for under 18s ---------- */
  const toggleGuardian = () => {
    const under18 = !!minorValue && value("age") === minorValue;
    guardian.hidden = !under18;
    if (!under18) { form.elements.guardian.value = ""; setError("guardian", ""); }
  };

  /* ---------- "Request a referral" shortcut ---------- */
  document.querySelectorAll("[data-referral]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // the general in-page link handler would also scroll
      const referral = form.querySelector('input[name="help"][data-referral-option]');
      if (referral) referral.checked = true;
      setError("help", "");
      const lenis = getLenis();
      const y = form.getBoundingClientRect().top + window.scrollY - 100;
      lenis ? lenis.scrollTo(y, { duration: 1 }) : window.scrollTo({ top: y, behavior: "smooth" });
      setTimeout(() => form.elements.firstName.focus({ preventScroll: true }), lenis ? 1000 : 400);
    });
  });

  /* ---------- Send ---------- */
  const showProblem = () => {
    status.innerHTML = `<b>Something went wrong.</b> Please try again, or <a href="${whatsapp}" target="_blank" rel="noopener">message us on WhatsApp</a>.`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";

    // Spam trap filled in: quietly do nothing
    if (form.elements.website.value) return;

    let firstBad = null;
    Object.keys(checks).forEach((name) => {
      const message = checks[name]();
      setError(name, message);
      if (message && !firstBad) firstBad = name;
    });
    if (firstBad) {
      const f = fieldEl(firstBad);
      (f.querySelector('input[type="text"]') || f.querySelector("input:checked") || f.querySelector("input")).focus();
      return;
    }

    if (Date.now() - lastSent < MIN_SECONDS_BETWEEN_SENDS * 1000) {
      status.innerHTML = "<b>We already have a request from you.</b> Please wait a moment before sending another.";
      return;
    }

    if (!config.supportEndpoint) {
      // Not connected to a sending service yet: be honest and offer WhatsApp
      console.warn("Support form: no endpoint set (Site settings → Forms in the Studio), so nothing was sent.");
      showProblem();
      return;
    }

    const data = {
      firstName: value("firstName"),
      contact: value("contact"),
      preferredContact: value("preferred"),
      helpNeeded: value("help"),
      ageGroup: value("age"),
      guardianContact: value("guardian") || undefined,
      consent: true,
    };

    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const res = await fetch(config.supportEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      lastSent = Date.now();
      const when = config.replyTime ? `within ${config.replyTime}` : "as soon as we can";
      done.querySelector("[data-done-text]").textContent =
        `We have your request and will contact you by ${data.preferredContact} ${when}.`;
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch (err) {
      showProblem();
    } finally {
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
  });
}
