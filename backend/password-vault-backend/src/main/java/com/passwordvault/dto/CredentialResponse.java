package com.passwordvault.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CredentialResponse {

    private Long id;
    private String websiteName;
    private String username;
    private String category;
    private Boolean favourite;
    private boolean shared;
    private boolean canView;
    private boolean canEdit;
    private boolean canDelete;
}
