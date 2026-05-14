package com.bank_app.backend.transactions.service;

import com.bank_app.backend.res.Response;
import com.bank_app.backend.transactions.dto.TransactionDTO;
import com.bank_app.backend.transactions.dto.TransactionRequest;

import java.util.List;

public interface TransactionService {
    Response<?> createTransaction(TransactionRequest transactionRequest);

    Response<List<TransactionDTO>> getTransactionForMyAccount(String accountNumber, int page, int size);

}
