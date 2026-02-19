import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesRegion = process.env.AWS_SES_REGION || process.env.AWS_REGION || "ap-south-1";
const ses = new SESClient({ region: sesRegion });
const TO_EMAIL = "sales@tejhas.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "support@tejhas.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function response(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, ...headers },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(204, {}, { "Access-Control-Allow-Methods": "POST, OPTIONS" });
  }

  if (event.requestContext?.http?.method !== "POST") {
    return response(405, { error: "Method not allowed" });
  }

  let data;
  try {
    const raw = typeof event.body === "string" ? event.body : "";
    data = JSON.parse(raw || "{}");
  } catch {
    return response(400, { error: "Invalid JSON body" });
  }

  const { name, email, company, message, phone = "", role = "" } = data;
  if (!name || !email || !company || !message) {
    return response(400, { error: "Missing required fields: name, email, company, message" });
  }

  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "(not provided)"}`,
    `Company: ${company}`,
    `Role: ${role || "(not provided)"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await ses.send(
      new SendEmailCommand({
        Source: FROM_EMAIL,
        Destination: { ToAddresses: [TO_EMAIL] },
        Message: {
          Subject: { Data: "Tejhas website – contact / demo request", Charset: "UTF-8" },
          Body: {
            Text: { Data: textBody, Charset: "UTF-8" },
          },
        },
      })
    );
    return response(200, { ok: true });
  } catch (err) {
    console.error("SES send failed:", err);
    return response(500, { error: "Failed to send message. Please try again later." });
  }
}
