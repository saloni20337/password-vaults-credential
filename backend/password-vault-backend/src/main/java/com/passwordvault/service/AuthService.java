package com.passwordvault.service;

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
import com.passwordvault.service.NotificationService;
import com.passwordvault.entity.PasswordResetToken;
import com.passwordvault.entity.User;

import com.passwordvault.repository.PasswordResetTokenRepo;
import com.passwordvault.repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordResetTokenRepo tokenRepo;
    private final GmailService gmailService;
    private final UserRepo userRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final LoginActivityService loginActivityService;
    private final SuspiciousActivityService suspiciousActivityService;
    private final SecurityAlertService securityAlertService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
  


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

    User user = userRepo.findByEmail(request.getEmail())
            .orElse(null);

    // USER NOT FOUND
    if (user == null) {

        loginActivityService.recordActivity(
                request.getEmail(),
                "FAILED"
        );

        throw new RuntimeException("Invalid Credentials");
    }


    // WRONG PASSWORD
    if (!encoder.matches(
            request.getPassword(),
            user.getPassword()
    )) {

       loginActivityService.recordActivity(
        user.getId(),
        user.getEmail(),
        "FAILED"
);
         long failedAttempts =
            loginActivityService.getRecentFailedAttempts(
                    user.getEmail()
            );

    if (failedAttempts >= 5) {

        suspiciousActivityService.createSuspiciousActivity(
                user.getId(),
                (int) failedAttempts
        );
         securityAlertService.createAlert(
            user.getId(),
            (int) failedAttempts
    );
     auditLogService.createLog(
            user.getId(),
            "SECURITY_ALERT_CREATED",
            "Security alert created for multiple failed login attempts"
    );
    notificationService.createNotification(
    user.getId(),
    "FAILED_LOGIN",
    "Security Alert",
    "Multiple failed login attempts were detected on your SecureVault account."
);
    }

        throw new RuntimeException("Invalid Credentials");
    }


    // SUCCESSFUL LOGIN
   loginActivityService.recordActivity(
        user.getId(),
        user.getEmail(),
        "SUCCESS"
);
   auditLogService.createLog(
        user.getId(),
        "LOGIN",
        "User logged in successfully"
);
notificationService.createNotification(
    user.getId(),
    "LOGIN",
    "New Login Detected",
    "New login detected on your SecureVault account."
);
    String token = jwtUtil.generateToken(
            user.getEmail()
    );

    return new LoginResponse(
            token,
            "Login Successful"
    );
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

System.out.println("OTP SAVED SUCCESSFULLY");
System.out.println("ABOUT TO SEND EMAIL");

gmailService.sendOtpEmail(
        request.getEmail(),
        otp
);

System.out.println("EMAIL SENT SUCCESSFULLY");

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