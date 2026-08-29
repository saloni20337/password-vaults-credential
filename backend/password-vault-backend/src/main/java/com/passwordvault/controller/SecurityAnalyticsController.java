package com.passwordvault.controller;

import com.passwordvault.dto.SecurityAnalyticsResponse;
import com.passwordvault.service.SecurityAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class SecurityAnalyticsController {

    private final SecurityAnalyticsService securityAnalyticsService;

    @GetMapping("/analytics")
    public SecurityAnalyticsResponse getAnalytics() {

        return securityAnalyticsService.getAnalytics();
    }
}
