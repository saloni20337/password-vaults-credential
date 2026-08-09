package com.passwordvault.repository;

import com.passwordvault.entity.SharedCredential;
import com.passwordvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SharedCredentialRepository
        extends JpaRepository<SharedCredential, Long> {

    boolean existsByCredentialIdAndSharedWithUserId(
            Long credentialId,
            Long userId
    );

    Optional<SharedCredential> findByCredentialIdAndSharedWithUserId(
            Long credentialId,
            Long userId
    );

    List<SharedCredential> findBySharedWithUser(User user);
    List<SharedCredential> findBySharedByUser(User user);

    // NEW
    Optional<SharedCredential>
    findByIdAndSharedByUser(
            Long id,
            User user
    );
 
        }