package com.passwordvault.dto;

import lombok.Data;

@Data
public class SharedCredRes {
     private Long shareId;

    private Long credentialId;

    private String websiteName;

    private String sharedWithEmail;

    private boolean canView;

    private boolean canEdit;

    private boolean canDelete;
}