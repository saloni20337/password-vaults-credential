package com.passwordvault.service;

import com.passwordvault.entity.SecurityAlert;
import com.passwordvault.repository.SecurityAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SecurityAlertService {

    private final SecurityAlertRepository securityAlertRepository;

    public SecurityAlert createAlert(
            Long userId,
            int failedAttempts) {

        SecurityAlert alert = new SecurityAlert();

        alert.setUserId(userId);
        alert.setAlertType("MULTIPLE_FAILED_LOGINS");
        alert.setMessage(
                failedAttempts +
                " failed login attempts detected"
        );
        alert.setSeverity("HIGH");
        alert.setCreatedAt(LocalDateTime.now());
        alert.setStatus("UNREAD");

        return securityAlertRepository.save(alert);
    }
}