package com.bank_app.backend.account.mapper;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.account.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toEntity(AccountDTO accountDTO);

    AccountDTO toDTO(Account account);
}
