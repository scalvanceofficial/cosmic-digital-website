# 🚀 Google Sheets & Email Integration Guide

Follow this step-by-step guide to connect your Contact Form to a Google Sheet and receive instant lead notifications via email.

## Phase 1: Setup Google Sheet & Script

1.  **Create a New Spreadsheet**:
    - Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
    - Give it a name (e.g., "Cosmic Digital Leads").
    - **Note**: You do NOT need to create any columns or headers. The script will create them automatically on the first submission.
2.  **Open Apps Script**:
    - In the top menu, go to **Extensions** > **Apps Script**.
3.  **Add the Integration Code**:
    - Delete any code already in the editor (`myFunction`).
    - Open the [google-script.js](file:///e:/Scalvance/cosmicdigital/google-script.js) file from your project folder.
    - Copy the entire contents and paste it into the Google Apps Script editor.
4.  **Configure Your Email**:
    - Look for **Line 11** in the script editor:
      ```javascript
      const CLIENT_EMAIL = "client@cosmicdigital.agency";
      ```
    - Replace `client@cosmicdigital.agency` with the email address where you want to receive lead notifications.
5.  **Save Your Project**:
    - Click the 💾 (Save) icon or press `Ctrl + S`. Name the script project "Cosmic Lead Capture".

## Phase 2: Deploy as a Web App

1.  **Deploy**:
    - Click the blue **Deploy** button at the top right.
    - Choose **New deployment**.
2.  **Select Type**:
    - Click the "Select type" gear icon and choose **Web app**.
3.  **Configuration**:
    - **Description**: Initial Deployment.
    - **Execute as**: Me (Your Google Account).
    - **Who has access**: **Anyone** (This is crucial for the form to work).
4.  **Authorize**:
    - Click **Deploy**.
    - You will be asked to "Authorize access". Click it.
    - select your Google account.
    - You might see a "Google hasn't verified this app" warning. Click **Advanced** > **Go to Cosmic Lead Capture (unsafe)**.
    - Click **Allow**.
5.  **Copy the Web App URL**:
    - Once finished, you will see a **Web App URL**.
    - **Copy this URL** immediately. It looks like `https://script.google.com/macros/s/.../exec`.

## Phase 3: Connect to the Website

1.  **Update your Website Code**:
    - Open [script.js](file:///e:/Scalvance/cosmicdigital/script.js) in your local code editor.
2.  **Replace the URL**:
    - Look for **Line 91**:
      ```javascript
      const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';
      ```
    - Replace `YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE` with the URL you copied in Phase 2.
3.  **Save & Upload**:
    - Save the file and upload/refresh your website.

---

## 🔍 How to Test
1.  Go to your **Contact page**.
2.  Fill out the form with test information.
3.  Click **"Get My Free Strategy Session"**.
4.  Check your **Google Sheet**: A new row should appear automatically with your data and tracking parameters (UTM parameters).
5.  Check your **Email**: You should receive a formatted notification with the lead's details.

## ⚠️ Important Notes
- **Deployment Updates**: If you ever change the `google-script.js` code in the Apps Script editor, you **must** click **Deploy** > **Manage deployments** > **Edit** > **New Version** to make the changes live.
- **UTM Tracking**: The script automatically capture UTM Source, Medium, Campaign, and GCLID if they are present in the URL or stored in the visitor's local storage.
