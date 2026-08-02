import { Controller, useWatch } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { locations } from "../../config/locations.js";

// Autocomplete field with cascading dependency support.
// Uses `dependsOn` array to watch parent fields and filter options accordingly.
// `dataSource: "locations"` uses the locations data for state → zilla → mandal hierarchy.
export default function AutocompleteField({ field, control, rules, error, errorMsg }) {
  const dependsOn = field.dependsOn || [];

  // Watch all parent field values (hooks must be called unconditionally)
  const stateVal = useWatch({ control, name: dependsOn[0] });
  const zillaVal = useWatch({ control, name: dependsOn[1] });

  // Build options based on dataSource and dependsOn
  let options = [];
  if (field.dataSource === "locations") {
    if (dependsOn.length === 0) {
      options = Object.keys(locations);
    } else if (dependsOn.length === 1) {
      options = stateVal ? Object.keys(locations[stateVal] || {}) : [];
    } else if (dependsOn.length === 2) {
      options =
        stateVal && zillaVal
          ? locations[stateVal]?.[zillaVal] || []
          : [];
    }
  } else if (field.options) {
    options = field.options;
  }

  const isDisabled =
    dependsOn.length > 0 &&
    (dependsOn.length === 1 ? !stateVal : !stateVal || !zillaVal);

  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.defaultValue || null}
      rules={rules}
      render={({ field: f }) => (
        <Autocomplete
          value={f.value || null}
          onChange={(_, newValue) => f.onChange(newValue)}
          options={options}
          disabled={isDisabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={field.label}
              placeholder={field.placeholder}
              error={!!error}
              helperText={errorMsg}
            />
          )}
        />
      )}
    />
  );
}
