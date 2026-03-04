const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_MR69WUc5_DDuyrCt4LU8v6Maj22te7wpx');

const sendEmail = async (options) => {
    try {
        console.log(`Starting Resend email broadcast to: ${options.email}...`);

        // Since the user is on the Resend free tier without a verified domain,
        // we MUST use the sandbox address 'onboarding@resend.dev'.
        // Using anything else (like process.env.EMAIL_FROM) will cause 
        // Resend to reject the email with a 403 Forbidden error.
        const fromEmail = 'onboarding@resend.dev';

        const data = await resend.emails.send({
            from: `AI Fitness Coach <${fromEmail}>`,
            to: options.email,
            subject: options.subject,
            html: options.text, // Resend uses 'html' for HTML content
        });

        console.log("SUCCESS: Email sent via Resend API. ID:", data.id);
        return data;
    } catch (error) {
        console.error("CRITICAL RESEND API FAILURE.");
        console.error("Message:", error.message);
        throw error;
    }
};

module.exports = sendEmail;
