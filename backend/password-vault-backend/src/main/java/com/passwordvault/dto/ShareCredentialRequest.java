package com.passwordvault.dto;
import lombok.RequiredArgsConstructor;
import lombok.Data;

@Data
@RequiredArgsConstructor
public class ShareCredentialRequest {
    private Long credentialId;

    private String email;

    private boolean canView;

    private boolean canEdit;

    private boolean canDelete;
}
