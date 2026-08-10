import { Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  InputLabel,
  FormHelperText,
  Box,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { buildValidationRules } from "../../utils/validation.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import AutocompleteField from "./AutocompleteField.jsx";

// Renders a single form field based on its JSON definition.
// Supports: text, number, email, phone, textarea, date, dropdown,
// multiselect, radio, checkbox, file, hidden.
export default function FormField({ field, control, errors }) {
  const { t } = useLanguage();
  const rules = buildValidationRules(field, t);
  const error = errors[field.name];
  const errorMsg = error ? error.message : "";
  const isFullWidth =
    ["textarea", "checkbox", "radio", "checkbox-group", "multiselect"].includes(field.type) ||
    field.name?.toLowerCase().includes("other") ||
    field.name?.toLowerCase().includes("address") ||
    field.name === "fieldOperatorName";

  // Hidden field — registers with RHF but renders nothing visible
  if (field.type === "hidden") {
    return (
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.defaultValue || ""}
        rules={rules}
        render={({ field: f }) => <input type="hidden" {...f} />}
      />
    );
  }

  const renderControl = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={rules}
            render={({ field: f }) => (
              <TextField
                {...f}
                label={field.label}
                placeholder={field.placeholder}
                error={!!error}
                helperText={errorMsg}
                fullWidth
                type={field.type === "email" ? "email" : "text"}
                inputMode={field.type === "phone" ? "numeric" : undefined}
              />
            )}
          />
        );

      case "number":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={rules}
            render={({ field: f }) => (
              <TextField
                {...f}
                label={field.label}
                placeholder={field.placeholder}
                error={!!error}
                helperText={errorMsg}
                fullWidth
                type="number"
                value={f.value === "" || f.value == null ? "" : f.value}
                onChange={(e) =>
                  f.onChange(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={rules}
            render={({ field: f }) => (
              <TextField
                {...f}
                label={field.label}
                placeholder={field.placeholder}
                error={!!error}
                helperText={errorMsg}
                fullWidth
                multiline
                rows={3}
              />
            )}
          />
        );

      case "date":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={rules}
            render={({ field: f }) => (
              <TextField
                {...f}
                label={field.label}
                error={!!error}
                helperText={errorMsg}
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        );

      case "dropdown":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={rules}
            render={({ field: f }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...f}
                  label={field.label}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: { xs: 280, sm: 360 },
                        borderRadius: 2,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                >
                  {field.placeholder && (
                    <MenuItem value="" disabled>
                      <em>{field.placeholder}</em>
                    </MenuItem>
                  )}
                  {(field.options || []).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
                {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case "multiselect":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || []}
            rules={rules}
            render={({ field: f }) => {
              const currentValues = Array.isArray(f.value) ? f.value : (f.value ? [f.value] : []);
              return (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    {...f}
                    multiple
                    input={<OutlinedInput label={field.label} />}
                    value={currentValues}
                    onChange={(e) => {
                      const val = typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value;
                      f.onChange(val);
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {(Array.isArray(selected) ? selected : []).map((opt) => (
                          <Chip
                            key={opt}
                            label={opt}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              borderRadius: 1.5,
                              fontSize: { xs: "0.75rem", sm: "0.82rem" },
                              bgcolor: "rgba(46, 125, 50, 0.08)",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: { xs: 300, sm: 380 },
                          borderRadius: 2,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      },
                    }}
                  >
                    {(field.options || []).map((opt) => (
                      <MenuItem key={opt} value={opt} sx={{ py: 1 }}>
                        <Checkbox checked={currentValues.indexOf(opt) > -1} color="primary" />
                        <Box sx={{ fontSize: { xs: "0.9rem", sm: "0.95rem" } }}>{opt}</Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
                </FormControl>
              );
            }}
          />
        );

      case "radio":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || ""}
            rules={rules}
            render={({ field: f }) => (
              <FormControl fullWidth error={!!error}>
                <FormLabel sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>{field.label}</FormLabel>
                <RadioGroup
                  row
                  value={f.value || ""}
                  onChange={f.onChange}
                  name={f.name}
                  sx={{ gap: { xs: 1, sm: 2 } }}
                >
                  {(field.options || []).map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={opt}
                      control={<Radio color="primary" />}
                      label={opt}
                      sx={{
                        m: 0,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        border: f.value === opt ? "1.5px solid #2e7d32" : "1px solid #e2e8f0",
                        bgcolor: f.value === opt ? "rgba(46, 125, 50, 0.06)" : "#ffffff",
                        transition: "all 0.15s ease",
                      }}
                    />
                  ))}
                </RadioGroup>
                {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || false}
            rules={rules}
            render={({ field: f }) => (
              <FormControl fullWidth error={!!error}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!f.value}
                        onChange={(e) => f.onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={field.label}
                  />
                </FormGroup>
                {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case "checkbox-group":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || []}
            rules={rules}
            render={({ field: f }) => (
              <FormControl fullWidth error={!!error}>
                <FormLabel sx={{ fontWeight: 600, mb: 1.5, color: "text.primary", fontSize: { xs: "0.92rem", sm: "0.98rem" } }}>
                  {field.label}
                </FormLabel>
                <FormGroup
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: { xs: 1.2, sm: 1.5 },
                  }}
                >
                  {(field.options || []).map((opt) => {
                    const isChecked = Array.isArray(f.value) && f.value.includes(opt);
                    return (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            checked={isChecked}
                            color="primary"
                            onChange={(e) => {
                              const current = Array.isArray(f.value) ? f.value : [];
                              if (e.target.checked) {
                                f.onChange([...current, opt]);
                              } else {
                                f.onChange(current.filter((v) => v !== opt));
                              }
                            }}
                          />
                        }
                        label={opt}
                        sx={{
                          flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "0 1 auto" },
                          border: isChecked ? "2px solid #2e7d32" : "1.5px solid #e2e8f0",
                          bgcolor: isChecked ? "rgba(46, 125, 50, 0.08)" : "#ffffff",
                          borderRadius: 2.5,
                          px: { xs: 1.5, sm: 2 },
                          py: { xs: 1, sm: 0.8 },
                          m: 0,
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          boxShadow: isChecked ? "0 2px 8px rgba(46, 125, 50, 0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "rgba(46, 125, 50, 0.04)",
                            transform: "translateY(-1px)",
                          },
                          "& .MuiFormControlLabel-label": {
                            fontWeight: isChecked ? 700 : 500,
                            fontSize: { xs: "0.9rem", sm: "0.95rem" },
                            color: isChecked ? "primary.dark" : "text.primary",
                          },
                        }}
                      />
                    );
                  })}
                </FormGroup>
                {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case "autocomplete":
        return (
          <AutocompleteField
            field={field}
            control={control}
            rules={rules}
            error={error}
            errorMsg={errorMsg}
          />
        );

      case "file":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={field.defaultValue || null}
            rules={rules}
            render={({ field: f }) => (
              <FormControl fullWidth error={!!error}>
                <FormLabel>{field.label}</FormLabel>
                <Box sx={{ mt: 1 }}>
                  <input
                    type="file"
                    onChange={(e) => f.onChange(e.target.files?.[0] || null)}
                    accept={field.accept || "*"}
                  />
                </Box>
                {errorMsg && (
                  <FormHelperText>{errorMsg}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        gridColumn: isFullWidth ? "1 / -1" : "span 1",
      }}
    >
      {renderControl()}
    </Box>
  );
}
