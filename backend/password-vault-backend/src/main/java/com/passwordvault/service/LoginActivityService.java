package com.passwordvault.service;

import com.passwordvault.entity.LoginActivity;
import com.passwordvault.repository.LoginActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginActivityService {

    private final LoginActivityRepository loginActivityRepository;

    public void recordActivity(String username, String status) {

        LoginActivity activity = new LoginActivity();

        activity.setUsername(username);
        activity.setLoginTime(LocalDateTime.now());
        activity.setStatus(status);

        loginActivityRepository.save(activity);
    }

    public List<LoginActivity> getUserActivities(String username) {

        return loginActivityRepository
                .findByUsernameOrderByLoginTimeDesc(username);
    }
    public long getFailedAttempts(String username) {

    return loginActivityRepository
            .countByUsernameAndStatus(username, "FAILED");
}
}