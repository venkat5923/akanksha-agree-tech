import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Button,
  Container,
  LinearProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Section from "../Section/Section.jsx";
import FormField from "../FormField/FormField.jsx";
import Loader from "../Loader/Loader.jsx";
import SuccessMessage from "../SuccessMessage/SuccessMessage.jsx";
import ErrorAlert from "../ErrorAlert/ErrorAlert.jsx";
import { isFieldVisible } from "../../utils/conditionalVisibility.js";
import { submitFormData } from "../../services/api.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

// Main dynamic form renderer. Takes a JSON config and renders the full form.
// Handles validation, conditional visibility, submission, and success/error states.
export default function DynamicForm({ config }) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const topRef = useRef(null);

  // Build default values from all fields across all sections
  const defaultValues = {};
  if (config?.sections) {
    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.name === "fieldOperatorName") {
          defaultValues[field.name] =
            localStorage.getItem("lastFieldOperatorName") ||
            (field.defaultValue !== undefined ? field.defaultValue : "");
        } else {
          defaultValues[field.name] =
            field.defaultValue !== undefined ? field.defaultValue : "";
        }
      });
    });
  }

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
  });

  // Watch all fields for conditional visibility
  const formValues = watch();

  // Sort sections and fields by order
  const sortedSections = (config?.sections || [])
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Calculate completion progress
  const allFields = sortedSections.flatMap((s) => s.fields);
  const visibleFields = allFields.filter((f) =>
    isFieldVisible(f, formValues)
  );
  const filledFields = visibleFields.filter((f) => {
    const val = formValues[f.name];
    return val !== "" && val != null && (Array.isArray(val) ? val.length > 0 : true);
  });
  const progress = visibleFields.length
    ? Math.round((filledFields.length / visibleFields.length) * 100)
    : 0;

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (data.fieldOperatorName) {
        localStorage.setItem("lastFieldOperatorName", data.fieldOperatorName);
      }
      await submitFormData(config.formType, data);
      setSubmitSuccess(true);
      reset({
        ...defaultValues,
        fieldOperatorName: data.fieldOperatorName || localStorage.getItem("lastFieldOperatorName") || "",
      });
      // Scroll to top
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      setSubmitError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
    reset({
      ...defaultValues,
      fieldOperatorName: localStorage.getItem("lastFieldOperatorName") || "",
    });
  };

  const handleRetry = () => {
    setSubmitError(null);
    // Re-trigger submit with current form values
    handleSubmit(onSubmit)();
  };

  // Scroll to top on success
  useEffect(() => {
    if (submitSuccess && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitSuccess]);

  if (submitSuccess) {
    return (
      <Container maxWidth="md" ref={topRef}>
        <SuccessMessage
          title={t("submissionSuccessful")}
          description={t("submissionSuccessDesc")}
          resetLabel={t("submitAnother")}
          onReset={handleReset}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" ref={topRef} sx={{ px: { xs: 0.5, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2.5, sm: 3.5 }, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.35rem", sm: "1.9rem" },
            color: "#1e293b",
            letterSpacing: "-0.02em",
            mb: 0.5,
          }}
        >
          {config.title}
        </Typography>
        {config.description && (
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.88rem", sm: "1rem" },
              maxWidth: 600,
              mx: "auto",
            }}
          >
            {config.description}
          </Typography>
        )}
      </Box>

      {/* Progress indicator */}
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          bgcolor: "#ffffff",
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2.5,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            {t("progress")}
          </Typography>
          <Box
            sx={{
              bgcolor: progress === 100 ? "success.light" : "rgba(46, 125, 50, 0.12)",
              color: progress === 100 ? "#ffffff" : "primary.dark",
              px: 1.2,
              py: 0.25,
              borderRadius: 1.5,
              fontWeight: 700,
              fontSize: "0.78rem",
            }}
          >
            {progress}%
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "#e2e8f0",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              backgroundImage: "linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)",
            },
          }}
        />
      </Box>

      {/* Error alert */}
      {submitError && (
        <ErrorAlert
          message={submitError}
          onRetry={handleRetry}
          t={t}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {sortedSections.map((section) => {
          const sortedFields = section.fields
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          return (
            <Section
              key={section.id}
              title={section.title}
              order={section.order}
            >
              {sortedFields.map((field) => {
                if (!isFieldVisible(field, formValues)) {
                  return null;
                }
                return (
                  <FormField
                    key={field.name}
                    field={field}
                    control={control}
                    errors={errors}
                  />
                );
              })}
            </Section>
          );
        })}

        {/* Submit button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            mb: 6,
            px: { xs: 1, sm: 0 },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            startIcon={submitting ? null : <SendIcon />}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 260 },
              borderRadius: 3,
              py: { xs: 1.6, sm: 1.8 },
              fontSize: { xs: "1.05rem", sm: "1.12rem" },
              fontWeight: 700,
              backgroundImage: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
              boxShadow: "0 4px 14px rgba(46, 125, 50, 0.35)",
              "&:hover": {
                backgroundImage: "linear-gradient(135deg, #1b5e20 0%, #0d3810 100%)",
                boxShadow: "0 6px 20px rgba(46, 125, 50, 0.45)",
              },
            }}
          >
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
