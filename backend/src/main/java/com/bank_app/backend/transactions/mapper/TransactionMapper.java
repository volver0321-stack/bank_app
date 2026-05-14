package com.bank_app.backend.transactions.mapper;

import com.bank_app.backend.transactions.dto.TransactionDTO;
import com.bank_app.backend.transactions.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(target = "account", ignore = true)
    TransactionDTO toTransactionDTO(Transaction transaction);

    @Mapping(target = "account", ignore = true)
    Transaction toTransaction(TransactionDTO transactionDTO);
}
