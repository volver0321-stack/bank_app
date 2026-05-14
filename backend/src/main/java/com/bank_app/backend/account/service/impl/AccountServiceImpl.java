package com.bank_app.backend.account.service.impl;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.account.entity.Account;
import com.bank_app.backend.account.mapper.AccountMapper;
import com.bank_app.backend.account.repo.AccountRepo;
import com.bank_app.backend.account.service.AccountService;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.auth_users.services.UserService;
import com.bank_app.backend.enums.AccountStatus;
import com.bank_app.backend.enums.AccountType;
import com.bank_app.backend.enums.Currency;
import com.bank_app.backend.exceptions.BadRequestException;
import com.bank_app.backend.exceptions.NotFoundException;
import com.bank_app.backend.res.Response;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepo accountRepo;
    private final UserService userService;
    private final AccountMapper accountMapper;

    private final Random random = new Random();

    @Override
    public Account createAccount(AccountType accountType, User user) {
        log.info("inside create account");

        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(accountType)
                .currency(Currency.JPY)
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        return accountRepo.save(account);
    }

    private String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = "66" + (random.nextInt(9000000) + 10000000);

        } while (accountRepo.findByAccountNumber(accountNumber).isPresent());

        log.info("account number generated {}", accountNumber);
        return accountNumber;
    }

    @Override
    public Response<List<AccountDTO>> getMyAccounts() {
        User user = userService.getCurrentloggingUser();

        List<AccountDTO> accounts = accountRepo.findByUserId(user.getId()).stream().map(accountMapper::toDTO).toList();

        return Response.<List<AccountDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User accounts fetched successfully")
                .data(accounts)
                .build();
    }

    @Override
    public Response<?> closeAccount(String accountNumber) {
        User user = userService.getCurrentloggingUser();
        Account account = accountRepo.findByAccountNumber(accountNumber).orElseThrow(() -> new NotFoundException("Account Not found"));
        if (!user.getAccounts().contains(account)) {
            throw new NotFoundException("Account doesn't belong to you ");
        }
        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new BadRequestException("Account balance must be zero before closing");
        }

        account.setStatus(AccountStatus.CLOSED);
        account.setClosedAt(LocalDateTime.now());
        accountRepo.save(account);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Account closed successfully")
                .build();
    }
}
