package com.bank_app.backend.account.mapper;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.account.entity.Account;
import com.bank_app.backend.transactions.dto.TransactionDTO;
import com.bank_app.backend.transactions.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "user", ignore = true)
    Account toEntity(AccountDTO accountDTO);

    @Mapping(target = "user", ignore = true)
    AccountDTO toDTO(Account account);

}
