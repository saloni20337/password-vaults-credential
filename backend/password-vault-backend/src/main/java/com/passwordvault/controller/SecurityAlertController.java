package com.passwordvault.controller;

import com.passwordvault.entity.SecurityAlert;
import com.passwordvault.entity.User;
import com.passwordvault.repository.UserRepo;
import com.passwordvault.service.SecurityAlertService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-alerts")
@RequiredArgsConstructor
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    private final UserRepo userRepo;

    @GetMapping
    public List<SecurityAlert> getSecurityAlerts(
            Authentication authentication) {

        User user = userRepo.findByEmail(
                authentication.getName()
        ).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        return securityAlertService
                .getUserAlerts(user.getId());
    }
}