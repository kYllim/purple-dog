const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email de vérification d'email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Purple Dog" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Vérifiez votre adresse email - Purple Dog',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #F1F5F9; 
          }
          .container { 
            max-width: 500px; 
            margin: 60px auto; 
            background: white; 
            border-radius: 16px; 
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .icon {
            width: 80px;
            height: 80px;
            background: #FEF3C7;
            border-radius: 50%;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          h1 {
            color: #0F172A;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          p {
            color: #64748B;
            font-size: 15px;
            line-height: 1.6;
            margin: 12px 0;
          }
          .email {
            color: #C5A059;
            font-weight: bold;
          }
          .button { 
            display: inline-block; 
            padding: 16px 48px; 
            background: #C5A059; 
            color: white; 
            text-decoration: none; 
            border-radius: 10px; 
            margin: 28px 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-size: 13px;
          }
          .warning {
            background: #FEF3C7;
            border-left: 4px solid #C5A059;
            padding: 14px;
            margin: 24px 0;
            border-radius: 6px;
            text-align: left;
            font-size: 14px;
          }
          .footer {
            color: #94A3B8;
            font-size: 13px;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2">
              <path d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          
          <h1>Vérifiez votre email</h1>
          
          <p>Un email de confirmation a été envoyé à <span class="email">${email}</span></p>
          
          <p>Cliquez sur le lien dans l'email pour activer votre compte.<br><strong>N'oubliez pas de vérifier vos spams !</strong></p>

          <a href="${verificationUrl}" class="button">Vérifier mon email</a>

          <div class="warning">
            <strong>⚠️ Important :</strong> Le lien expire dans 24 heures.
          </div>
          
          <div class="footer">
            © 2025 Purple Dog - Tous droits réservés
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de vérification envoyé à:', email);
  } catch (error) {
    console.error('Erreur envoi email de vérification:', error);
    throw error;
  }
};

// Email de réinitialisation de mot de passe
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Purple Dog" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Purple Dog',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #0F172A; 
            margin: 0; 
            padding: 0; 
            background-color: #F1F5F9; 
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: #0F172A; 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 32px; 
            font-weight: 900; 
            letter-spacing: -1px;
            text-transform: uppercase;
          }
          .header .gold { 
            color: #C5A059; 
          }
          .content { 
            background: white; 
            padding: 40px 30px; 
          }
          .content h2 {
            color: #0F172A;
            font-size: 24px;
            margin-top: 0;
            font-weight: bold;
          }
          .content p {
            color: #475569;
            font-size: 16px;
            margin: 15px 0;
          }
          .button { 
            display: inline-block; 
            padding: 16px 40px; 
            background: #C5A059; 
            color: white; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 14px;
          }
          .button:hover {
            background: #B08F4A;
          }
          .link-box {
            background: #F1F5F9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            word-break: break-all;
          }
          .link-box a {
            color: #C5A059;
            text-decoration: none;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            background: #F8FAFC;
            color: #94A3B8; 
            font-size: 14px; 
            border-top: 1px solid #E2E8F0;
          }
          .warning {
            background: #FEF3C7;
            border-left: 4px solid #C5A059;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PURPLE<span class="gold">DOG</span></h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Réinitialisation de mot de passe</p>
          </div>
          <div class="content">
            <h2>Réinitialisez votre mot de passe</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <div class="link-box">
              <a href="${resetUrl}">${resetUrl}</a>
            </div>
            <div class="warning">
              <strong>⚠️ Important :</strong> Ce lien expire dans 1 heure.
            </div>
            <p style="color: #94A3B8; font-size: 14px;">Si vous n'avez pas demandé de réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.</p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2025 Purple Dog - Tous droits réservés</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de réinitialisation envoyé à:', email);
  } catch (error) {
    console.error('Erreur envoi email de réinitialisation:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
