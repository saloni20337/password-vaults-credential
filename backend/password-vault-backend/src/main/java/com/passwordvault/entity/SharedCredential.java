package com.passwordvault.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "shared_credentials")
public class SharedCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "credential_id")
    private Credential credential;

    @ManyToOne
    @JoinColumn(name = "shared_with_user_id")
    private User sharedWithUser;

    @ManyToOne
    @JoinColumn(name = "shared_by_user_id")
    private User sharedByUser;

    private boolean canView;
    private boolean canEdit;
    private boolean canDelete;
    private boolean canManageSharing;
}