package com.passwordvault.service;

import com.passwordvault.dto.LoginRequest;
import com.passwordvault.dto.RegisterRequest;
import com.passwordvault.entity.User;
import com.passwordvault.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder encoder;

    public String register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                encoder.encode(request.getPassword())
        );

        userRepo.save(user);

        return "User Registered Successfully";
    }

    public String login(LoginRequest request) {

        User user = userRepo.findByEmail(
                request.getEmail()
        ).orElse(null);

        if(user == null) {
            return "User Not Found";
        }

        if(encoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            return "Login Successful";
        }

        return "Invalid Credentials";
    }
}