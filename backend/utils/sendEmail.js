const nodemailer = require("nodemailer");
const dns = require("dns");

/**
 * GLOBAL DNS OVERRIDE
 * Forces the entire Node.js process to ignore IPv6 (AAAA) records.
 * This is the only definitive way to stop Nodemailer from attempting 
 * IPv6 connections that result in ENETUNREACH on platforms like Render.
 */
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = { family: 4 };
    } else if (typeof options === "object") {
        options.family = 4;
    } else {
        options = { family: 4 };
    }
    return originalLookup(hostname, options, callback);
};

// Also set the result order as a secondary line of defense
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

const sendEmail = async (options) => {
    // 1. Sanitize the App Password
    const cleanPassword = (process.env.EMAIL_PASSWORD || "").trim().replace(/\s/g, "");

    // 2. Configure Transporter
    // Port 587 with secure: false (STARTTLS) is often more reliable than 465 
    // when facing firewall restrictions in cloud environments.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: cleanPassword,
        },
        tls: {
            rejectUnauthorized: false, // Bypass certificate issues in internal networks
        },
        // TIMEOUTS: Minimize "Pending" states as requested by the user
        connectionTimeout: 5000, // 5 seconds
        greetingTimeout: 5000,
        socketTimeout: 5000,
        logger: true, // Keep logging active for the user to see the conversation
        debug: true,
    });

    const mailOptions = {
        from: `AI Fitness Coach <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.text,
    };

    try {
        console.log(`Starting definitive email broadcast to: ${options.email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("SUCCESS: SMTP handshake complete. ID:", info.messageId);
        return info;
    } catch (error) {
        console.error("CRITICAL SMTP FAILURE.");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        throw error;
    }
};

module.exports = sendEmail;
