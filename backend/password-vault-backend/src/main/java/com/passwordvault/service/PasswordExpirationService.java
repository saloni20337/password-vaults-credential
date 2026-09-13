package com.passwordvault.service;

import com.passwordvault.entity.Credential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PasswordExpirationService {

    private final CredentialRepository credentialRepository;
    private final NotificationService notificationService;
    private final GmailService gmailService;

    private static final long EXPIRATION_DAYS = 90;

    public void checkExpiredPasswords() {

        LocalDateTime expiryDate =
                LocalDateTime.now().minusDays(EXPIRATION_DAYS);

        List<Credential> credentials =
                credentialRepository.findByPasswordChangedAtBefore(
                        expiryDate
                );

        for (Credential credential : credentials) {

            User user = credential.getUser();

            if (user == null) {
                continue;
            }

            notificationService.createNotification(
                    user.getId(),
                    "PASSWORD_EXPIRATION",
                    "Password Expiration",
                    "Your password for "
                            + credential.getWebsiteName()
                            + " has expired. Please update it."
            );

            gmailService.sendNotificationEmail(
                    user.getEmail(),
                    "Password Vault - Password Expiration",
                    "Password Expiration\n\n"
                            + "Your password for "
                            + credential.getWebsiteName()
                            + " has expired.\n\n"
                            + "Please log in to SecureVault and update "
                            + "your password.\n\n"
                            + "For security reasons, the actual password "
                            + "is not included in this email."
            );
        }
    }
}