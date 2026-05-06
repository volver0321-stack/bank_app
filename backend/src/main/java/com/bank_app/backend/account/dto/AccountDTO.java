package com.bank_app.backend.account.dto;

import com.bank_app.backend.auth_users.dto.UserDTO;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.enums.AccountStatus;
import com.bank_app.backend.enums.AccountType;
import com.bank_app.backend.enums.Currency;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountDTO {
    private Long id;

    private String accountNumber;

    private BigDecimal balance;

    private AccountType accountType;

    @JsonBackReference
    private UserDTO user;

    private Currency currency;

    private AccountStatus status;

    @JsonManagedReference
    private List<TransactionDTO> transactions;

    private  LocalDateTime closedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
