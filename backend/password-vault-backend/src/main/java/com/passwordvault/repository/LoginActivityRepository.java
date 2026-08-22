package com.passwordvault.repository;

import com.passwordvault.entity.LoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

    List<LoginActivity> findByUsernameOrderByLoginTimeDesc(String username);
    long countByUsernameAndStatus(String username, String status);
}