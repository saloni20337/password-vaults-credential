package com.passwordvault.service;

import com.passwordvault.dto.SecurityAnalyticsResponse;
import com.passwordvault.repository.LoginActivityRepository;
import com.passwordvault.repository.SecurityAlertRepository;
import com.passwordvault.repository.SuspiciousActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityAnalyticsService {

    private final LoginActivityRepository loginActivityRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final SecurityAlertRepository securityAlertRepository;

    public SecurityAnalyticsResponse getAnalytics() {

        long successfulLogins =
                loginActivityRepository.countByStatus("SUCCESS");

        long failedLogins =
                loginActivityRepository.countByStatus("FAILED");

        long totalLogins =
                successfulLogins + failedLogins;

        long suspiciousActivities =
                suspiciousActivityRepository.count();

        long securityAlerts =
                securityAlertRepository.count();

        return new SecurityAnalyticsResponse(
                totalLogins,
                failedLogins,
                successfulLogins,
                suspiciousActivities,
                securityAlerts
        );
    }
}