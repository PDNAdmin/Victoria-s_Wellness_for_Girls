// Shared handling for the Get Involved, Contact and Newsletter forms.
// Each form is set up from its markup:
//   <form data-form="name">                       name picks config[`${name}Endpoint`]
//   <div data-field="x" data-rule="..." data-msg="...">
//       rules: required | contact (phone or email) | email | choice | checked
//   data-show-when="role=School,Organisation"     only shown (and checked) for those answers
//   <div data-form-done="name">                   shown after a successful send
// The Get Support form has its own file (support-form.js) because it has extra care rules.
import { config } from "./config.js";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => /^\+?[\d\s()-]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 7;

const RULES = {
  required: (v) => v.length > 0,
  contact: (v) => isEmail(v) || isPhone(v),
  email: (v) => isEmail(v),
  choice: (v) => v.length > 0,
  checked: (v) => v === true,
};

const WAIT_MS = 30_000; // one send per form every 30 seconds

function setupForm(form) {
  const name = form.dataset.form;
  const done = document.querySelector(`[data-form-done="${name}"]`);
  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector('button[type="submit"]');
  const submitLabel = submit.textContent;
  const fields = [...form.querySelectorAll("[data-field]")];
  let lastSent = 0;

  const valueOf = (field) => {
    const inputs = [...field.querySelectorAll("input, textarea, select")];
    const first = inputs[0];
    if (!first) return "";
    if (first.type === "checkbox") return first.checked;
    if (first.type === "radio") return inputs.find((i) => i.checked)?.value || "";
    return first.value.trim();
  };

  const isShown = (field) => !field.hidden;

  const check = (field) => {
    const rule = RULES[field.dataset.rule];
    if (!rule || !isShown(field)) return "";
    return rule(valueOf(field)) ? "" : field.dataset.msg || "Please check this answer.";
  };

  const showError = (field, message) => {
    const err = field.querySelector(".err");
    field.classList.toggle("is-invalid", !!message);
    if (err) { err.textContent = message; err.hidden = !message; }
    field.querySelectorAll("input, textarea").forEach((i) =>
      message ? i.setAttribute("aria-invalid", "true") : i.removeAttribute("aria-invalid"));
  };

  // Conditional fields, e.g. organisation name only for schools, organisations and sponsors
  const conditional = fields.filter((f) => f.dataset.showWhen);
  const updateConditional = () => {
    conditional.forEach((f) => {
      const [key, list] = f.dataset.showWhen.split("=");
      const current = form.querySelector(`input[name="${key}"]:checked`)?.value;
      const show = list.split(",").includes(current);
      f.hidden = !show;
      if (!show) showError(f, "");
    });
  };
  updateConditional();

  const recheck = (e) => {
    const field = e.target.closest("[data-field]");
    if (field?.classList.contains("is-invalid")) showError(field, check(field));
    if (e.type === "change") updateConditional();
  };
  form.addEventListener("input", recheck);
  form.addEventListener("change", recheck);

  const showProblem = () => {
    status.innerHTML = `<b>Something went wrong.</b> Please try again, or <a href="${config.whatsapp}" target="_blank" rel="noopener">message us on WhatsApp</a>.`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    if (form.elements.website?.value) return; // spam trap

    let firstBad = null;
    fields.forEach((f) => {
      const message = check(f);
      showError(f, message);
      if (message && !firstBad) firstBad = f;
    });
    if (firstBad) {
      firstBad.querySelector("input:not([type=radio]), textarea, input")?.focus();
      return;
    }

    if (Date.now() - lastSent < WAIT_MS) {
      status.innerHTML = "<b>We already have this from you.</b> Please wait a moment before sending again.";
      return;
    }

    const endpoint = config[`${name}Endpoint`];
    if (!endpoint) {
      console.warn(`Form "${name}": no endpoint set in src/config.js, so nothing was sent.`);
      showProblem();
      return;
    }

    const data = { form: name };
    fields.filter(isShown).forEach((f) => { data[f.dataset.field] = valueOf(f); });

    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      lastSent = Date.now();
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch {
      showProblem();
    } finally {
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
  });
}

export function initForms() {
  document.querySelectorAll("form[data-form]").forEach(setupForm);
}
