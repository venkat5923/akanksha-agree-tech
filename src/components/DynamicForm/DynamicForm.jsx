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
        defaultValues[field.name] =
          field.defaultValue !== undefined ? field.defaultValue : "";
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
      await submitFormData(config.formType, data);
      setSubmitSuccess(true);
      reset();
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
    reset();
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
    <Container maxWidth="md" ref={topRef}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {config.title}
        </Typography>
        {config.description && (
          <Typography variant="body1" color="text.secondary">
            {config.description}
          </Typography>
        )}
      </Box>

      {/* Progress indicator */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {t("progress")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 6, borderRadius: 3 }}
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            startIcon={submitting ? null : <SendIcon />}
            sx={{
              minWidth: 200,
              borderRadius: 2,
              py: 1.5,
            }}
          >
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
