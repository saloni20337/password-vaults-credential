package com.passwordvault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SecurityAnalyticsResponse {

    // Security Statistics
    private long totalLogins;
    private long failedLogins;
    private long successfulLogins;
    private long suspiciousActivities;
    private long securityAlerts;

    // Recent Activity Data
    private List<?> recentLoginActivities;
    private List<?> recentSuspiciousActivities;
    private List<?> recentSecurityAlerts;
    private List<?> recentAuditActivities;
}