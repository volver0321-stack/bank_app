package com.bank_app.backend.account.service.impl;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.account.entity.Account;
import com.bank_app.backend.account.repo.AccountRepo;
import com.bank_app.backend.account.service.AccountService;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.auth_users.services.UserService;
import com.bank_app.backend.enums.AccountType;
import com.bank_app.backend.res.Response;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepo accountRepo;
    private final UserService userService;

    private final Random random = new Random();

    @Override
    public Account createAccount(AccountType accountType, User user) {
        return null;
    }

    @Override
    public Response<List<AccountDTO>> getMyAccounts() {
        return null;
    }

    @Override
    public Response<?> closeAccount(String accountNumber) {
        return null;
    }
}
