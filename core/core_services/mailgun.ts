// import FormData from "form-data";
// import Mailgun from "mailgun.js";
// import dotenv from "dotenv";
// dotenv.config();
// const mailgun = new Mailgun(FormData);
// console.log(process.env.MAILGUN_API_KEY);

// const mg = mailgun.client({
//     username: "api",
//     key: process.env.MAILGUN_API_KEY!,
//     url: process.env.MAILGUN_API_URL || "https://api.mailgun.net", // optional
// });

// export async function sendEmail(to: string, subject: string, text: string) {
//     try {
//         const resp = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
//             from: `postmaster@${process.env.MAILGUN_DOMAIN!}`,
//             to: [to],
//             subject,
//             text,
//         });

//         console.log("Mail sent:", resp.id);
//         return resp;
//     } catch (err) {
//         console.error("Mail error:", err);
//         throw err;
//     }
// }
