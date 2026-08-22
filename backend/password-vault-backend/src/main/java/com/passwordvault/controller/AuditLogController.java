package com.passwordvault.controller;

import com.passwordvault.entity.AuditLog;
import com.passwordvault.entity.User;
import com.passwordvault.repository.UserRepo;
import com.passwordvault.service.AuditLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final UserRepo userRepo;

    @GetMapping
    public List<AuditLog> getAuditLogs(
            Authentication authentication) {

        User user = userRepo.findByEmail(
                authentication.getName()
        ).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        return auditLogService
                .getUserLogs(user.getId());
    }
}