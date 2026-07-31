package com.passwordvault.repository;

import com.passwordvault.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;


public interface PasswordResetTokenRepo 
        extends JpaRepository<PasswordResetToken, Long> {


    Optional<PasswordResetToken> findByEmail(String email);

    @Modifying
    @Transactional
    void deleteByEmail(String email);
}
