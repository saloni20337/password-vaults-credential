package com.passwordvault.dto;
import lombok.RequiredArgsConstructor;
import lombok.Data;

@Data
@RequiredArgsConstructor
public class ShareCredentialRequest {
    private Long credentialId;

    private String email;

    private String permission;
}
