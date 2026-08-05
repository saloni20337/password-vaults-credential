package com.passwordvault.dto;


import lombok.Data;


@Data
public class UpdateProfileRequest {


    private String oldEmail;

    private String name;

    private String email;

}
