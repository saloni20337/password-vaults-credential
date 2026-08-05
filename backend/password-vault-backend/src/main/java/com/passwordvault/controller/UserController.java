package com.passwordvault.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import com.passwordvault.dto.UpdateProfileRequest;
import com.passwordvault.repository.UserRepo;
import com.passwordvault.service.UserService;
import com.passwordvault.entity.User;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
   private final UserRepo userRepo;
   private final UserService userService;
    

@GetMapping("/profile")
public ResponseEntity<?> getProfile(Authentication authentication){

    User user = userRepo.findByEmail(
            authentication.getName()
    ).orElseThrow(
            () -> new RuntimeException("User not found")
    );

    return ResponseEntity.ok(user);
}


    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request
    ){

        return ResponseEntity.ok(
                userService.updateProfile(request)
        );

    }

}
    

