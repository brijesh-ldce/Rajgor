import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.FROM_EMAIL || "Rajgor Samaj <noreply@rajgorsamaj.com>";
const adminEmail = process.env.ADMIN_EMAIL || "admin@rajgorsamaj.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function getAppBaseUrl() {
  return (
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  );
}

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(payload: EmailPayload) {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not configured. Email would have been sent:",
      payload
    );
    return;
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  } catch (error) {
    console.error("[email] Failed to send email via Resend:", {
      payload,
      error,
    });
    // We shouldn't necessarily crash the process if email fails
  }
}

export async function sendAdminNewRegistrationEmail(userName: string, userEmail: string) {
  const adminUrl = `${getAppBaseUrl()}/admin/users`;
  await sendEmail({
    to: adminEmail,
    subject: "New member pending approval - Rajgor Samaj",
    html: `
      <h2>New Member Registration</h2>
      <p>A new member has registered and is pending approval.</p>
      <p><strong>Name:</strong> ${userName}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><a href="${adminUrl}">Review in Admin Panel</a></p>
    `,
  });
}

export async function sendApprovalEmail(toEmail: string, userName: string) {
  const loginUrl = `${getAppBaseUrl()}/login`;
  await sendEmail({
    to: toEmail,
    subject: "Welcome to Rajgor Brahmin Samaj",
    html: `
      <h2>Welcome, ${userName}!</h2>
      <p>Your account has been approved by the admin. You can now access all features of the Rajgor Brahmin Samaj platform.</p>
      <p><a href="${loginUrl}">Click here to Login</a></p>
    `,
  });
}

export async function sendRejectionEmail(toEmail: string, userName: string, reason?: string) {
  await sendEmail({
    to: toEmail,
    subject: "Registration Update - Rajgor Samaj",
    html: `
      <h2>Registration Update for ${userName}</h2>
      <p>Your registration for the Rajgor Brahmin Samaj platform could not be approved at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>If you think this was a mistake, please reply to this email to contact the administration.</p>
    `,
  });
}
