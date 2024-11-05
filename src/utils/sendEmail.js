import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, emailContent) => {
  
  // Configure o serviço de e-mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADM,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configurar o conteúdo do e-mail
  const mailOptions = {
    from: process.env.EMAIL_ADM,
    to: to,
    subject: subject,
    html:  emailContent,
  };
  
   // Enviar o e-mail
  await transporter.sendMail(mailOptions);
};
