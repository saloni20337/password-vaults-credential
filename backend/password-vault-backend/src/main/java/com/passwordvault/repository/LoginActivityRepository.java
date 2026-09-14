package com.passwordvault.repository;

import com.passwordvault.entity.LoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

  List<LoginActivity> findTop20ByUsernameOrderByLoginTimeDesc(String username);
    long countByUsernameAndStatus(String username, String status);

    long countByUsernameAndStatusAndLoginTimeAfter(
            String username,
            String status,
            LocalDateTime after
    );
   long countByUserIdAndStatus(Long userId, String status);

List<LoginActivity> findTop20ByUserIdOrderByLoginTimeDesc(Long userId);

long countByUserId(Long userId);
    long countByStatus(String status);

    List<LoginActivity> findTop5ByOrderByLoginTimeDesc();
}