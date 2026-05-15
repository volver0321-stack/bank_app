package com.bank_app.backend.audit_dashboard.service;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.auth_users.dto.UserDTO;
import com.bank_app.backend.transactions.dto.TransactionDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AuditService {

    Map<String, Long> getSystemTotals();

    Optional<UserDTO> findUserByEmail(String email);

    Optional<AccountDTO> findAccountDetailsByAccountNumber(String accountNumber);

    List<TransactionDTO> findTransactionsByAccountNumber(String accountNumber);

    Optional<TransactionDTO> findTransactionById(Long transactionId);
}
