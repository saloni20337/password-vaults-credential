package com.passwordvault.controller;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.dto.CredentialResponse;
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



    // ADD CREDENTIAL

    @PostMapping("/add")
    public Credential addCredential(@RequestBody CredentialRequest request,Authentication authentication) {


        String email = authentication.getName();


        return credentialService.addCredential(
                request,
                email
        );
    }




    // GET ALL CREDENTIALS
    // Password yaha nahi jayega

    @GetMapping
    public List<CredentialResponse> getCredentials(Authentication authentication) {


        String email = authentication.getName();


        return credentialService.getMyCredentials(email);
    }





    // GET SINGLE CREDENTIAL

    @GetMapping("/{id}")
    public Credential getCredentialById(@PathVariable Long id,Authentication authentication) {


        String email = authentication.getName();


        return credentialService.getCredentialById(
                id,
                email
        );
    }





    // VIEW PASSWORD (DECRYPT)

    @GetMapping("/{id}/password")
    public String viewPassword(@PathVariable Long id,Authentication authentication) {


        return credentialService.getDecryptedPassword(
                id,
                authentication.getName()
        );
    }





    // UPDATE CREDENTIAL

    @PutMapping("/{id}")
    public Credential updateCredential(@PathVariable Long id,@RequestBody CredentialRequest request,Authentication authentication
    ) {


        String email = authentication.getName();


        return credentialService.updateCredential(
                id,
                request,
                email
        );
    }





    // DELETE CREDENTIAL

    @DeleteMapping("/{id}")
    public String deleteCredential(@PathVariable Long id,Authentication authentication) {


        String email = authentication.getName();


        return credentialService.deleteCredential(
                id,
                email
        );
    }

}