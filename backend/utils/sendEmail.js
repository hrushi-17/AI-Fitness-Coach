const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 first to avoid Render/Gmail connectivity issues (ENETUNREACH)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

const sendEmail = async (options) => {
    // Check for mock credentials or missing credentials
    if (
        !process.env.EMAIL_USERNAME ||
        process.env.EMAIL_USERNAME === "your_email@gmail.com"
    ) {
        console.log("----------------------------------------------------");
        console.log("MOCK EMAIL SERVICE (No credentials provided)");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text: ${options.html || options.text}`); // Handle both html/text props if needed, though controller sends 'text' prop with html content
        console.log("----------------------------------------------------");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        family: 4, // Force IPv4
        lookup: (hostname, options, callback) => {
            dns.lookup(hostname, { family: 4 }, callback);
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        html: options.text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
