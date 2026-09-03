package com.passwordvault.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordHealthReport {

    private long totalCredentials;

    private long strongPasswords;

    private long mediumPasswords;

    private long weakPasswords;

    private int healthScore;
}
