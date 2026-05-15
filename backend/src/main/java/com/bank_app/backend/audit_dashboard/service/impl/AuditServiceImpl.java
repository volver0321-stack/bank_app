package com.bank_app.backend.audit_dashboard.service.impl;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.account.mapper.AccountMapper;
import com.bank_app.backend.account.repo.AccountRepo;
import com.bank_app.backend.audit_dashboard.service.AuditService;
import com.bank_app.backend.auth_users.dto.UserDTO;
import com.bank_app.backend.auth_users.mapper.UserMapper;
import com.bank_app.backend.auth_users.repo.UserRepo;
import com.bank_app.backend.transactions.dto.TransactionDTO;
import com.bank_app.backend.transactions.mapper.TransactionMapper;
import com.bank_app.backend.transactions.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final UserRepo userRepo;
    private final AccountRepo accountRepo;
    private final TransactionRepo transactionRepo;
    private final TransactionMapper transactionMapper;
    private final UserMapper userMapper;
    private final AccountMapper accountMapper;


    @Override
    public Map<String, Long> getSystemTotals() {
        long totalUsers = userRepo.count();
        long totalAccounts = accountRepo.count();
        long totalTransactions = transactionRepo.count();

        return Map.of(
                "totalUsers", totalUsers,
                "totalAccounts", totalAccounts,
                "totalTransaction", totalTransactions
        );
    }

    @Override
    public Optional<UserDTO> findUserByEmail(String email) {
        return userRepo.findByEmail(email).map(userMapper::toDto);
    }

    @Override
    public Optional<AccountDTO> findAccountDetailsByAccountNumber(String accountNumber) {
        return accountRepo.findByAccountNumber(accountNumber).map(accountMapper::toDTO);
    }

    @Override
    public List<TransactionDTO> findTransactionsByAccountNumber(String accountNumber) {
        return transactionRepo.findByAccount_AccountNumber(accountNumber).stream().map(transactionMapper::toTransactionDTO).toList();
    }

    @Override
    public Optional<TransactionDTO> findTransactionById(Long transactionId) {
        return transactionRepo.findById(transactionId).map(transactionMapper::toTransactionDTO);
    }
}
