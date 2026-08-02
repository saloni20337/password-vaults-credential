package com.passwordvault.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.User;
import java.util.List;
import java.util.Optional;

public interface CredentialRepository
       extends JpaRepository<Credential, Long> {
               List<Credential> findByUser(User user);
                Optional<Credential> findByIdAndUser(
                  Long id,
                  User user
                );
               
}
