package com.passwordvault.controller;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.service.CredentialService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(
            CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @PostMapping("/add")
    public Credential addCredential(
            @RequestBody CredentialRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return credentialService.addCredential(
                request,
                email
        );
    }
}