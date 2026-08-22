package com.passwordvault.repository;

import com.passwordvault.entity.LoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

import java.util.List;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

    List<LoginActivity> findByUsernameOrderByLoginTimeDesc(String username);
    long countByUsernameAndStatus(String username, String status);
    long countByUsernameAndStatusAndLoginTimeAfter(
        String username,
        String status,
        LocalDateTime after
);
}