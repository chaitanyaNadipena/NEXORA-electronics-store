/* ==========================================================================
   NEXORA — Contact Form Validation
   Handles inline validation and a simulated submit for the contact page.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const status = $("#contactFormStatus");

    function validateField(input) {
      const field = input.closest(".field");
      if (!field) return true;
      const valid = input.checkValidity();
      field.classList.toggle("is-invalid", !valid);
      return valid;
    }

    $$("input, select, textarea", form).forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("is-invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = $$("input[required], select[required], textarea[required]", form);
      let allValid = true;

      fields.forEach((input) => {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        if (status) {
          status.style.color = "var(--c-danger)";
          status.textContent = "Please fill in all required fields correctly.";
        }
        const firstInvalid = form.querySelector(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea");
        firstInvalid && firstInvalid.focus();
        return;
      }

      const name = $("#cf-name").value.trim();

      if (status) {
        status.style.color = "var(--c-success)";
        status.textContent = `Thanks, ${name.split(" ")[0]} — your message has been sent. We'll reply within 4 business hours.`;
      }
      window.NexoraToast && window.NexoraToast("Message sent successfully");
      form.reset();
      $$(".field", form).forEach((f) => f.classList.remove("is-invalid"));
    });
  }

  document.addEventListener("DOMContentLoaded", initContactForm);
})();