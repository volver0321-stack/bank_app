package com.bank_app.backend.notification.services;

import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.notification.dto.NotificationDTO;


public interface NotificationService {
    void sendEmail(NotificationDTO notificationDTO, User user);
}
