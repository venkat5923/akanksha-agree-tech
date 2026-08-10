// Evaluates conditional visibility rules for a field.
// A field with `conditional.showWhen` is only visible when the condition is met.
// Example: { showWhen: { field: "landType", equals: "Red" } }

export function isFieldVisible(field, formValues) {
  if (!field.conditional || !field.conditional.showWhen) {
    return true;
  }

  const { field: dependsOn, equals, notEquals, in: inValues, contains } =
    field.conditional.showWhen;

  const dependentValue = formValues?.[dependsOn];

  if (equals !== undefined) {
    return dependentValue === equals;
  }

  if (notEquals !== undefined) {
    return dependentValue !== notEquals;
  }

  if (inValues !== undefined && Array.isArray(inValues)) {
    return inValues.includes(dependentValue);
  }

  if (contains !== undefined) {
    if (Array.isArray(dependentValue)) {
      return dependentValue.some(
        (item) =>
          item === contains ||
          (typeof item === "string" &&
            item.toLowerCase().includes(contains.toLowerCase()))
      );
    }
    if (typeof dependentValue === "string") {
      return dependentValue.toLowerCase().includes(contains.toLowerCase());
    }
    return false;
  }

  return true;
}
