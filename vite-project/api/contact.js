import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, query } = req.body;

    if (!name || !email || !query) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // NOTE: Saving to file is NOT supported on Vercel (ephemeral filesystem).
    // We will try to send an email if configured, otherwise just log.

    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'support@aadivaani.in', // Target email
                subject: `AadiVaani Query: ${name}`,
                text: `Name: ${name}\nEmail: ${email}\n\nQuery:\n${query}`
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
            return res.status(200).json({ message: 'Message sent successfully via email' });
        } else {
            console.log("Email configuration missing. Query received but not saved (Serverless):", { name, email, query });
            return res.status(200).json({ message: 'Message received (Note: No storage configured on Vercel)' });
        }

    } catch (error) {
        console.error('Error processing contact:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
