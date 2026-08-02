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
  const isFullWidth = ["textarea", "checkbox", "radio", "checkbox-group"].includes(field.type);

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
                  value={f.value || ""}
                >
                  {field.placeholder && (
                    <MenuItem value="" disabled>
                      {field.placeholder}
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
            render={({ field: f }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...f}
                  multiple
                  label={field.label}
                  value={Array.isArray(f.value) ? f.value : []}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {(field.options || []).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      <Checkbox checked={f.value?.indexOf(opt) > -1} />
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
                {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
              </FormControl>
            )}
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
                <FormLabel>{field.label}</FormLabel>
                <RadioGroup
                  row
                  value={f.value || ""}
                  onChange={f.onChange}
                  name={f.name}
                >
                  {(field.options || []).map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={opt}
                      control={<Radio />}
                      label={opt}
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
                <FormLabel>{field.label}</FormLabel>
                <FormGroup row>
                  {(field.options || []).map((opt) => (
                    <FormControlLabel
                      key={opt}
                      control={
                        <Checkbox
                          checked={Array.isArray(f.value) && f.value.includes(opt)}
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
                    />
                  ))}
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
