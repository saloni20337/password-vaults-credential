package com.passwordvault.service;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.dto.CredentialResponse;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.SharedCredential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.SharedCredentialRepository;
import com.passwordvault.repository.UserRepo;
import com.passwordvault.entity.FavouriteCredential;
import com.passwordvault.repository.FavouriteCredRepo;
import com.passwordvault.security.EncryptionUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CredentialService {

    private final CredentialRepository credentialRepository;

    private final UserRepo userRepo;

    private final EncryptionUtil encryptionUtil;

    private final SharedCredentialRepository sharedCredentialRepository;

     private final FavouriteCredRepo favouriteCredentialRepository;

    public Credential addCredential(
            CredentialRequest request,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        Credential credential =
                new Credential();


        credential.setWebsiteName(
                request.getWebsiteName()
        );


        credential.setUsername(
                request.getUsername()
        );


        credential.setPassword(
                encryptionUtil.encrypt(
                        request.getPassword()
                )
        );

        credential.setCategory(
                request.getCategory()
        );

        credential.setDeleted(false);


       credential.setUser(user);

Credential savedCredential =
        credentialRepository.save(credential);

if (Boolean.TRUE.equals(request.getFavourite())) {

    FavouriteCredential favourite =
            new FavouriteCredential();

    favourite.setCredential(savedCredential);
    favourite.setUser(user);

    favouriteCredentialRepository.save(favourite);
}

return savedCredential;
    }

    public List<CredentialResponse> getMyCredentials(
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        List<CredentialResponse> result =
                new ArrayList<>();


        List<Credential> ownCredentials =
                credentialRepository.findByUser(user);


        for (Credential credential : ownCredentials) {

            if (!credential.isDeleted()) {

                CredentialResponse response = convertToResponse(credential,user);

                response.setShared(false);

                response.setCanView(true);
                response.setCanEdit(true);
                response.setCanDelete(true);

                result.add(response);
            }
        }
        // SHARED CREDENTIALS
        List<SharedCredential> sharedCredentials =
                sharedCredentialRepository.findBySharedWithUser(user);


        for (SharedCredential shared :
                sharedCredentials) {

            Credential credential =
                    shared.getCredential();


            if (!credential.isDeleted()
                    && shared.isCanView()) {

                CredentialResponse response = convertToResponse(credential,user);


                response.setShared(true);


                response.setCanView(
                        shared.isCanView()
                );


                response.setCanEdit(
                        shared.isCanEdit()
                );


                response.setCanDelete(
                        shared.isCanDelete()
                );


                result.add(response);
            }
        }


        return result;
    }
    // GET SINGLE CREDENTIAL
    public Credential getCredentialById(
            Long id,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        // Owner
        var ownCredential =
                credentialRepository
                        .findByIdAndUser(id, user);


        if (ownCredential.isPresent()) {

            return ownCredential.get();
        }


        // Shared credential
        SharedCredential shared =
                sharedCredentialRepository
                        .findByCredentialIdAndSharedWithUserId(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential Not Found"
                                )
                        );


        if (!shared.isCanView()) {

            throw new RuntimeException(
                    "You do not have view permission"
            );
        }


        return shared.getCredential();
    }
    // VIEW PASSWORD
    public String getDecryptedPassword(
            Long id,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        // Owner
        var ownCredential =
                credentialRepository
                        .findByIdAndUser(id, user);


        if (ownCredential.isPresent()) {

            return encryptionUtil.decrypt(
                    ownCredential
                            .get()
                            .getPassword()
            );
        }


        // Shared credential
        SharedCredential shared =
                sharedCredentialRepository
                        .findByCredentialIdAndSharedWithUserId(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential Not Found"
                                )
                        );


        if (!shared.isCanView()) {

            throw new RuntimeException(
                    "You do not have view permission"
            );
        }


        return encryptionUtil.decrypt(
                shared.getCredential()
                        .getPassword()
        );
    }
    // UPDATE CREDENTIAL
    public Credential updateCredential(
            Long id,
            CredentialRequest request,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        Credential credential;


        // Owner
        var ownCredential =
                credentialRepository
                        .findByIdAndUser(id, user);


        if (ownCredential.isPresent()) {

            credential = ownCredential.get();

        } else {

            // Shared
            SharedCredential shared =
                    sharedCredentialRepository
                            .findByCredentialIdAndSharedWithUserId(
                                    id,
                                    user.getId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Credential Not Found"
                                    )
                            );


            if (!shared.isCanEdit()) {

                throw new RuntimeException(
                        "You do not have edit permission"
                );
            }


            credential =
                    shared.getCredential();
        }


        credential.setWebsiteName(
                request.getWebsiteName()
        );


        credential.setUsername(
                request.getUsername()
        );


        credential.setPassword(
                encryptionUtil.encrypt(
                        request.getPassword()
                )
        );


        credential.setCategory(
                request.getCategory()
        );


        if (request.getFavourite() != null) {

    boolean alreadyFavourite =
            favouriteCredentialRepository
                    .existsByCredentialIdAndUserId(
                            credential.getId(),
                            user.getId()
                    );

    if (request.getFavourite() && !alreadyFavourite) {

        FavouriteCredential favourite =
                new FavouriteCredential();

        favourite.setCredential(credential);
        favourite.setUser(user);

        favouriteCredentialRepository.save(favourite);

    } else if (!request.getFavourite() && alreadyFavourite) {

        favouriteCredentialRepository
                .deleteByCredentialIdAndUserId(
                        credential.getId(),
                        user.getId()
                );
    }
}


        return credentialRepository.save(
                credential
        );
    }
    // DELETE CREDENTIAL
    public String deleteCredential(
            Long id,
            String email
    ) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        // Owner
        var ownCredential =
                credentialRepository
                        .findByIdAndUser(id, user);


        if (ownCredential.isPresent()) {

            credentialRepository.delete(
                    ownCredential.get()
            );

            return "Credential Deleted Successfully";
        }


        // Shared
        SharedCredential shared =
                sharedCredentialRepository
                        .findByCredentialIdAndSharedWithUserId(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential Not Found"
                                )
                        );


        if (!shared.isCanDelete()) {

            throw new RuntimeException(
                    "You do not have delete permission"
            );
        }


        credentialRepository.delete(
                shared.getCredential()
        );


        return "Credential Deleted Successfully";
    }
    // CONVERT ENTITY TO RESPONSE
    private CredentialResponse convertToResponse(
        Credential credential,
        User currentUser
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

    // Check favourite for CURRENT USER only
    boolean isFavourite =
            favouriteCredentialRepository
                    .existsByCredentialIdAndUserId(
                            credential.getId(),
                            currentUser.getId()
                    );

    response.setFavourite(isFavourite);

    return response;
}
}