package com.passwordvault.controller;

import com.passwordvault.entity.Notification;
import com.passwordvault.entity.User;
import com.passwordvault.repository.UserRepo;
import com.passwordvault.service.NotificationService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepo userRepo;

    // Get logged-in user's notifications
    @GetMapping
    public List<Notification> getNotifications(
            Authentication authentication
    ) {

        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return notificationService.getUserNotifications(user.getId());
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public long getUnreadCount(
            Authentication authentication
    ) {

        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return notificationService.getUnreadCount(user.getId());
    }

    // Mark one notification as read
    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id
    ) {
        return notificationService.markAsRead(id);
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public void markAllAsRead(
            Authentication authentication
    ) {

        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        notificationService.markAllAsRead(user.getId());
    }
}