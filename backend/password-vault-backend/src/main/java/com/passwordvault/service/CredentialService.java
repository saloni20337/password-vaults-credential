package com.passwordvault.service;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.dto.CredentialResponse;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.UserRepo;
import com.passwordvault.security.EncryptionUtil;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class CredentialService {


    private final CredentialRepository credentialRepository;
    private final UserRepo userRepo;
    private final EncryptionUtil encryptionUtil;


    public CredentialService(
            CredentialRepository credentialRepository,
            UserRepo userRepo,
            EncryptionUtil encryptionUtil
    ) {

        this.credentialRepository = credentialRepository;
        this.userRepo = userRepo;
        this.encryptionUtil = encryptionUtil;
    }



    // ADD CREDENTIAL

    public Credential addCredential(
            CredentialRequest request,
            String email
    ) {


        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found")
                );


        Credential credential = new Credential();


        credential.setWebsiteName(
                request.getWebsiteName()
        );


        credential.setUsername(
                request.getUsername()
        );


        // Encrypt password before saving

        credential.setPassword(
                encryptionUtil.encrypt(
                        request.getPassword()
                )
        );


        credential.setCategory(
                request.getCategory()
        );


        credential.setFavourite(
                request.getFavourite() != null
                        ? request.getFavourite()
                        : false
        );


        credential.setUser(user);


        return credentialRepository.save(credential);
    }




    // GET ALL USER CREDENTIALS

    public List<CredentialResponse> getMyCredentials(
            String email
    ) {


        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found")
                );


        return credentialRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }




    // GET SINGLE CREDENTIAL

    public Credential getCredentialById(
            Long id,
            String email
    ) {


        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found")
                );


        return credentialRepository
                .findByIdAndUser(id,user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Credential Not Found"
                        )
                );
    }




    // UPDATE CREDENTIAL

    public Credential updateCredential(
            Long id,
            CredentialRequest request,
            String email
    ) {


        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found")
                );


        Credential credential =
                credentialRepository
                        .findByIdAndUser(id,user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                "Credential Not Found"
                                )
                        );


        credential.setWebsiteName(
                request.getWebsiteName()
        );


        credential.setUsername(
                request.getUsername()
        );


        // Encrypt updated password also

        credential.setPassword(
                encryptionUtil.encrypt(
                        request.getPassword()
                )
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





    // VIEW PASSWORD (DECRYPT)

    public String getDecryptedPassword(
            Long id,
            String email
    ) {


        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found")
                );


        Credential credential =
                credentialRepository
                        .findByIdAndUser(id,user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                "Credential Not Found"
                                )
                        );



        return encryptionUtil.decrypt(
                credential.getPassword()
        );
    }





    // DELETE CREDENTIAL

    public String deleteCredential(
            Long id,
            String email
    ) {


        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found")
                );


        Credential credential =
                credentialRepository
                        .findByIdAndUser(id,user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                "Credential Not Found"
                                )
                        );


        credentialRepository.delete(credential);


        return "Credential Deleted Successfully";
    }





    // CONVERT ENTITY TO RESPONSE DTO

    private CredentialResponse convertToResponse(
            Credential credential
    ) {


        CredentialResponse response =
                new CredentialResponse();


        response.setId(
                credential.getId()
        );


        response.setWebsiteName(
                credential.getWebsiteName()
        );


        response.setUsername(
                credential.getUsername()
        );


        response.setCategory(
                credential.getCategory()
        );


        response.setFavourite(
                credential.isFavourite()
        );


        return response;
    }

}