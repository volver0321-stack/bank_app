package com.bank_app.backend.transactions.controller;

import com.bank_app.backend.res.Response;
import com.bank_app.backend.transactions.dto.TransactionRequest;
import com.bank_app.backend.transactions.entity.Transaction;
import com.bank_app.backend.transactions.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Response<?>> createTransaction(@RequestBody @Valid TransactionRequest transactionRequest) {
        return ResponseEntity.ok(transactionService.createTransaction(transactionRequest));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Response<?>> getTransactionForMyAccount(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(transactionService.getTransactionForMyAccount(accountNumber, page, size));
    }

}
