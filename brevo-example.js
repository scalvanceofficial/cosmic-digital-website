/**
 * OPTION 2: ADVANCED BREVO INTEGRATION (Node.js/Backend Example)
 * 
 * For scaling, using a dedicated Email Service Provider like Brevo is better.
 * This example shows how you would send the lead notification via Brevo's API.
 */

// Install: npm install @getbrevo/brevo
// const SibApiV3Sdk = require('@getbrevo/brevo');

async function sendBrevoNotification(leadData) {
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = 'YOUR_BREVO_API_KEY';

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "🚀 New Lead: {{params.name}}";
  sendSmtpEmail.sender = { "name": "Cosmic Digital Web", "email": "system@cosmicdigital.agency" };
  sendSmtpEmail.to = [{ "email": "client@cosmicdigital.agency", "name": "Client" }];
  
  sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>New Incoming Lead</h1>
        <p><strong>Name:</strong> {{params.name}}</p>
        <p><strong>Email:</strong> {{params.email}}</p>
        <p><strong>Phone:</strong> {{params.phone}}</p>
        <hr>
        <h3>Marketing Data</h3>
        <p>Source: {{params.utm_source}}</p>
        <p>GCLID: {{params.gclid}}</p>
      </body>
    </html>
  `;
  
  sendSmtpEmail.params = {
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    utm_source: leadData.utm_source || 'direct',
    gclid: leadData.gclid || 'N/A'
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

/**
 * WHY USE BREVO?
 * 1. Higher deliverability than Google's MailApp.
 * 2. Detailed analytics (opened, clicked).
 * 3. Branding/Templates: Use their drag-and-drop editor for beautiful emails.
 * 4. Scale: Can handle thousands of emails per minute without being flagged as spam.
 */
