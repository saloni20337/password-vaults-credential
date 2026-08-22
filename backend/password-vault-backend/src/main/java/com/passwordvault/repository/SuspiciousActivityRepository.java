package com.passwordvault.repository;

import com.passwordvault.entity.SuspiciousActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity> findByUserIdOrderByDetectedAtDesc(
            Long userId
    );

    boolean existsByUserIdAndActivityTypeAndStatus(
            Long userId,
            String activityType,
            String status
    );
}