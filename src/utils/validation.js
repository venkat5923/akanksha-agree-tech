// Maps JSON validation rules to React Hook Form validation rules.
// Supports: required, minLength, maxLength, min, max, pattern, email, phone.
// Accepts an optional `t` translation function for localized error messages.

const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildValidationRules(field, t) {
  const rules = {};
  const tr = t || ((key, fallback) => fallback);

  if (field.required) {
    if (field.type === "checkbox-group" || field.type === "multiselect") {
      rules.required = (val) =>
        Array.isArray(val) && val.length > 0 || tr("validationRequired", `${field.label} is required`);
    } else {
      rules.required = tr("validationRequired", `${field.label} is required`);
    }
  }

  const v = field.validation || {};

  if (v.minLength != null) {
    rules.minLength = {
      value: v.minLength,
      message: tr("validationMinLength", `${field.label} must be at least ${v.minLength} characters`),
    };
  }

  if (v.maxLength != null) {
    rules.maxLength = {
      value: v.maxLength,
      message: tr("validationMaxLength", `${field.label} must be at most ${v.maxLength} characters`),
    };
  }

  if (v.min != null) {
    rules.min = {
      value: v.min,
      message: tr("validationMin", `${field.label} must be at least ${v.min}`),
    };
  }

  if (v.max != null) {
    rules.max = {
      value: v.max,
      message: tr("validationMax", `${field.label} must be at most ${v.max}`),
    };
  }

  // Type-based patterns
  if (field.type === "email") {
    rules.pattern = {
      value: EMAIL_REGEX,
      message: tr("validationEmail", "Please enter a valid email address"),
    };
  } else if (field.type === "phone") {
    if (v.pattern) {
      rules.pattern = {
        value: new RegExp(v.pattern),
        message: tr("validationPhone", "Please enter a valid 10-digit phone number"),
      };
    } else {
      rules.pattern = {
        value: PHONE_REGEX,
        message: tr("validationPhone", "Please enter a valid 10-digit phone number"),
      };
    }
  } else if (v.pattern) {
    rules.pattern = {
      value: new RegExp(v.pattern),
      message: tr("validationPattern", `${field.label} format is invalid`),
    };
  }

  return rules;
}
