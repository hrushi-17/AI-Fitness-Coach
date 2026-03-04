const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_MR69WUc5_DDuyrCt4LU8v6Maj22te7wpx');

const sendEmail = async (options) => {
    try {
        console.log(`Starting Resend email broadcast to: ${options.email}...`);

        // Resend requires a verified domain to send 'from' custom addresses.
        // For testing/onboarding, we must use their default sandbox domain.
        const fromEmail = process.env.NODE_ENV === 'production' && process.env.EMAIL_FROM
            ? process.env.EMAIL_FROM
            : 'onboarding@resend.dev';

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
