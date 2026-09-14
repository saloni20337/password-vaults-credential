
package com.passwordvault.service;

import com.passwordvault.dto.SecurityAnalyticsResponse;
import com.passwordvault.repository.LoginActivityRepository;
import com.passwordvault.repository.SecurityAlertRepository;
import com.passwordvault.repository.SuspiciousActivityRepository;
import com.passwordvault.repository.AuditLogRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityAnalyticsService {

    private final LoginActivityRepository loginActivityRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final AuditLogRepository auditLogRepository;

    public SecurityAnalyticsResponse getAnalytics(String username) {

        // Login Statistics - only for current user
        long successfulLogins =
                loginActivityRepository
                        .countByUsernameAndStatus(username, "SUCCESS");

        long failedLogins =
                loginActivityRepository
                        .countByUsernameAndStatus(username, "FAILED");

        long totalLogins =
                successfulLogins + failedLogins;

        // Security Statistics
        long suspiciousActivities =
                suspiciousActivityRepository.count();

        long securityAlerts =
                securityAlertRepository.count();

        // Recent Security Data
        var recentLoginActivities =
                loginActivityRepository
                        .findTop5ByOrderByLoginTimeDesc();

        var recentSuspiciousActivities =
                suspiciousActivityRepository
                        .findTop5ByOrderByDetectedAtDesc();

        var recentSecurityAlerts =
                securityAlertRepository
                        .findTop5ByOrderByCreatedAtDesc();

        var recentAuditActivities =
                auditLogRepository
                        .findTop5ByOrderByTimestampDesc();

        return new SecurityAnalyticsResponse(
                totalLogins,
                failedLogins,
                successfulLogins,
                suspiciousActivities,
                securityAlerts,
                recentLoginActivities,
                recentSuspiciousActivities,
                recentSecurityAlerts,
                recentAuditActivities
        );
    }
}
