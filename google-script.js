/**
 * GOOGLE APPS SCRIPT - LEAD CAPTURE & NOTIFICATION
 * 
 * 1. Open Google Sheets
 * 2. Extensions > Apps Script
 * 3. Paste this code
 * 4. Replace 'CLIENT_EMAIL' with yours
 * 5. Deploy > New Deployment > Web App (Set "Who has access" to "Anyone")
 */

const CLIENT_EMAIL = "client@cosmicdigital.agency"; // Replace with actual client email

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add Headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Name", "Email", "Phone", "Message",
        "UTM Source", "UTM Medium", "UTM Campaign", "UTM Term", "GCLID"
      ]);
    }
    
    // Append Data
    const row = [
      new Date(),
      data.name,
      data.email,
      data.phone,
      data.message || "none",
      data.utm_source || "direct",
      data.utm_medium || "none",
      data.utm_campaign || "none",
      data.utm_term || "none",
      data.gcl_id || data.gclid || "none"
    ];
    
    sheet.appendRow(row);
    
    // Send Email Notification
    sendLeadEmail(data);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendLeadEmail(data) {
  const subject = `🚀 NEW LEAD: ${data.name} - Cosmic Digital`;
  
  const body = `
    New Lead Received from Cosmic Digital Landing Page
    
    --- Lead Details ---
    Name: ${data.name}
    Email: ${data.email}
    Phone: ${data.phone}
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
