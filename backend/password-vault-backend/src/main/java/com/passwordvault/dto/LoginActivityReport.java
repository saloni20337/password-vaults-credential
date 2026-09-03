package com.passwordvault.dto;

import com.passwordvault.entity.LoginActivity;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LoginActivityReport {

    private long totalAttempts;

    private long successfulLogins;

    private long failedLogins;

    private List<LoginActivity> recentActivities;
}
