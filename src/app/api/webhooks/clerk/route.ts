import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // Use App Password from Gmail
  }
});

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, first_name, last_name } = evt.data;
    const userEmail = email_addresses[0]?.email_address;

    if (userEmail) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: 'Welcome to Trend-X-BTC!',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Trend-X-BTC</title>
              </head>
              <body style="margin: 0; padding: 0; background-color: #000000; color: #ffffff; font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <!-- Header with Logo -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="padding: 20px;">
                      <h1 style="color: #F7931A; font-size: 32px; margin: 0; font-weight: bold;">TREND-X-BTC</h1>
                    </div>
                  </div>

                  <!-- Main Content -->
                  <div style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(247, 147, 26, 0.2); border-radius: 10px; padding: 30px;">
                    <!-- Greeting -->
                    <h2 style="color: #F7931A; margin-bottom: 20px;">Hey ${first_name || 'there'}! 👋</h2>

                    <!-- Thank You Message -->
                    <p style="color: #ffffff; line-height: 1.6; margin-bottom: 20px;">
                      Thank you for signing up for Trend-X-BTC! Welcome to the future of Bitcoin trading AI innovation.
                    </p>

                    <!-- Value Proposition -->
                    <div style="background-color: rgba(247, 147, 26, 0.1); border-left: 4px solid #F7931A; padding: 15px; margin: 20px 0;">
                      <p style="color: #ffffff; margin: 0;">
                        Our sophisticated AI models are trained on extensive blockchain parameters, real-time market sentiments, and comprehensive Binance trading data. Using complex AI algorithms, we deliver highly accurate Bitcoin price forecasting to enhance your trading decisions.
                      </p>
                    </div>

                    <!-- Features Highlight -->
                    <div style="margin: 30px 0;">
                      <h3 style="color: #F7931A; margin-bottom: 15px;">Advanced AI Capabilities </h3>
                      <ul style="color: #ffffff; list-style-type: none; padding: 0;">
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                          <span style="color: #F7931A; position: absolute; left: 0;">•</span> 
                          Blockchain Data Analysis & Pattern Recognition
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                          <span style="color: #F7931A; position: absolute; left: 0;">•</span> 
                          Real-time Market Sentiment Processing
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                          <span style="color: #F7931A; position: absolute; left: 0;">•</span> 
                          Binance Trading Data Integration
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                          <span style="color: #F7931A; position: absolute; left: 0;">•</span> 
                          Integrated Web Search for Latest Market News
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                          <span style="color: #F7931A; position: absolute; left: 0;">•</span> 
                          Advanced LLM-powered Market Analysis
                        </li>
                      </ul>
                    </div>

                    <!-- Feedback Section -->
                    <div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <h3 style="color: #F7931A; margin-bottom: 15px;">Help Us Improve! 💡</h3>
                      <p style="color: #ffffff; margin-bottom: 15px;">
                        Found a bug? Have suggestions for new features? Want to collaborate?
                      </p>
                      <p style="color: #ffffff;">
                        Simply reply to this email - we value your input in making Trend-X-BTC even better!
                      </p>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://trend-x-btc.vercel.app/dashboard" 
                         style="background-color: #F7931A; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Start Exploring Now
                      </a>
                    </div>

                    <!-- Social Proof -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(247, 147, 26, 0.2);">
                      <p style="color: #F7931A; font-size: 14px;">
                        Experience the power of AI-driven Bitcoin trading with Trend-X-BTC
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 12px;">
                    <p style="margin-bottom: 10px;">
                      © ${new Date().getFullYear()} Trend-X-BTC. All rights reserved.
                    </p>
                    <p>
                      Questions or suggestions? Contact us at ahsentahir007@gmail.com
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `
        });
        console.log('Welcome email sent successfully');
      } catch (error) {
        console.error('Error sending welcome email:', error);
      }
    }
  }

  return new Response('', { status: 200 });
} 