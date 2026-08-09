package com.passwordvault.repository;

import com.passwordvault.entity.FavouriteCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FavouriteCredRepo
        extends JpaRepository<FavouriteCredential, Long> {

    Optional<FavouriteCredential> findByCredentialIdAndUserId(
            Long credentialId,
            Long userId
    );

    boolean existsByCredentialIdAndUserId(
            Long credentialId,
            Long userId
    );

    void deleteByCredentialIdAndUserId(
            Long credentialId,
            Long userId
    );
}
