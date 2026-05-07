package com.bank_app.backend.transactions.dto;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.enums.TransactionStatus;
import com.bank_app.backend.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {
    private Long id;

    private BigDecimal amount;


    private TransactionType transactionType;

    private LocalDateTime transactionDate;


    private TransactionStatus status;

    @JsonBackReference
    private AccountDTO account;

    private String sourceAccount;
    private String destinationAccount;

}
