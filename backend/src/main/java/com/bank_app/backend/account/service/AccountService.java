package com.bank_app.backend.account.service;

import com.bank_app.backend.account.dto.AccountDTO;
import com.bank_app.backend.account.entity.Account;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.enums.AccountType;
import com.bank_app.backend.res.Response;

import java.util.List;

public interface AccountService {
    Account createAccount(AccountType accountType, User user);

    Response<List<AccountDTO>> getMyAccounts();

    Response<?> closeAccount(String accountNumber);

}
