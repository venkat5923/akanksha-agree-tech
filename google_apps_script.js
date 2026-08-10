/**
 * ============================================================================
 * AKANKSHA AGREE TECH - GOOGLE APPS SCRIPT WEBHOOK & TABLE AUTO-SETUP
 * ============================================================================
 * Instructions:
 * 1. Open your Google Sheet (e.g. at https://sheets.new)
 * 2. Click Extensions -> Apps Script
 * 3. Replace all code in Code.gs with this script.
 * 4. Select 'setupSpreadsheet' in the function dropdown and click 'Run'.
 *    (This will automatically build and format the 'Farmers' and 'Service_Providers' tables)
 * 5. Click 'Deploy' -> 'New deployment' -> 'Web app'.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web app URL and paste it into src/config/appConfig.js
 * ============================================================================
 */

function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Setup 'Farmers' Table (29 Complete Columns - Field Operator Name first)
  const farmerHeaders = [
    "Field Operator Name",
    "Submission Time",
    "Full Name",
    "Age",
    "Phone Number",
    "Sex",
    "Address Line",
    "Landmark",
    "State",
    "District (Zilla)",
    "Mandal",
    "Land Type",
    "Crop Type",
    "Land Area (acres)",
    "Services Needed",
    "Other Service Details",
    "Drone Operations",
    "Other Drone Details",
    "Tractor Operations",
    "Other Tractor Details",
    "JCB Operations",
    "Other JCB Details",
    "Crop Cutting Operations",
    "Other Crop Cutting Details",
    "Groundnut Machine Operations",
    "Other Groundnut Machine Details",
    "Labour Work Type",
    "Other Labour Details",
    "Number of Labourers"
  ];
  let farmerSheet = ss.getSheetByName("Farmers") || ss.insertSheet("Farmers");
  buildStyledTable(farmerSheet, farmerHeaders, "#1b5e20");

  // 2. Setup 'Service_Providers' Table (26 Complete Columns - Field Operator Name first)
  const providerHeaders = [
    "Field Operator Name",
    "Submission Time",
    "Full Name",
    "Age",
    "Phone Number",
    "Sex",
    "Address Line",
    "Landmark",
    "State",
    "District (Zilla)",
    "Mandal",
    "Services Provided",
    "Other Service Details",
    "Drone Capabilities",
    "Other Drone Details",
    "Tractor Capabilities",
    "Other Tractor Details",
    "JCB Capabilities",
    "Other JCB Details",
    "Crop Cutting Capabilities",
    "Other Crop Cutting Details",
    "Groundnut Machine Capabilities",
    "Other Groundnut Machine Details",
    "Labour Capabilities",
    "Other Labour Details",
    "Available Labour Team Size"
  ];
  let providerSheet = ss.getSheetByName("Service_Providers") || ss.insertSheet("Service_Providers");
  buildStyledTable(providerSheet, providerHeaders, "#1565c0");

  // Remove default 'Sheet1' if present
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log("✅ Tables formatted with all 29 Farmer and 26 Provider headings!");
}

function buildStyledTable(sheet, headers, headerColor) {
  sheet.clear();
  const existingBandings = sheet.getBandings();
  existingBandings.forEach(b => b.remove());

  sheet.appendRow(headers);
  const colCount = headers.length;

  const headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange
    .setBackground(headerColor)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(11)
    .setFontFamily("Roboto")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  sheet.setRowHeight(1, 40);
  sheet.setFrozenRows(1);

  for (let i = 1; i <= colCount; i++) {
    const headerTitle = headers[i - 1];
    const width = Math.max(160, headerTitle.length * 11);
    sheet.setColumnWidth(i, width);
  }

  const tableRange = sheet.getRange(1, 1, 500, colCount);
  tableRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);

  sheet.getRange(2, 1, 499, colCount)
    .setVerticalAlignment("middle")
    .setFontFamily("Roboto")
    .setFontSize(10);

  sheet.getRange(2, 1, 499, 1).setHorizontalAlignment("center");
  sheet.getRange(2, 2, 499, 1).setHorizontalAlignment("center");
}

function formatValue(val) {
  if (Array.isArray(val)) {
    return val.join(", ");
  }
  return val !== null && val !== undefined ? val : "";
}

/**
 * Webhook that receives submissions from Akanksha Agree Tech app
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const payload = JSON.parse(e.postData.contents);
    const formType = payload.formType || "farmer";
    const data = payload.data || {};
    const time = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    if (formType === "service-provider") {
      let sheet = ss.getSheetByName("Service_Providers");
      if (!sheet) {
        setupSpreadsheet();
        sheet = ss.getSheetByName("Service_Providers");
      }
      sheet.appendRow([
        formatValue(data.fieldOperatorName),
        time,
        formatValue(data.fullName),
        formatValue(data.age),
        formatValue(data.phone),
        formatValue(data.sex),
        formatValue(data.addressLine),
        formatValue(data.landmark),
        formatValue(data.state),
        formatValue(data.zilla),
        formatValue(data.mandal),
        formatValue(data.servicesProvided),
        formatValue(data.otherMainServiceDetails),
        formatValue(data.droneCapabilities),
        formatValue(data.otherDroneDetails),
        formatValue(data.tractorCapabilities),
        formatValue(data.otherTractorDetails),
        formatValue(data.jcbCapabilities),
        formatValue(data.otherJcbDetails),
        formatValue(data.cropCuttingCapabilities),
        formatValue(data.otherCropCuttingDetails),
        formatValue(data.groundnutMachineCapabilities),
        formatValue(data.otherGroundnutDetails),
        formatValue(data.labourCapabilities),
        formatValue(data.otherLabourDetails),
        formatValue(data.availableLabourCount)
      ]);
    } else {
      // Farmer Form
      let sheet = ss.getSheetByName("Farmers");
      if (!sheet) {
        setupSpreadsheet();
        sheet = ss.getSheetByName("Farmers");
      }
      sheet.appendRow([
        formatValue(data.fieldOperatorName),
        time,
        formatValue(data.name),
        formatValue(data.age),
        formatValue(data.phone),
        formatValue(data.sex),
        formatValue(data.addressLine),
        formatValue(data.landmark),
        formatValue(data.state),
        formatValue(data.zilla),
        formatValue(data.mandal),
        formatValue(data.landType),
        formatValue(data.cropType),
        formatValue(data.landArea),
        formatValue(data.servicesNeeded),
        formatValue(data.otherMainServiceDetails),
        formatValue(data.droneSprayingType),
        formatValue(data.otherDroneDetails),
        formatValue(data.tractorOperationType),
        formatValue(data.otherTractorDetails),
        formatValue(data.jcbOperationType),
        formatValue(data.otherJcbDetails),
        formatValue(data.cropCuttingType),
        formatValue(data.otherCropCuttingDetails),
        formatValue(data.groundnutMachineType),
        formatValue(data.otherGroundnutDetails),
        formatValue(data.labourType),
        formatValue(data.otherLabourDetails),
        formatValue(data.labourCount)
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
