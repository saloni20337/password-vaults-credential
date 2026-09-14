package com.passwordvault.controller;

import com.passwordvault.dto.LoginActivityReport;
import com.passwordvault.dto.PasswordHealthReport;
import com.passwordvault.service.ReportService;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;


    @GetMapping("/password-health")
    public PasswordHealthReport getPasswordHealthReport() {

        return reportService
                .getPasswordHealthReport();
    }

@GetMapping("/login-activity")
public LoginActivityReport getLoginActivityReport(
        Authentication authentication) {

    return reportService
            .getLoginActivityReport(authentication.getName());
}
}