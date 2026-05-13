package com.bank_app.backend.notification.services;

import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.enums.NotificationType;
import com.bank_app.backend.notification.dto.NotificationDTO;
import com.bank_app.backend.notification.entity.Notification;
import com.bank_app.backend.notification.repo.NotificationRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {


    private final NotificationRepo notificationRepo;
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;


    @Override
    @Async
    public void sendEmail(NotificationDTO notificationDTO, User user) {
        try{
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setTo(notificationDTO.getRecipient());
            helper.setSubject(notificationDTO.getSubject());

            if (notificationDTO.getTemplateName() != null) {
                Context context = new Context();
                context.setVariables(notificationDTO.getTemplateVariables());
                String htmlContent = templateEngine.process(notificationDTO.getTemplateName(), context);
                helper.setText(htmlContent, true);
            }else{
                helper.setText(notificationDTO.getBody(), true);
            }

            javaMailSender.send(mimeMessage);

            //save
            Notification notification = Notification.builder()
                    .recipient(notificationDTO.getRecipient())
                    .subject(notificationDTO.getSubject())
                    .body(notificationDTO.getBody())
                    .type(NotificationType.EMAIL)
                    .user(user)
                    .build();

            notificationRepo.save(notification);

        } catch (MessagingException e) {
            log.error(e.getMessage());
        }
    }
}
