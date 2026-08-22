package com.passwordvault.controller;

import com.passwordvault.entity.LoginActivity;
import com.passwordvault.service.LoginActivityService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login-activity")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LoginActivityController {

    private final LoginActivityService loginActivityService;

    @GetMapping
    public List<LoginActivity> getLoginActivities(
            Authentication authentication
    ) {

        String username = authentication.getName();

        return loginActivityService
                .getUserActivities(username);
    }
}