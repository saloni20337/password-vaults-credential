
package com.passwordvault.controller;

import com.passwordvault.dto.LoginActivityReport;
import com.passwordvault.dto.PasswordHealthReport;
import com.passwordvault.entity.User;
import com.passwordvault.repository.UserRepo;
import com.passwordvault.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final UserRepo userRepo;

    @GetMapping("/password-health")
    public PasswordHealthReport getPasswordHealthReport() {
        return reportService.getPasswordHealthReport();
    }

    @GetMapping("/login-activity")
    public LoginActivityReport getLoginActivityReport(
            Authentication authentication) {

        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return reportService.getLoginActivityReport(user.getId());
    }
}