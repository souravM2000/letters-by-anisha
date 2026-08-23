"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  inquiryType?: string;
  message?: string;
}

const INQUIRY_TYPES = [
  "Brand Collaboration",
  "Press / Media",
  "Book Review Request",
  "General Inquiry",
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.inquiryType) errors.inquiryType = "Please select an inquiry type.";
  if (!data.message.trim()) errors.message = "Message is required.";
  else if (data.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setState("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setState("error");
        setServerError(json.error || "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setFormData({ name: "", email: "", inquiryType: "", message: "" });
    } catch {
      setState("error");
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  const inputBase =
    "w-full bg-transparent border-b border-brand-ink/25 py-3 text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-crimson transition-colors text-sm";
  const selectBase =
    "w-full bg-transparent border-b border-brand-ink/25 py-3 text-brand-ink focus:outline-none focus:border-brand-crimson transition-colors text-sm appearance-none cursor-pointer";
  const errorClass = "mt-1 text-xs text-red-600";
  const fieldError = (field: keyof FormErrors) =>
    errors[field] ? "!border-red-400" : "";

  if (state === "success") {
    return (
      <div className="text-center py-16 px-6">
        <span className="font-handwritten text-5xl text-brand-terracotta block mb-4">
          Thank you!
        </span>
        <p className="font-serif text-xl text-brand-ink mb-2">
          Your message has been sent.
        </p>
        <p className="text-brand-ink/60 text-sm mb-8">
          I&apos;ll get back to you as soon as I can.
        </p>
        <button
          onClick={() => setState("idle")}
          className="text-sm uppercase tracking-widest text-brand-terracotta underline underline-offset-4 hover:text-brand-crimson transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">
          Name <span className="text-brand-terracotta">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className={`${inputBase} ${fieldError("name")}`}
          disabled={state === "submitting"}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">
          Email <span className="text-brand-terracotta">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={`${inputBase} ${fieldError("email")}`}
          disabled={state === "submitting"}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      {/* Inquiry type */}
      <div className="relative">
        <label htmlFor="contact-inquiry" className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">
          Inquiry Type <span className="text-brand-terracotta">*</span>
        </label>
        <select
          id="contact-inquiry"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleChange}
          className={`${selectBase} ${fieldError("inquiryType")}`}
          disabled={state === "submitting"}
        >
          <option value="">Select an inquiry type…</option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {/* Custom chevron */}
        <span className="pointer-events-none absolute right-0 bottom-3 text-brand-ink/30 text-xs">▾</span>
        {errors.inquiryType && <p className={errorClass}>{errors.inquiryType}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">
          Message <span className="text-brand-terracotta">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your project, collaboration idea, or question…"
          className={`${inputBase} resize-none ${fieldError("message")}`}
          disabled={state === "submitting"}
        />
        {errors.message && <p className={errorClass}>{errors.message}</p>}
      </div>

      {/* Server error */}
      {state === "error" && serverError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="group flex items-center gap-3 px-8 py-3 border border-brand-ink text-brand-ink text-sm uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
