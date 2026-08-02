# AgreeForms

A JSON-driven dynamic form application built with React 19, Vite, Material UI, and React Hook Form. Forms are rendered entirely from JSON configuration files — no fields are hardcoded.

## Features

- **JSON-driven forms** — All fields, labels, validation, options, and sections come from JSON config files
- **Dynamic renderer** — Supports 12 field types: text, number, email, phone, textarea, date, dropdown, multiselect, radio, checkbox, file upload, hidden
- **React Hook Form validation** — Required, min/max length, email, phone, regex pattern, number range — all from JSON
- **Conditional visibility** — Show/hide fields based on other field values
- **Google Apps Script integration** — Submits form data directly to a Google Apps Script Web App
- **Responsive UI** — Mobile-first design with MUI, card layout, progress indicator
- **Success/Error flows** — Success animation, error alerts with retry, form preservation on error
- **Bilingual support** — Telugu (default) and English with a language toggle. Each form has separate JSON files per language
- **Extensible** — Add a new form by adding a JSON file + a tab. The renderer requires zero changes.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

## Configuration

### Google Apps Script URL

Set your Google Apps Script Web App URL in `src/config/appConfig.js`:

```js
export const APP_CONFIG = {
  googleAppsScriptUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
};
```

### Google Apps Script Setup

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Open Extensions → Apps Script
3. Paste the following code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // Write headers on first submission
  if (sheet.getLastRow() === 0) {
    const headers = ['formType', 'submittedAt', ...Object.keys(data.data)];
    sheet.appendRow(headers);
  }

  // Append the data row
  const row = [data.formType, data.submittedAt, ...Object.values(data.data)];
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy as a Web App: Deploy → New deployment → Web app
   - Execute as: Me
   - Who has access: Anyone
5. Copy the deployment URL and paste it into `appConfig.js`

## JSON Form Configuration

Forms are defined in JSON files under `src/config/`. Each file defines the form structure:

```json
{
  "formType": "farmer",
  "title": "Farmer Registration",
  "description": "Register as a farmer",
  "sections": [
    {
      "id": "personal",
      "title": "Personal Information",
      "order": 1,
      "fields": [
        {
          "name": "fullName",
          "label": "Full Name",
          "type": "text",
          "placeholder": "Enter your name",
          "required": true,
          "order": 1,
          "validation": {
            "minLength": 2,
            "maxLength": 50
          },
          "defaultValue": ""
        }
      ]
    }
  ]
}
```

### Supported Field Types

| Type | Description |
|------|-------------|
| `text` | Text input |
| `number` | Numeric input with min/max validation |
| `email` | Email input with email pattern validation |
| `phone` | Phone input with 10-digit validation |
| `textarea` | Multi-line text input |
| `date` | Date picker |
| `dropdown` | Single select dropdown (requires `options`) |
| `multiselect` | Multi select dropdown (requires `options`) |
| `radio` | Radio button group (requires `options`) |
| `checkbox` | Single checkbox |
| `file` | File upload |
| `hidden` | Hidden field (not rendered visibly) |

### Validation Rules

| Rule | Applies to | Description |
|------|-----------|-------------|
| `required` | All | Field is required |
| `minLength` | text, textarea, email | Minimum character length |
| `maxLength` | text, textarea, email | Maximum character length |
| `min` | number | Minimum numeric value |
| `max` | number | Maximum numeric value |
| `pattern` | text, phone | Regex pattern string |

### Conditional Visibility

Show a field only when another field has a specific value:

```json
{
  "name": "otherLandType",
  "label": "Specify Other",
  "type": "text",
  "conditional": {
    "showWhen": {
      "field": "landType",
      "equals": "Others"
    }
  }
}
```

## Adding a New Form

1. Create JSON config files in `src/config/` for each language (e.g., `buyer-form.en.json`, `buyer-form.te.json`)
2. Add a new tab in `src/App.jsx` and a new case in `src/hooks/useFormConfig.js`
3. The `DynamicForm` renderer handles the rest — no changes needed to the renderer

## Localization

The app supports Telugu (default) and English. A language toggle button in the AppBar switches between them.

- **Form content** (labels, options, section titles, descriptions) comes from language-specific JSON files: `farmer-form.en.json`, `farmer-form.te.json`, etc.
- **Static UI strings** (tab labels, buttons, messages, validation errors) are defined in `src/config/translations.js`
- **Language state** is managed by `src/context/LanguageContext.jsx` using React Context

### Adding a New Language

1. Add a new language key to `translations.js` with all UI strings
2. Create language-specific JSON files (e.g., `farmer-form.hi.json`)
3. Add the language option to the toggle in `src/App.jsx`

## Project Structure

```
src/
  components/
    DynamicForm/       # Main form renderer
    FormField/         # Individual field renderer (all 12 types)
    Section/           # Section card wrapper
    Loader/            # Loading spinner
    SuccessMessage/    # Success animation + message
    ErrorAlert/        # Error display with retry
  config/
    appConfig.js                    # Google Apps Script URL
    translations.js                 # Static UI strings (en + te)
    farmer-form.en.json             # Farmer form (English)
    farmer-form.te.json             # Farmer form (Telugu)
    service-provider-form.en.json   # Service provider form (English)
    service-provider-form.te.json   # Service provider form (Telugu)
  context/
    LanguageContext.jsx             # Language provider + useLanguage hook
  services/
    api.js                          # Form submission to Google Apps Script
  hooks/
    useFormConfig.js                # Loads JSON config dynamically (per language)
  utils/
    validation.js                   # Maps JSON rules to React Hook Form rules
    conditionalVisibility.js        # Evaluates conditional show/hide
  App.jsx                           # Tab layout with form switching + language toggle
  main.jsx                          # App entry with MUI theme
```

## Tech Stack

- React 19
- Vite
- Material UI (MUI)
- React Hook Form
- Fetch API
# agreetechforms
