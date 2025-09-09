use super::*;
use lettre::{Message, SmtpTransport, Transport};
use lettre::message::{header::ContentType, Mailbox};
use lettre::transport::smtp::authentication::Credentials;
use std::env;

#[derive(Clone)]
pub struct EmailService {
    smtp_host: String,
    smtp_port: u16,
    smtp_username: String,
    smtp_password: String,
    from_email: String,
    from_name: String,
}

impl EmailService {
    pub fn new() -> Self {
        Self {
            smtp_host: env::var("SMTP_HOST").unwrap_or_else(|_| "localhost".to_string()),
            smtp_port: env::var("SMTP_PORT")
                .unwrap_or_else(|_| "587".to_string())
                .parse()
                .unwrap_or(587),
            smtp_username: env::var("SMTP_USERNAME").unwrap_or_else(|_| "".to_string()),
            smtp_password: env::var("SMTP_PASSWORD").unwrap_or_else(|_| "".to_string()),
            from_email: env::var("FROM_EMAIL").unwrap_or_else(|_| "noreply@nia.app".to_string()),
            from_name: env::var("FROM_NAME").unwrap_or_else(|_| "Nia".to_string()),
        }
    }
    
    pub async fn send_password_reset_email(&self, to_email: &str, reset_token: &str) -> Result<(), AuthError> {
        let reset_url = format!("https://nia.app/reset-password?token={}", reset_token);
        
        let html_body = format!(r#"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Password Reset - Nia</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: #1da1f2; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background: #f9f9f9; }}
                    .button {{ display: inline-block; background: #1da1f2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Nia</h1>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your Nia account. If you made this request, click the button below to reset your password:</p>
                        <a href="{}" class="button">Reset Password</a>
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p><a href="{}">{}</a></p>
                        <p>This link will expire in 1 hour for security reasons.</p>
                        <p>If you didn't request a password reset, you can safely ignore this email.</p>
                        <p>Best regards,<br>The Nia Team</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent from Nia. If you have any questions, please contact our support team.</p>
                    </div>
                </div>
            </body>
            </html>
        "#, reset_url, reset_url, reset_url);
        
        let text_body = format!(r#"
            Password Reset Request
            
            Hello,
            
            We received a request to reset your password for your Nia account. If you made this request, visit the following link to reset your password:
            
            {}
            
            This link will expire in 1 hour for security reasons.
            
            If you didn't request a password reset, you can safely ignore this email.
            
            Best regards,
            The Nia Team
        "#, reset_url);
        
        self.send_email(
            to_email,
            "Password Reset - Nia",
            &html_body,
            &text_body,
        ).await
    }
    
    pub async fn send_email_verification(&self, to_email: &str, verification_token: &str) -> Result<(), AuthError> {
        let verification_url = format!("https://nia.app/verify-email?token={}", verification_token);
        
        let html_body = format!(r#"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Verify Your Email - Nia</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: #1da1f2; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background: #f9f9f9; }}
                    .button {{ display: inline-block; background: #1da1f2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Nia</h1>
                    </div>
                    <div class="content">
                        <h2>Verify Your Email Address</h2>
                        <p>Hello,</p>
                        <p>Thank you for signing up for Nia! To complete your registration, please verify your email address by clicking the button below:</p>
                        <a href="{}" class="button">Verify Email</a>
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p><a href="{}">{}</a></p>
                        <p>This link will expire in 24 hours for security reasons.</p>
                        <p>If you didn't create an account with Nia, you can safely ignore this email.</p>
                        <p>Best regards,<br>The Nia Team</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent from Nia. If you have any questions, please contact our support team.</p>
                    </div>
                </div>
            </body>
            </html>
        "#, verification_url, verification_url, verification_url);
        
        let text_body = format!(r#"
            Verify Your Email Address
            
            Hello,
            
            Thank you for signing up for Nia! To complete your registration, please verify your email address by visiting the following link:
            
            {}
            
            This link will expire in 24 hours for security reasons.
            
            If you didn't create an account with Nia, you can safely ignore this email.
            
            Best regards,
            The Nia Team
        "#, verification_url);
        
        self.send_email(
            to_email,
            "Verify Your Email - Nia",
            &html_body,
            &text_body,
        ).await
    }
    
    pub async fn send_welcome_email(&self, to_email: &str, username: &str) -> Result<(), AuthError> {
        let html_body = format!(r#"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Welcome to Nia!</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: #1da1f2; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background: #f9f9f9; }}
                    .button {{ display: inline-block; background: #1da1f2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Nia!</h1>
                    </div>
                    <div class="content">
                        <h2>Hello {}!</h2>
                        <p>Welcome to Nia! We're excited to have you join our community.</p>
                        <p>Here are some things you can do to get started:</p>
                        <ul>
                            <li>Complete your profile</li>
                            <li>Follow interesting people</li>
                            <li>Share your thoughts and ideas</li>
                            <li>Discover trending topics</li>
                        </ul>
                        <a href="https://nia.app" class="button">Get Started</a>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        <p>Best regards,<br>The Nia Team</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent from Nia. If you have any questions, please contact our support team.</p>
                    </div>
                </div>
            </body>
            </html>
        "#, username);
        
        let text_body = format!(r#"
            Welcome to Nia!
            
            Hello {}!
            
            Welcome to Nia! We're excited to have you join our community.
            
            Here are some things you can do to get started:
            - Complete your profile
            - Follow interesting people
            - Share your thoughts and ideas
            - Discover trending topics
            
            Visit https://nia.app to get started.
            
            If you have any questions, feel free to reach out to our support team.
            
            Best regards,
            The Nia Team
        "#, username);
        
        self.send_email(
            to_email,
            "Welcome to Nia!",
            &html_body,
            &text_body,
        ).await
    }
    
    async fn send_email(&self, to_email: &str, subject: &str, html_body: &str, text_body: &str) -> Result<(), AuthError> {
        let from: Mailbox = format!("{} <{}>", self.from_name, self.from_email)
            .parse()
            .map_err(|_| AuthError::InternalError)?;
        
        let to: Mailbox = to_email.parse()
            .map_err(|_| AuthError::InternalError)?;
        
        let email = Message::builder()
            .from(from)
            .to(to)
            .subject(subject)
            .multipart(
                lettre::message::MultiPart::alternative()
                    .singlepart(
                        lettre::message::SinglePart::builder()
                            .header(ContentType::TEXT_PLAIN)
                            .body(text_body.to_string())
                    )
                    .singlepart(
                        lettre::message::SinglePart::builder()
                            .header(ContentType::TEXT_HTML)
                            .body(html_body.to_string())
                    )
            )
            .map_err(|_| AuthError::InternalError)?;
        
        let creds = Credentials::new(self.smtp_username.clone(), self.smtp_password.clone());
        
        let mailer = SmtpTransport::relay(&self.smtp_host)
            .map_err(|_| AuthError::InternalError)?
            .port(self.smtp_port)
            .credentials(creds)
            .build();
        
        mailer.send(&email)
            .map_err(|_| AuthError::InternalError)?;
        
        info!("Email sent to: {}", to_email);
        Ok(())
    }
}