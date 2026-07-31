package com.passwordvault.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Column;
import java.time.LocalDateTime;


@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String email;


    private String otp;


    private LocalDateTime expiryTime;


}