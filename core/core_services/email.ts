// import { EmailError } from "@core/errors/BasicError";
// import nodemailer from "nodemailer";


// export const transport = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT!),
//     auth: {
//         user: process.env.SMTP_USER!,
//         pass: process.env.SMTP_PASSWORD!
//     },
//     secure: false,
// });

// export const sendMail = (to: string, subject: string, text: string, html: string) => {
//     try {
//         return transport.sendMail({ from: process.env.SMTP_USER!, to, subject, text, html });
//     } catch (error) {
//         throw new EmailError("Error in sending email", error);
//     }
// };

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// export function otpEmailTemplate(otp: string) {
//     return `
//     <div style="font-family: Arial; padding: 24px;">
//       <h2>Password Reset OTP</h2>
//       <p>Your OTP is:</p>
//       <h1 style="letter-spacing: 6px;">${otp}</h1>
//       <p>This OTP expires in <b>10 minutes</b>.</p>
//       <p>If you did not request this, ignore this email.</p>
//     </div>
//   `;
// }
