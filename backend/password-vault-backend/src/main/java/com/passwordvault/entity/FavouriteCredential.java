package com.passwordvault.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(
    name = "favourite_credentials",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"credential_id", "user_id"}
        )
    }
)
public class FavouriteCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "credential_id", nullable = false)
    private Credential credential;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}