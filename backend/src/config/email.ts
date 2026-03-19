import nodemailer from 'nodemailer';
import { env } from './env';
import { logger } from './logger';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && env.email.host && env.email.user) {
    transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      secure: env.email.port === 465,
      auth: {
        user: env.email.user,
        pass: env.email.pass,
      },
    });
  }
  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    logger.info({ to }, 'SMTP not configured, skipping email');
    return false;
  }
  try {
    await t.sendMail({
      from: env.email.from,
      to,
      subject,
      html,
    });
    logger.info({ to }, 'Email sent');
    return true;
  } catch (err) {
    logger.error({ err, to }, 'Failed to send email');
    return false;
  }
}
