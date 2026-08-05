package com.passwordvault.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.passwordvault.dto.LoginResponse;
import com.passwordvault.security.JwtUtil;
import com.passwordvault.dto.ForgotPasswordRequest;
import com.passwordvault.dto.LoginRequest;
import com.passwordvault.dto.RegisterRequest;
import com.passwordvault.dto.ResetPasswordRequest;
import com.passwordvault.dto.VerifyOtpRequest;
import com.passwordvault.entity.PasswordResetToken;
import com.passwordvault.entity.User;
import com.passwordvault.repository.PasswordResetTokenRepo;
import com.passwordvault.repository.UserRepo;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordResetTokenRepo tokenRepo;
    private final JavaMailSender mailSender;
    private final UserRepo userRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;
  


    // Register User
    public String register(RegisterRequest request) {

        if(userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }


        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt Password
        user.setPassword(
                encoder.encode(request.getPassword())
        );


        userRepo.save(user);


        return "User Registered Successfully";
    }



    // Login User
    public LoginResponse login(LoginRequest request) {

    User user = userRepo.findByEmail(
            request.getEmail()
    ).orElse(null);

    if(user == null) {
        throw new RuntimeException("User Not Found");
    }

    if(!encoder.matches(
            request.getPassword(),
            user.getPassword()
    )) {
        throw new RuntimeException("Invalid Credentials");
    }

    String token =
            jwtUtil.generateToken(user.getEmail());

    return new LoginResponse(token, "Login Successful");
}


// Forgot Password - Generate OTP and Send Mail
public String forgotPassword(ForgotPasswordRequest request){

    User user = userRepo.findByEmail(request.getEmail())
            .orElse(null);


    if(user == null){

        throw new RuntimeException("User not found");

    }



    // Delete previous OTP if exists
    tokenRepo.deleteByEmail(request.getEmail());



    String otp = String.valueOf(
            new Random().nextInt(900000) + 100000
    );



    PasswordResetToken token = new PasswordResetToken();


    token.setEmail(request.getEmail());

    token.setOtp(otp);

    token.setExpiryTime(
            LocalDateTime.now().plusMinutes(5)
    );



    tokenRepo.save(token);





    SimpleMailMessage message = new SimpleMailMessage();


    message.setTo(request.getEmail());

    message.setSubject("Password Reset OTP");

    message.setText(
            "Your OTP for password reset is: " + otp +
            "\n\nThis OTP is valid for 5 minutes."
    );



    mailSender.send(message);



    return "OTP sent successfully";

}


public String verifyOtp(VerifyOtpRequest request){


    PasswordResetToken token =
            tokenRepo.findByEmail(request.getEmail())
            .orElse(null);



    if(token == null){

        throw new RuntimeException("OTP not found");

    }



    if(token.getExpiryTime()
            .isBefore(LocalDateTime.now())){


        throw new RuntimeException("OTP expired");

    }



    if(!token.getOtp()
            .equals(request.getOtp())){


        throw new RuntimeException("Invalid OTP");

    }



    return "OTP Verified";

}

public String resetPassword(ResetPasswordRequest request) {

    User user =
            userRepo.findByEmail(request.getEmail())
            .orElse(null);



    if(user == null){

        throw new RuntimeException("User not found");

    }



    user.setPassword(
            encoder.encode(
                    request.getNewPassword()
            )
    );



    userRepo.save(user);



    tokenRepo.deleteByEmail(
            request.getEmail()
    );



    return "Password Reset Successful";

}

}