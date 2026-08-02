import { useState, useEffect } from "react";
import farmerEn from "../config/farmer-form.en.json";
import farmerTe from "../config/farmer-form.te.json";
import providerEn from "../config/service-provider-form.en.json";
import providerTe from "../config/service-provider-form.te.json";

const configs = {
  farmer: { en: farmerEn, te: farmerTe },
  "service-provider": { en: providerEn, te: providerTe },
};

// Loads a form configuration based on form type and language.
// Returns { config, loading, error }.
export function useFormConfig(formType, lang = "te") {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const formConfigs = configs[formType];
    if (!formConfigs) {
      setError(`Unknown form type: ${formType}`);
      setLoading(false);
      return;
    }

    const cfg = formConfigs[lang] || formConfigs.en;
    setConfig(cfg);
    setLoading(false);
  }, [formType, lang]);

  return { config, loading, error };
}
