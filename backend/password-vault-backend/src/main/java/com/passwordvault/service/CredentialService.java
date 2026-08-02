package com.passwordvault.service;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import java.util.List;

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
        credential.setFavourite(
        request.getFavourite() != null
        ? request.getFavourite()
        : false
);
        credential.setUser(user);

        return credentialRepository.save(credential);
    }
    public List<Credential> getMyCredentials(
        String email
){

    User user = userRepo.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User Not Found")
            );


    return credentialRepository.findByUser(user);
}
public Credential getCredentialById(
        Long id,
        String email
){

    User user = userRepo.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User Not Found")
            );

    return credentialRepository
            .findByIdAndUser(id, user)
            .orElseThrow(() ->
                    new RuntimeException("Credential Not Found")
            );
}
public Credential updateCredential(
        Long id,
        CredentialRequest request,
        String email
){

    User user = userRepo.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User Not Found")
            );

    Credential credential =
            credentialRepository.findByIdAndUser(id, user)
            .orElseThrow(() ->
                    new RuntimeException("Credential Not Found")
            );

    credential.setWebsiteName(
            request.getWebsiteName()
    );

    credential.setUsername(
            request.getUsername()
    );

    credential.setPassword(
            request.getPassword()
    );

    credential.setCategory(
            request.getCategory()
    );

   credential.setFavourite(
        request.getFavourite() != null 
        ? request.getFavourite() 
        : false
);

    return credentialRepository.save(credential);
}
public String deleteCredential(
        Long id,
        String email
){

    User user = userRepo.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User Not Found")
            );

    Credential credential =
            credentialRepository.findByIdAndUser(id, user)
            .orElseThrow(() ->
                    new RuntimeException("Credential Not Found")
            );

    credentialRepository.delete(credential);

    return "Credential Deleted Successfully";
}

public List<Credential> getAllCredentials(
        String email
){

    User user = userRepo.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User Not Found")
            );

    return credentialRepository.findByUser(user);
}
}