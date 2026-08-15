package com.passwordvault.service;

import com.passwordvault.dto.ShareCredentialRequest;
import com.passwordvault.dto.SharedCredRes;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.SharedCredential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.SharedCredentialRepository;
import com.passwordvault.repository.UserRepo;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CredentialShareService {

    private final CredentialRepository credentialRepository;

    private final SharedCredentialRepository sharedCredentialRepository;

    private final UserRepo userRepo;

    // GET MY SHARED CREDENTIALS
    public List<SharedCredRes>
    getMySharedCredentials(String email) {

        User user =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        List<SharedCredential> shares =
                sharedCredentialRepository
                        .findBySharedByUser(user);


        List<SharedCredRes> result =
                new ArrayList<>();


        for (SharedCredential share : shares) {

            SharedCredRes response =
                    new SharedCredRes();


            response.setShareId(
                    share.getId()
            );


            response.setCredentialId(
                    share.getCredential().getId()
            );


            response.setWebsiteName(
                    share.getCredential().getWebsiteName()
            );


            response.setSharedWithEmail(
                    share.getSharedWithUser().getEmail()
            );


            response.setCanView(
                    share.isCanView()
            );


            response.setCanEdit(
                    share.isCanEdit()
            );


            response.setCanDelete(
                    share.isCanDelete()
            );


            result.add(response);
        }


        return result;
    }
    // REVOKE ACCESS
    public String revokeAccess(
            Long shareId,
            String email
    ) {

        User owner =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                )
                        );


        SharedCredential share =
                sharedCredentialRepository
                        .findByIdAndSharedByUser(
                                shareId,
                                owner
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Shared credential not found"
                                )
                        );


        sharedCredentialRepository.delete(share);


        return "Access revoked successfully";
    }

    public String shareCredential(
            ShareCredentialRequest request,
            String ownerEmail
    ) {

        // Owner
        User owner = userRepo.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Owner Not Found")
                );


        // Credential
        Credential credential =
                credentialRepository
                        .findByIdAndUser(
                                request.getCredentialId(),
                                owner
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential Not Found"
                                )
                        );


        // Employee who will receive credential
        User receiver =
                userRepo.findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee is not registered"
                                )
                        );


        // Cannot share with yourself
        if (owner.getId().equals(receiver.getId())) {

            throw new RuntimeException(
                    "You cannot share credential with yourself"
            );
        }


        // Already shared check
        boolean alreadyShared =
                sharedCredentialRepository
                        .existsByCredentialIdAndSharedWithUserId(
                                credential.getId(),
                                receiver.getId()
                        );

        if (alreadyShared) {

            throw new RuntimeException(
                    "Credential already shared with this employee"
            );
        }


        // At least one permission required
       
       if (request.getPermission() == null
        || request.getPermission().isBlank()) {

    throw new RuntimeException(
            "Permission is required"
    );
}
        SharedCredential sharedCredential = new SharedCredential();
         sharedCredential.setCredential(credential);
sharedCredential.setSharedByUser(owner);
sharedCredential.setSharedWithUser(receiver);

switch (request.getPermission()) {
    case "VIEW_ONLY":
        sharedCredential.setCanView(true);
        sharedCredential.setCanEdit(false);
        sharedCredential.setCanDelete(false);
        sharedCredential.setCanManageSharing(false);
        break;

    case "EDIT_ACCESS":
        sharedCredential.setCanView(true);
        sharedCredential.setCanEdit(true);
        sharedCredential.setCanDelete(false);
        sharedCredential.setCanManageSharing(false);
        break;

    case "FULL_MANAGEMENT":
        sharedCredential.setCanView(true);
        sharedCredential.setCanEdit(true);
        sharedCredential.setCanDelete(true);
        sharedCredential.setCanManageSharing(true);
        break;

    default:
        throw new RuntimeException("Invalid Permission");
}

sharedCredentialRepository.save(sharedCredential);



        return "Credential shared successfully";
    }
}