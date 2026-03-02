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

    // Resolve smtp.gmail.com to an IPv4 address to force IPv4 and avoid ENETUNREACH on Render
    let smtpHost = "smtp.gmail.com";
    try {
        const addresses = await dns.promises.resolve4(smtpHost);
        if (addresses && addresses.length > 0) {
            smtpHost = addresses[0];
            console.log(`Resolved ${"smtp.gmail.com"} to IPv4: ${smtpHost}`);
        }
    } catch (dnsErr) {
        console.warn("DNS resolution for smtp.gmail.com failed, falling back to hostname:", dnsErr);
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: 465,
        secure: true, // Use implicit SSL/TLS for port 465
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        servername: "smtp.gmail.com", // Crucial for TLS SNI when using an IP address
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000, // 10 seconds
        socketTimeout: 15000, // 15 seconds
        family: 4, // Force IPv4
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
