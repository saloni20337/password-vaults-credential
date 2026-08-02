package com.passwordvault.controller;
import com.passwordvault.dto.ForgotPasswordRequest;
import com.passwordvault.dto.LoginRequest;
import com.passwordvault.dto.LoginResponse;
import com.passwordvault.dto.RegisterRequest;
import com.passwordvault.dto.ResetPasswordRequest;
import com.passwordvault.dto.VerifyOtpRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("all")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
   public LoginResponse login(
        @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
    
    // Forgot Password - Send OTP
    @PostMapping("/forgot-password")
    public String forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ){
        return authService.forgotPassword(request);
    }



    // Verify OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(
            @RequestBody VerifyOtpRequest request
    ){
        return authService.verifyOtp(request);
    }



    // Reset Password
    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestBody ResetPasswordRequest request
    ){
        return authService.resetPassword(request);
    
    }

    @GetMapping("/me")
    public String currentUser(Authentication authentication){

        return authentication.getName();
}


    @PostMapping("/logout")
    public String logout(){

        return "Logged Out Successfully";
}
}