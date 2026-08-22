package com.passwordvault.controller;

import com.passwordvault.entity.SuspiciousActivity;
import com.passwordvault.entity.User;
import com.passwordvault.repository.SuspiciousActivityRepository;
import com.passwordvault.repository.UserRepo;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security/suspicious-activities")
@RequiredArgsConstructor
public class SuspiciousActivityController {

    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final UserRepo userRepo;

    @GetMapping
    public List<SuspiciousActivity> getSuspiciousActivities(
            Authentication authentication) {

        User user = userRepo.findByEmail(
                authentication.getName()
        ).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        return suspiciousActivityRepository
                .findByUserIdOrderByDetectedAtDesc(user.getId());
    }
}