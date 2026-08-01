package com.passwordvault.service;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepo userRepo;

    public CredentialService(
            CredentialRepository credentialRepository,
            UserRepo userRepo) {

        this.credentialRepository = credentialRepository;
        this.userRepo = userRepo;
    }

    public Credential addCredential(
            CredentialRequest request,
            String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));

        Credential credential = new Credential();

        credential.setWebsiteName(request.getWebsiteName());
        credential.setUsername(request.getUsername());
        credential.setPassword(request.getPassword());
        credential.setCategory(request.getCategory());
        credential.setFavourite(request.isFavourite());
        credential.setUser(user);

        return credentialRepository.save(credential);
    }
}

