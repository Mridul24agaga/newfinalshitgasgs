"use server"

import { headers } from "next/headers"

type EmailRecipient = {
  email: string
  name?: string
}

type EmailParams = {
  subject: string
  htmlContent: string
  sender: EmailRecipient
  to: EmailRecipient[]
  params?: Record<string, any>
}

/**
 * Adds a contact to Brevo and assigns them to a list
 */
export async function addContactToBrevo(contact: {
  email: string
  username: string
  listIds?: number[]
}) {
  const { email, username, listIds } = contact
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    console.error("BREVO_API_KEY is not defined")
    throw new Error("Email service configuration error: BREVO_API_KEY is missing")
  }

  try {
    console.log("Adding contact to Brevo:", email)

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: {
          USERNAME: username,
          SIGNUP_DATE: new Date().toISOString(),
          SIGNUP_SOURCE: "Website Registration",
        },
        listIds: listIds || [2], // Update the contact if it already exists
        updateEnabled: true,
      }),
    })

    // Check if the response is valid before parsing
    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json()
      } catch (error) {
        console.error("Failed to parse response as JSON:", error)
        data = { message: "Invalid response from Brevo API" }
      }
    } else {
      // Handle non-JSON responses
      const text = await response.text()
      console.error("Non-JSON response:", text)
      data = { message: "Unexpected response format from Brevo API" }
    }

    if (!response.ok) {
      // If the error is that the contact already exists, we can ignore it
      if (response.status === 400 && data?.message?.includes("Contact already exist")) {
        console.log("Contact already exists in Brevo:", email)
        return { success: true, message: "Contact already exists", data }
      }

      console.error("Brevo API error:", data)
      throw new Error(data.message || "Failed to add contact to Brevo")
    }

    console.log("Contact added to Brevo successfully:", email)
    return { success: true, data }
  } catch (error) {
    console.error("Error adding contact to Brevo:", error)
    throw error
  }
}

/**
 * Sends an email using Brevo API
 */
export async function sendEmail({ subject, htmlContent, sender, to, params = {} }: EmailParams) {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    console.error("BREVO_API_KEY is not defined")
    throw new Error("Email service configuration error: BREVO_API_KEY is missing")
  }

  try {
    console.log("Sending email to:", to[0].email)

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender,
        to,
        subject,
        htmlContent,
        params,
      }),
    })

    let responseData
    try {
      responseData = await response.json()
    } catch (error) {
      const text = await response.text()
      console.error("Failed to parse email response:", text)
      responseData = { message: "Invalid response from Brevo API" }
    }

    if (!response.ok) {
      console.error("Brevo API error:", {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      })
      throw new Error(`Failed to send email: ${response.status} - ${responseData?.message || response.statusText}`)
    }

    console.log("Email sent successfully:", responseData)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

/**
 * Sends an onboarding email to a new user
 * First adds them to a contact list, then sends the email
 */
export async function sendOnboardingEmail(user: { email: string; username: string }) {
  const { email, username } = user

  try {
    // Step 1: Add the contact to Brevo
    await addContactToBrevo({
      email,
      username,
    })

    // Step 2: Get the base URL for assets in the email
    const headersList = await headers()
    const host = headersList.get("host") || "localhost:3000"
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Company info
    const companyName = "GetMoreSEO"
    const companyLogo = `${baseUrl}/placeholder.svg?height=150&width=150&query=GetMoreSEO%20logo` // Fallback to a placeholder if no logo

    // Step 3: Send the onboarding email
    return sendEmail({
      subject: `Welcome to ${companyName}`,
      htmlContent: getOnboardingEmailTemplate({
        username,
        companyName,
        baseUrl,
      }),
      sender: {
        email: "founder@markupxbrands.com", // Update with your actual sender email
        name: `Founder, ${companyName}`,
      },
      to: [
        {
          email,
          name: username,
        },
      ],
      params: {
        username,
        companyName,
      },
    })
  } catch (error) {
    console.error("Error in onboarding email process:", error)
    throw error
  }
}

/**
 * Returns the HTML template for the onboarding email
 */
function getOnboardingEmailTemplate({
  username,
  companyName,
  baseUrl,
}: {
  username: string
  companyName: string
  baseUrl: string
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${companyName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e1e1e1;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .email-header {
          background-color: #294fd6;
          padding: 24px;
          text-align: center;
        }
        
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: white;
        }
        
        .email-body {
          padding: 0;
        }
        
        .welcome-section {
          padding: 30px;
          border-bottom: 1px solid #e1e1e1;
        }
        
        .welcome-message {
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 15px 0;
          color: #1a1a1a;
        }
        
        .content-section {
          padding: 30px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 15px;
          color: #294fd6;
        }
        
        .feature-list {
          margin-bottom: 25px;
          padding-left: 0;
          list-style-type: none;
        }
        
        .feature-item {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        
        .feature-icon {
          width: 22px;
          height: 22px;
          background-color: #294fd6;
          border-radius: 50%;
          display: inline-block;
          margin-right: 12px;
          flex-shrink: 0;
          color: white;
          font-weight: bold;
          font-size: 12px;
          text-align: center;
          line-height: 22px;
        }

        .check-icon {
          font-size: 14px;
          line-height: 22px;
        }

        .number-icon {
          font-size: 12px;
          font-weight: bold;
          line-height: 22px;
        }
        
        .feature-text {
          flex: 1;
          font-size: 14px;
        }
        
        .divider {
          height: 1px;
          background-color: #e1e1e1;
          margin: 25px 0;
        }
        
        .cta-button {
          display: inline-block;
          background-color: #294fd6;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
        }
        
        .backlinks-button {
          display: inline-block;
          background-color: #294fd6;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
          margin-top: 15px;
        }
        
        .signature-section {
          margin-top: 30px;
        }
        
        .signature {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        
        .signature-title {
          color: #6b7280;
          font-size: 14px;
          margin-top: 0;
        }
        
        .email-footer {
          background-color: #f7f9fc;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e1e1e1;
        }
        
        .footer-links {
          margin-bottom: 15px;
        }
        
        .footer-link {
          color: #294fd6;
          text-decoration: none;
          margin: 0 10px;
        }
        
        .company-info {
          margin-top: 15px;
        }
        
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100%;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="logo">${companyName}</div>
        </div>
        
        <div class="email-body">
          <div class="welcome-section">
            <h1 class="welcome-message">Hey ${username},</h1>
            <p>Welcome to GetMoreSEO. We're here to help you scale your SEO efforts efficiently.</p>
          </div>
          
          <div class="content-section">
            <h2 class="section-title">Why SEO Matters:</h2>
            <ul class="feature-list">
              <li class="feature-item">
                <div class="feature-icon check-icon">✓</div>
                <div class="feature-text">Organic traffic compounds over time.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon check-icon">✓</div>
                <div class="feature-text">Paid ads stop when budgets do.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon check-icon">✓</div>
                <div class="feature-text">Google rewards consistency, not sporadic efforts.</div>
              </li>
            </ul>
            
            <h2 class="section-title">What You Get:</h2>
            <ul class="feature-list">
              <li class="feature-item">
                <div class="feature-icon check-icon">✓</div>
                <div class="feature-text">AI that writes, formats, and publishes SEO-optimized blogs.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon check-icon">✓</div>
                <div class="feature-text">No need for writers, editors, or freelancers.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon check-icon">✓</div>
                <div class="feature-text">Content aligned with Google's E-E-A-T principles.</div>
              </li>
            </ul>
            
            <h2 class="section-title">SEO Growth Tips:</h2>
            <ul class="feature-list">
              <li class="feature-item">
                <div class="feature-icon number-icon">1</div>
                <div class="feature-text">Target the right keywords.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon number-icon">2</div>
                <div class="feature-text">Ensure your content meets search intent.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon number-icon">3</div>
                <div class="feature-text">Optimize your website's speed and mobile-friendliness.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon number-icon">4</div>
                <div class="feature-text">Build quality backlinks. <a href="https://www.getmorebacklinks.org/" style="color: #294fd6; text-decoration: none; font-weight: 500;">Get our free directory list</a>.</div>
              </li>
              <li class="feature-item">
                <div class="feature-icon number-icon">5</div>
                <div class="feature-text">Regularly update and refresh your content.</div>
              </li>
            </ul>
            
            <div class="divider"></div>
            
            <div class="cta-section">
              <p>We've created a comprehensive SEO checklist to help you implement best practices.</p>
              <a href="https://charming-wednesday-936.notion.site/18ac8ab792fa8047ab4bda7b6e3474e4?v=18ac8ab792fa81f08731000ca1518f82" class="cta-button" style="color: #ffffff !important;">Access Your SEO Checklist</a>
            </div>
            
            <p>Need assistance? Reach out directly to the profiles linked on our website.</p>
            
            <div class="signature-section">
              <p class="signature">Let's get you ranking,</p>
              <p class="signature-title">Founder, GetMoreSEO</p>
            </div>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-links">
            <a href="#" class="footer-link">Help Center</a>
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
          </div>
          
          <div class="company-info">
            <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            <p>You're receiving this email because you signed up for ${companyName}.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Test function to manually send an email
 */
export async function testSendEmail(email: string) {
  try {
    console.log("Testing email sending to:", email)
    const result = await sendOnboardingEmail({
      email,
      username: "TestUser",
    })
    console.log("Test email result:", result)
    return { success: true, message: "Test email sent successfully" }
  } catch (error: any) {
    console.error("Test email error:", error)
    return {
      success: false,
      message: error.message || "Failed to send test email",
      error: error.toString(),
    }
  }
}

/**
 * Sends a notification email to the admin when a new user signs up
 */
export async function sendAdminNotification(user: { email: string; username: string }) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@getmoreseo.com"

  return sendEmail({
    subject: "New User Registration",
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #294fd6;">New User Registration</h1>
          <p>A new user has registered on your platform:</p>
          <ul>
            <li><strong>Username:</strong> ${user.username}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>You can view their profile in the admin dashboard.</p>
        </body>
      </html>
    `,
    sender: {
      email: "notifications@getmoreseo.com",
      name: "GetMoreSEO Notifications",
    },
    to: [
      {
        email: adminEmail,
        name: "Admin",
      },
    ],
  })
}
