package com.passwordvault.service;

import com.passwordvault.entity.AuditLog;
import com.passwordvault.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLog createLog(
            Long userId,
            String action,
            String description) {

        AuditLog log = new AuditLog();

        log.setUserId(userId);
        log.setAction(action);
        log.setDescription(description);
        log.setTimestamp(LocalDateTime.now());

        return auditLogRepository.save(log);
    }
}
