package com.passwordvault.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class SecurityAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String alertType;

    private String message;

    private String severity;

    private LocalDateTime createdAt;

    private String status;
}