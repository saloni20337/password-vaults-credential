package com.passwordvault.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.auth.oauth2.UserCredentials;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;

import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Properties;

@Service
public class GmailService {

    @Value("${GMAIL_CLIENT_ID}")
    private String clientId;

    @Value("${GMAIL_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${GMAIL_REFRESH_TOKEN}")
    private String refreshToken;

    @Value("${GMAIL_USER_EMAIL}")
    private String senderEmail;

    public void sendOtpEmail(String toEmail, String otp) {

        try {
            GoogleCredential credential = new GoogleCredential.Builder()
                    .setTransport(GoogleNetHttpTransport.newTrustedTransport())
                    .setJsonFactory(GsonFactory.getDefaultInstance())
                    .setClientSecrets(clientId, clientSecret)
                    .build()
                    .setRefreshToken(refreshToken);

            Gmail gmail = new Gmail.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    credential)
                    .setApplicationName("Password Vault")
                    .build();

            Properties props = new Properties();
            Session session = Session.getDefaultInstance(props, null);

            MimeMessage email = new MimeMessage(session);

            email.setFrom(new InternetAddress(senderEmail));
            email.addRecipient(
                    jakarta.mail.Message.RecipientType.TO,
                    new InternetAddress(toEmail)
            );

            email.setSubject("Password Vault - OTP");
            email.setText(
                    "Your Password Vault OTP is: " + otp +
                    "\n\nThis OTP is valid for a limited time." +
                    "\n\nPlease do not share this OTP with anyone."
            );

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            email.writeTo(buffer);

            String encodedEmail = Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(buffer.toByteArray());

            Message message = new Message();
            message.setRaw(encodedEmail);

            gmail.users()
                    .messages()
                    .send("me", message)
                    .execute();

       } catch (Exception e) {
    e.printStackTrace();
    throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
}
    }
}