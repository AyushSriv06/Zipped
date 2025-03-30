import { Resend } from 'resend';
require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    const response = await resend.emails.send({
      from: 'ayushsrisks@gmail.com', // Must be a verified domain email
      to: [to],
      subject: subject,
      html: body,
    });
    return response;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};
