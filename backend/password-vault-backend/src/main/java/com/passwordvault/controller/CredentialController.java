package com.passwordvault.controller;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.dto.CredentialResponse;
import com.passwordvault.dto.ShareCredentialRequest;
import com.passwordvault.dto.SharedCredRes;
import com.passwordvault.entity.Credential;
import com.passwordvault.service.CredentialService;
import com.passwordvault.service.CredentialShareService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    private final CredentialService credentialService;

    private final CredentialShareService credentialShareService;


    public CredentialController(
            CredentialService credentialService,
            CredentialShareService credentialShareService
    ) {

        this.credentialService =
                credentialService;

        this.credentialShareService =
                credentialShareService;
    }


    // =========================================================
    // ADD
    // =========================================================

    @PostMapping("/add")
    public Credential addCredential(
            @RequestBody CredentialRequest request,
            Authentication authentication
    ) {

        return credentialService.addCredential(
                request,
                authentication.getName()
        );
    }
    // GET ALL
    @GetMapping
    public List<CredentialResponse> getCredentials(
            Authentication authentication
    ) {

        return credentialService.getMyCredentials(
                authentication.getName()
        );
}
    // GET SINGLE
    @GetMapping("/{id}")
    public Credential getCredentialById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return credentialService.getCredentialById(
                id,
                authentication.getName()
        );
    }
    // VIEW PASSWORD
   @GetMapping("/{id}/password")
    public String viewPassword(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return credentialService.getDecryptedPassword(
                id,
                authentication.getName()
        );
    }
    // UPDATE
    @PutMapping("/{id}")
    public Credential updateCredential(
            @PathVariable Long id,
            @RequestBody CredentialRequest request,
            Authentication authentication
    ) {

        return credentialService.updateCredential(
                id,
                request,
                authentication.getName()
        );
    }
    // SHARE
     @PostMapping("/{id}/share")
    public ResponseEntity<?> shareCredential(
            @PathVariable Long id,
            @RequestBody ShareCredentialRequest request,
            Authentication authentication
    ) {

        try {

            request.setCredentialId(id);


            String result =
                    credentialShareService.shareCredential(
                            request,
                            authentication.getName()
                    );


            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    //get shared credential
@GetMapping("/shared")
public List<SharedCredRes>
getSharedCredentials(
        Authentication authentication
) {

    return credentialShareService
            .getMySharedCredentials(
                    authentication.getName()            );
}
//revoke by owner
@DeleteMapping("/shared/{shareId}")
public ResponseEntity<?> revokeAccess(
        @PathVariable Long shareId,
        Authentication authentication
) {

    try {

        String result =
                credentialShareService.revokeAccess(
                        shareId,
                        authentication.getName()
                );

        return ResponseEntity.ok(result);

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}
    // DELETE
    @DeleteMapping("/{id}")
    public String deleteCredential(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return credentialService.deleteCredential(
                id,
                authentication.getName()
        );
    }
}