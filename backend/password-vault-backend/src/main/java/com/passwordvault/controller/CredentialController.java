package com.passwordvault.controller;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.service.CredentialService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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


    System.out.println("AUTH USER = " + authentication.getName());


    String email = authentication.getName();

    return credentialService.addCredential(
            request,
            email
    );
}
    @GetMapping
public List<Credential> getCredentials(
        Authentication authentication
){

    String email = authentication.getName();

    return credentialService.getMyCredentials(email);
}
@GetMapping("/{id}")
public Credential getCredentialById(
        @PathVariable Long id,
    
        Authentication authentication
){

    String email = authentication.getName();

    return credentialService.getCredentialById(
        id,
        email);
}
@PutMapping("/{id}")
public Credential updateCredential(
        @PathVariable Long id,
        @RequestBody CredentialRequest request,
        Authentication authentication
){

    String email = authentication.getName();

    return credentialService.updateCredential(
            id,
            request,
            email
    );
}
@DeleteMapping("/{id}")
public String deleteCredential(
        @PathVariable Long id,
        Authentication authentication
){

    String email = authentication.getName();

    return credentialService.deleteCredential(
            id,
            email
    );
}
}