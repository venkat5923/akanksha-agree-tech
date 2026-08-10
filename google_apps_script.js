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

/**
 * Helper to get the active spreadsheet or create a new one in Google Drive if standalone
 */
function getOrCreateSpreadsheet() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    // Check if the spreadsheet already exists in Google Drive
    const files = DriveApp.getFilesByName("Akanksha_Agree_Tech_Registrations");
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create("Akanksha_Agree_Tech_Registrations");
      Logger.log("🎉 Created new Google Sheet in your Drive: " + ss.getUrl());
    }
  }
  return ss;
}

function setupSpreadsheet() {
  const ss = getOrCreateSpreadsheet();

  // 1. Setup 'Farmers' Table (29 Complete Columns - Dedicated Service Needed Columns)
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
    "Services Needed (Categories)",
    "Other Main Service Details",
    "Drone Services Needed",
    "Other Drone Details",
    "Tractor Services Needed",
    "Other Tractor Details",
    "JCB Services Needed",
    "Other JCB Details",
    "Crop Cutting Services Needed",
    "Other Crop Cutting Details",
    "Groundnut Machine Services Needed",
    "Other Groundnut Details",
    "Labour Work Needed",
    "Other Labour Details",
    "Number of Labourers Needed"
  ];
  let farmerSheet = ss.getSheetByName("Farmers") || ss.insertSheet("Farmers");
  buildStyledTable(farmerSheet, farmerHeaders, "#1b5e20");

  // 2. Setup 'Service_Providers' Table (26 Complete Columns - Dedicated Service Provided Columns)
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
    "Services Provided (Categories)",
    "Other Main Service Details",
    "Drone Services Provided",
    "Other Drone Details",
    "Tractor Services Provided",
    "Other Tractor Details",
    "JCB Services Provided",
    "Other JCB Details",
    "Crop Cutting Services Provided",
    "Other Crop Cutting Details",
    "Groundnut Machine Services Provided",
    "Other Groundnut Details",
    "Labour Services Provided",
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

  Logger.log("✅ Tables formatted with separate dedicated columns!");
  Logger.log("🔗 FULL SPREADSHEET LINK: " + ss.getUrl());
  Logger.log("🌾 FARMERS TAB LINK: " + ss.getUrl() + "#gid=" + farmerSheet.getSheetId());
  Logger.log("🚜 SERVICE PROVIDERS TAB LINK: " + ss.getUrl() + "#gid=" + providerSheet.getSheetId());
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

  sheet.setRowHeight(1, 44);
  sheet.setFrozenRows(1);

  for (let i = 1; i <= colCount; i++) {
    const headerTitle = headers[i - 1];
    const width = Math.max(170, headerTitle.length * 10);
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
    return val.filter(v => v !== null && v !== undefined && v !== "").join(", ");
  }
  return val !== null && val !== undefined ? val : "";
}

function isSelected(categoryList, keyword) {
  if (!categoryList) return false;
  const list = Array.isArray(categoryList) ? categoryList : [categoryList];
  return list.some(item => String(item).toLowerCase().includes(keyword.toLowerCase()));
}

/**
 * Webhook that receives submissions from Akanksha Agree Tech app
 */
function doPost(e) {
  try {
    const ss = getOrCreateSpreadsheet();
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

      // Check relevant services selected by operator
      const services = data.servicesProvided || [];
      const hasDrone = isSelected(services, "drone");
      const hasTractor = isSelected(services, "tractor");
      const hasJcb = isSelected(services, "jcb");
      const hasCropCutting = isSelected(services, "crop cutting") || isSelected(services, "cutting");
      const hasGroundnut = isSelected(services, "groundnut");
      const hasLabour = isSelected(services, "labour");
      const hasOthers = isSelected(services, "other");

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
        formatValue(services),
        hasOthers ? formatValue(data.otherMainServiceDetails) : "",
        hasDrone ? formatValue(data.droneCapabilities) : "",
        hasDrone && isSelected(data.droneCapabilities, "other") ? formatValue(data.otherDroneDetails) : "",
        hasTractor ? formatValue(data.tractorCapabilities) : "",
        hasTractor && isSelected(data.tractorCapabilities, "other") ? formatValue(data.otherTractorDetails) : "",
        hasJcb ? formatValue(data.jcbCapabilities) : "",
        hasJcb && isSelected(data.jcbCapabilities, "other") ? formatValue(data.otherJcbDetails) : "",
        hasCropCutting ? formatValue(data.cropCuttingCapabilities) : "",
        hasCropCutting && isSelected(data.cropCuttingCapabilities, "other") ? formatValue(data.otherCropCuttingDetails) : "",
        hasGroundnut ? formatValue(data.groundnutMachineCapabilities) : "",
        hasGroundnut && isSelected(data.groundnutMachineCapabilities, "other") ? formatValue(data.otherGroundnutDetails) : "",
        hasLabour ? formatValue(data.labourCapabilities) : "",
        hasLabour && isSelected(data.labourCapabilities, "other") ? formatValue(data.otherLabourDetails) : "",
        hasLabour ? formatValue(data.availableLabourCount) : ""
      ]);
    } else {
      // Farmer Form
      let sheet = ss.getSheetByName("Farmers");
      if (!sheet) {
        setupSpreadsheet();
        sheet = ss.getSheetByName("Farmers");
      }

      // Check relevant services requested by farmer
      const services = data.servicesNeeded || [];
      const hasDrone = isSelected(services, "drone");
      const hasTractor = isSelected(services, "tractor");
      const hasJcb = isSelected(services, "jcb");
      const hasCropCutting = isSelected(services, "crop cutting") || isSelected(services, "cutting");
      const hasGroundnut = isSelected(services, "groundnut");
      const hasLabour = isSelected(services, "labour");
      const hasOthers = isSelected(services, "other");

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
        formatValue(services),
        hasOthers ? formatValue(data.otherMainServiceDetails) : "",
        hasDrone ? formatValue(data.droneSprayingType) : "",
        hasDrone && isSelected(data.droneSprayingType, "other") ? formatValue(data.otherDroneDetails) : "",
        hasTractor ? formatValue(data.tractorOperationType) : "",
        hasTractor && isSelected(data.tractorOperationType, "other") ? formatValue(data.otherTractorDetails) : "",
        hasJcb ? formatValue(data.jcbOperationType) : "",
        hasJcb && isSelected(data.jcbOperationType, "other") ? formatValue(data.otherJcbDetails) : "",
        hasCropCutting ? formatValue(data.cropCuttingType) : "",
        hasCropCutting && isSelected(data.cropCuttingType, "other") ? formatValue(data.otherCropCuttingDetails) : "",
        hasGroundnut ? formatValue(data.groundnutMachineType) : "",
        hasGroundnut && isSelected(data.groundnutMachineType, "other") ? formatValue(data.otherGroundnutDetails) : "",
        hasLabour ? formatValue(data.labourType) : "",
        hasLabour && isSelected(data.labourType, "other") ? formatValue(data.otherLabourDetails) : "",
        hasLabour ? formatValue(data.labourCount) : ""
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
