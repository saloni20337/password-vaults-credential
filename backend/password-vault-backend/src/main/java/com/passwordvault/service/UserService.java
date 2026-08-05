package com.passwordvault.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.passwordvault.dto.UpdateProfileRequest;
import com.passwordvault.entity.User;
import com.passwordvault.repository.UserRepo;


@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepo userRepo;



    public String updateProfile(UpdateProfileRequest request){


        User user = userRepo.findByEmail(request.getOldEmail())
                .orElseThrow(
                    () -> new RuntimeException("User not found")
                );



        user.setName(request.getName());

        user.setEmail(request.getEmail());



        userRepo.save(user);



        return "Profile Updated Successfully";

    }

}