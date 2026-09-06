package com.passwordvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CredentialRequest {

    @NotBlank(message = "Website name is required")
    private String websiteName;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Password strength is required")
    private String passwordStrength;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Favourite status is required")
    private Boolean favourite;
}
