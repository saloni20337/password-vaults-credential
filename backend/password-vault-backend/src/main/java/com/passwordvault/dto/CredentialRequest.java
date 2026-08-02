package com.passwordvault.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CredentialRequest {

    private String websiteName;
    private String username;
    private String password;
    private String category;
    private Boolean favourite;

    // Getters and Setters
}
