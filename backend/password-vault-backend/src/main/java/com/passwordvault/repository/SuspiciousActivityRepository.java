package com.example.passwordvault.repository;

import com.example.passwordvault.entity.SuspiciousActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity> findByUserIdOrderByDetectedAtDesc(Long userId)
        }