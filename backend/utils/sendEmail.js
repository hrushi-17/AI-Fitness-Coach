const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 globally to avoid Render's ENETUNREACH IPv6 issues
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

const sendEmail = async (options) => {
    // Log credential status (safely)
    console.log("Email Service Debug Hook:");
    console.log("- USERNAME present:", !!process.env.EMAIL_USERNAME);
    console.log("- PASSWORD present:", !!process.env.EMAIL_PASSWORD);

    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        console.error("CRITICAL: Missing email credentials in environment variables.");
        throw new Error("Email configuration error: check server logs");
    }

    // Clean password
    const cleanPassword = (process.env.EMAIL_PASSWORD || "").trim().replace(/\s/g, "");

    // Use Port 465 (SSL) with explicit host - often more stable than 'service' helper on Render
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: cleanPassword,
        },
        tls: {
            rejectUnauthorized: false,
            servername: "smtp.gmail.com"
        },
        // DEBUGGING: These will show the full SMTP conversation in Render logs
        logger: true,
        debug: true,
        connectionTimeout: 15000, // 15s
        greetingTimeout: 15000,
    });

    const mailOptions = {
        from: `AI Fitness Coach <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.text,
    };

    try {
        console.log(`Starting email transmission to: ${options.email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("SUCCESS: Email sent! Message ID:", info.messageId);
        return info;
    } catch (error) {
        console.error("FAILED to send email.");
        console.error("Error Message:", error.message);
        console.error("Error Code:", error.code);
        console.error("Error Command:", error.command);
        throw error;
    }
};

module.exports = sendEmail;
