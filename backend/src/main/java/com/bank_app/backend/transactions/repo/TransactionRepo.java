package com.bank_app.backend.transactions.repo;

import com.bank_app.backend.account.entity.Account;
import com.bank_app.backend.transactions.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount_AccountNumber(String accountNumber);

    Page<Transaction> findByAccount_AccountNumber(String accountNumber, Pageable pageable);

}
