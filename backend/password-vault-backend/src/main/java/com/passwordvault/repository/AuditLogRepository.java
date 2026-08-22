package com.passwordvault.repository;

import com.passwordvault.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserIdOrderByTimestampDesc(Long userId);
}