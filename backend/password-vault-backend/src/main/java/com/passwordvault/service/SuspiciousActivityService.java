package com.passwordvault.service;

import com.passwordvault.entity.SuspiciousActivity;
import com.passwordvault.repository.SuspiciousActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SuspiciousActivityService {

    private final SuspiciousActivityRepository suspiciousActivityRepository;

    public SuspiciousActivityService(
            SuspiciousActivityRepository suspiciousActivityRepository) {

        this.suspiciousActivityRepository =
                suspiciousActivityRepository;
    }

    public SuspiciousActivity createSuspiciousActivity(
            Long userId,
            int failedAttempts) {

        boolean alreadyFlagged =
                suspiciousActivityRepository
                        .existsByUserIdAndActivityTypeAndStatus(
                                userId,
                                "MULTIPLE_FAILED_LOGINS",
                                "FLAGGED"
                        );

        if (alreadyFlagged) {
            return null;
        }

        SuspiciousActivity activity =
                new SuspiciousActivity();

        activity.setUserId(userId);

        activity.setActivityType(
                "MULTIPLE_FAILED_LOGINS"
        );

        activity.setDescription(
                failedAttempts
                        + " failed login attempts detected within 10 minutes"
        );

        activity.setDetectedAt(
                LocalDateTime.now()
        );

        activity.setStatus("FLAGGED");

        return suspiciousActivityRepository.save(activity);
    }
}