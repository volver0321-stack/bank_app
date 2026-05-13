package com.bank_app.backend;

import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.enums.NotificationType;
import com.bank_app.backend.notification.dto.NotificationDTO;
import com.bank_app.backend.notification.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@RequiredArgsConstructor
public class BackendApplication {

	private final NotificationService notificationService;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(){
		return args -> {
			NotificationDTO notificationDTO = NotificationDTO.builder()
					.recipient("nakamura.12090503@gmail.com")
					.subject("hello")
					.body("hello body")
					.type(NotificationType.EMAIL)
					.build();

			notificationService.sendEmail(notificationDTO,new User());
		};
	}

}
