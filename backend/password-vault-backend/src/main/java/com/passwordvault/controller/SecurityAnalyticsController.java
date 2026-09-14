package com.passwordvault.controller;

import com.passwordvault.dto.SecurityAnalyticsResponse;
import com.passwordvault.service.SecurityAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class SecurityAnalyticsController {

    private final SecurityAnalyticsService securityAnalyticsService;

    @GetMapping("/analytics")
    public SecurityAnalyticsResponse getAnalytics(
            Authentication authentication
    ) {
        return securityAnalyticsService.getAnalytics(authentication.getName());
    }
}