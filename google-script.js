/**
 * UNIVERSAL GOOGLE APPS SCRIPT - LEAD CAPTURE v2.0
 * 
 * FEATURES:
 * - Automatically finds columns by header name (order doesn't matter)
 * - Automatically adds missing columns (like "Message")
 * - Sends formatted email notifications
 */

const CLIENT_EMAIL = "client@cosmicdigital.agency"; // REPLACE WITH YOUR EMAIL

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(10000); // Prevent concurrent write issues
    const data = JSON.parse(e.postData.contents);
    
    // 1. Ensure headers exist and are mapped
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    const requiredHeaders = ["Timestamp", "Name", "Email", "Phone", "Message", "UTM Source", "UTM Medium", "UTM Campaign", "GCLID"];
    
    // Auto-create missing headers
    requiredHeaders.forEach(header => {
      if (headers.indexOf(header) === -1) {
        const lastCol = sheet.getLastColumn();
        sheet.getRange(1, lastCol + 1).setValue(header);
        headers.push(header);
      }
    });

    // 2. Map data to correct columns
    const finalHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = finalHeaders.map(header => {
      switch(header) {
        case "Timestamp": return new Date();
        case "Name": return data.name || "N/A";
        case "Email": return data.email || "N/A";
        case "Phone": return data.phone || "N/A";
        case "Message": return data.message || "N/A";
        case "UTM Source": return data.utm_source || "direct";
        case "UTM Medium": return data.utm_medium || "none";
        case "UTM Campaign": return data.utm_campaign || "none";
        case "GCLID": return data.gcl_id || data.gclid || "none";
        default: return "";
      }
    });

    sheet.appendRow(newRow);
    
    // 3. Send Email
    sendLeadEmail(data);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function sendLeadEmail(data) {
  const subject = `🚀 NEW LEAD: ${data.name} - Cosmic Digital`;
  const body = `
    New Lead Received from Cosmic Digital
    
    --- Lead Details ---
    Name: ${data.name || 'N/A'}
    Email: ${data.email || 'N/A'}
    Phone: ${data.phone || 'N/A'}
    Message: ${data.message || 'No message provided'}
    
    --- Tracking Information ---
    Source: ${data.utm_source || 'N/A'}
    Medium: ${data.utm_medium || 'N/A'}
    Campaign: ${data.utm_campaign || 'N/A'}
    GCLID: ${data.gcl_id || data.gclid || 'N/A'}
    
    ---
    Manage your leads here: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;
  
  MailApp.sendEmail(CLIENT_EMAIL, subject, body);
}
