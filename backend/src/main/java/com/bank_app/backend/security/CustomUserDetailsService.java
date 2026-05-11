package com.bank_app.backend.security;

import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.auth_users.repo.UserRepo;
import com.bank_app.backend.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new NotFoundException("Email Not Fount"));

        return AuthUser.builder()
                .user(user)
                .build();
    }
}
