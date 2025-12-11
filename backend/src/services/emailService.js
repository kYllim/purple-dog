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
    subject: 'Vérifiez votre adresse email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Purple Dog</h1>
            <p>Bienvenue sur notre plateforme !</p>
          </div>
          <div class="content">
            <h2>Vérifiez votre adresse email</h2>
            <p>Merci de vous être inscrit sur Purple Dog. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Vérifier mon email</a>
            </div>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p><strong>Ce lien expire dans 24 heures.</strong></p>
            <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Purple Dog - Tous droits réservés</p>
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
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Purple Dog</h1>
            <p>Réinitialisation de mot de passe</p>
          </div>
          <div class="content">
            <h2>Réinitialisez votre mot de passe</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Important :</strong> Ce lien expire dans 1 heure.
            </div>
            <p>Si vous n'avez pas demandé de réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.</p>
          </div>
          <div class="footer">
            <p>© 2025 Purple Dog - Tous droits réservés</p>
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

// Email de confirmation de victoire aux enchères
const sendAuctionWinEmail = async (to, objectTitle, amount) => {
  console.log(`[EMAIL MOCK] Pour: ${to} | Sujet: Vous avez gagné l'enchère !`);
  console.log(`Corps: Félicitations ! Vous avez remporté l'objet "${objectTitle}" pour ${amount}€. Le paiement a été traité.`);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAuctionWinEmail
};
