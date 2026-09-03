package com.passwordvault.service;

import com.passwordvault.dto.LoginActivityReport;
import com.passwordvault.dto.PasswordHealthReport;
import com.passwordvault.entity.LoginActivity;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.LoginActivityRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final CredentialRepository credentialRepository;

    private final LoginActivityRepository loginActivityRepository;


    public PasswordHealthReport getPasswordHealthReport() {

        long total =
                credentialRepository.count();

        long strong =
                credentialRepository
                        .countByPasswordStrength("strong");

        long medium =
                credentialRepository
                        .countByPasswordStrength("medium");

        long weak =
                credentialRepository
                        .countByPasswordStrength("weak");


        int healthScore;

        if (total == 0) {

            healthScore = 100;

        } else {

            healthScore =
                    (int) (
                            ((strong * 100)
                            + (medium * 60)
                            + (weak * 20))
                            / total
                    );
        }


        return new PasswordHealthReport(
                total,
                strong,
                medium,
                weak,
                healthScore
        );
    }


    public LoginActivityReport getLoginActivityReport() {

        long total =
                loginActivityRepository.count();

        long successful =
                loginActivityRepository
                        .countByStatus("SUCCESS");

        long failed =
                loginActivityRepository
                        .countByStatus("FAILED");


        List<LoginActivity> recentActivities =
                loginActivityRepository
                        .findTop5ByOrderByLoginTimeDesc();


        return new LoginActivityReport(
                total,
                successful,
                failed,
                recentActivities
        );
    }
}