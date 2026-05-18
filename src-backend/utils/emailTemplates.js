const { formatCurrency, formatDate } = require("./formatters");

function buildEmailShell({ title, intro, body }) {
  return `
    <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,sans-serif;color:#10233f;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbe5f0;">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#09162b 0%,#0f3564 100%);color:#ffffff;">
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.8;">Druth Digital</p>
          <h1 style="margin:0;font-size:28px;line-height:1.2;">${title}</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.88);">${intro}</p>
        </div>
        <div style="padding:28px 32px;">
          ${body}
        </div>
      </div>
    </div>
  `;
}

function buildSummaryTable(subscription) {
  const promoRow = subscription.selectedPlan.promoInstallationFee
    ? `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Promo installation</td>
        <td style="padding:12px;border-bottom:1px solid #e6edf5;">${formatCurrency(subscription.selectedPlan.promoInstallationFee)}</td>
      </tr>
    `
    : "";

  return `
    <table style="width:100%;border-collapse:collapse;border:1px solid #e6edf5;border-radius:14px;overflow:hidden;">
      <tbody>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Full name</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${subscription.fullName}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Phone number</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${subscription.phoneNumber}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Email address</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${subscription.emailAddress}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Home address</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${subscription.homeAddress}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Plan</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${subscription.selectedPlan.category} - ${subscription.selectedPlan.planName}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Speed</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${subscription.selectedPlan.speed}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Monthly subscription</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${formatCurrency(subscription.selectedPlan.monthlySubscription)}</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Installation fee</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${formatCurrency(subscription.selectedPlan.installationFee)}</td></tr>
        ${promoRow}
        <tr><td style="padding:12px;border-bottom:1px solid #e6edf5;font-weight:600;">Preferred installation date</td><td style="padding:12px;border-bottom:1px solid #e6edf5;">${formatDate(subscription.preferredInstallationDate)}</td></tr>
        <tr><td style="padding:12px;font-weight:600;">Additional message</td><td style="padding:12px;">${subscription.additionalMessage || "None"}</td></tr>
      </tbody>
    </table>
  `;
}

function buildAdminEmailTemplate(subscription) {
  return buildEmailShell({
    title: "New Subscription Request",
    intro: "A new customer has submitted a broadband subscription request from the website.",
    body: `
      <p style="margin:0 0 20px;font-size:15px;line-height:1.7;">Review the customer details below and follow up promptly.</p>
      ${buildSummaryTable(subscription)}
    `
  });
}

function buildCustomerEmailTemplate(subscription) {
  return buildEmailShell({
    title: "Your Request Has Been Received",
    intro: `Hi ${subscription.fullName}, thank you for choosing Druth Digital. Your request is now in our queue.`,
    body: `
      <p style="margin:0 0 20px;font-size:15px;line-height:1.7;">We have received your internet subscription request and our team will contact you shortly with the next steps.</p>
      ${buildSummaryTable(subscription)}
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;">If you need help before we reach out, reply to this email or contact the support team directly.</p>
    `
  });
}

module.exports = {
  buildAdminEmailTemplate,
  buildCustomerEmailTemplate
};
