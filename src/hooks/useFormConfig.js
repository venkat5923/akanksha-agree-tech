import { useState, useEffect } from "react";

// Loads a form configuration JSON dynamically based on form type and language.
// Returns { config, loading, error }.
export function useFormConfig(formType, lang = "te") {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const configPath =
      formType === "farmer"
        ? `../config/farmer-form.${lang}.json`
        : formType === "service-provider"
          ? `../config/service-provider-form.${lang}.json`
          : null;

    if (!configPath) {
      setError(`Unknown form type: ${formType}`);
      setLoading(false);
      return;
    }

    // Vite supports JSON imports natively
    import(configPath)
      .then((mod) => {
        if (!cancelled) {
          setConfig(mod.default);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(`Failed to load form config: ${err.message}`);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formType, lang]);

  return { config, loading, error };
}
