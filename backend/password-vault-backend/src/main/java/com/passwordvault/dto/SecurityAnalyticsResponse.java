package com.passwordvault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SecurityAnalyticsResponse {

    private long totalLogins;
    private long failedLogins;
    private long successfulLogins;
    private long suspiciousActivities;
    private long securityAlerts;
}