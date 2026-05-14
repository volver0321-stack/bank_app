package com.bank_app.backend.transactions.service.impl;

import com.bank_app.backend.account.entity.Account;
import com.bank_app.backend.account.repo.AccountRepo;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.auth_users.services.UserService;
import com.bank_app.backend.enums.TransactionStatus;
import com.bank_app.backend.enums.TransactionType;
import com.bank_app.backend.exceptions.InsufficientBalanceException;
import com.bank_app.backend.exceptions.InvalidTransactionException;
import com.bank_app.backend.exceptions.NotFoundException;
import com.bank_app.backend.notification.dto.NotificationDTO;
import com.bank_app.backend.notification.services.NotificationService;
import com.bank_app.backend.res.Response;
import com.bank_app.backend.transactions.dto.TransactionDTO;
import com.bank_app.backend.transactions.dto.TransactionRequest;
import com.bank_app.backend.transactions.entity.Transaction;
import com.bank_app.backend.transactions.repo.TransactionRepo;
import com.bank_app.backend.transactions.service.TransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepo transactionRepo;
    private final NotificationService notificationService;
    private final AccountRepo accountRepo;
    private final UserService userService;
    
    @Override
    @Transactional
    public Response<?> createTransaction(TransactionRequest transactionRequest) {
        
        
        Transaction transaction = new Transaction();
        transaction.setTransactionType(transactionRequest.getTransactionType());
        transaction.setAmount(transactionRequest.getAmount());
        transaction.setDescription(transactionRequest.getDescription());
        
        switch(transactionRequest.getTransactionType()) {
            case DEPOSIT -> handleDeposit(transactionRequest, transaction);
            case WITHDRAW -> handleWithdraw(transactionRequest, transaction);
            case TRANSFER -> handleTransfer(transactionRequest, transaction);
            default -> throw new InvalidTransactionException("Invalid transaction type");
        }
        
        transaction.setStatus(TransactionStatus.SUCCESS);
        Transaction saveTxn = transactionRepo.save(transaction);
        
        //send Transaction notification

        sendTransactionNotification(saveTxn);
        
        return Response.builder()
                .statusCode(200)
                .message("Transaction created successfully")
                .build();
        
        
    }

    private void handleTransfer(TransactionRequest transactionRequest, Transaction transaction) {
        Account sourceAccount = accountRepo.findByAccountNumber(transactionRequest.getAccountNumber()).orElseThrow(()->new NotFoundException("Account not found"));
        Account destination = accountRepo.findByAccountNumber(transactionRequest.getDestinationAccountNumber()).orElseThrow(()->new NotFoundException("Destination Account not found"));

        if(sourceAccount.getBalance().compareTo(destination.getBalance()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        //deduct from source
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(transactionRequest.getAmount()));
        accountRepo.save(sourceAccount);

        //add to destination
        destination.setBalance(destination.getBalance().add(transactionRequest.getAmount()));
        accountRepo.save(destination);

        transaction.setId(sourceAccount.getId());
        transaction.setSourceAccount(sourceAccount.getAccountNumber());
        transaction.setDestinationAccount(destination.getAccountNumber());
    }

    private void handleWithdraw(TransactionRequest transactionRequest, Transaction transaction) {
        Account account = accountRepo.findByAccountNumber(transactionRequest.getAccountNumber()).orElseThrow(()->new NotFoundException("Account not found"));

        account.setBalance(account.getBalance().add(transactionRequest.getAmount()));
        transaction.setAccount(account);
        accountRepo.save(account);
    }

    private void handleDeposit(TransactionRequest transactionRequest, Transaction transaction) {
        Account account = accountRepo.findByAccountNumber(transactionRequest.getAccountNumber()).orElseThrow(()->new NotFoundException("Account not found"));

        if ((account.getBalance().compareTo(transactionRequest.getAmount()) < 0)) {
            throw new InsufficientBalanceException("Insufficient balance");
        }
        account.setBalance(account.getBalance().subtract(transactionRequest.getAmount()));
        transaction.setAccount(account);
        accountRepo.save(account);
    }
    private void sendTransactionNotification(Transaction saveTxn) {
        User user = saveTxn.getAccount().getUser();
        String subject;
        String template;

        Map<String,Object> templateVariables = new HashMap<>();
        templateVariables.put("name", user.getFirstName());
        templateVariables.put("amount", saveTxn.getAmount());
        templateVariables.put("accountNumber", saveTxn.getAccount().getAccountNumber());
        templateVariables.put("balance", saveTxn.getAccount().getBalance());
        templateVariables.put("sourceAccount", saveTxn.getSourceAccount());
        templateVariables.put("destinationAccount", saveTxn.getDestinationAccount());

        if(saveTxn.getTransactionType() == TransactionType.DEPOSIT) {
            subject = "Credit Alert";
            template = "credit-alert";

            NotificationDTO notificationEmailTosend = NotificationDTO.builder()
                    .subject(subject)
                    .recipient(user.getEmail())
                    .templateName(template)
                    .templateVariables(templateVariables)
                    .build();

            notificationService.sendEmail(notificationEmailTosend ,user);
        }else if(saveTxn.getTransactionType() == TransactionType.WITHDRAW) {
            subject = "Debit Alert";
            template = "debit-alert";

            NotificationDTO notificationEmailTosend = NotificationDTO.builder()
                    .subject(subject)
                    .recipient(user.getEmail())
                    .templateName(template)
                    .templateVariables(templateVariables)
                    .build();

            notificationService.sendEmail(notificationEmailTosend ,user);
        }else if(saveTxn.getTransactionType() == TransactionType.TRANSFER) {
            subject = "Transfer Alert";
            template = "transfer-alert";

            NotificationDTO notificationEmailTosend = NotificationDTO.builder()
                    .subject(subject)
                    .recipient(user.getEmail())
                    .templateName(template)
                    .templateVariables(templateVariables)
                    .build();

            notificationService.sendEmail(notificationEmailTosend ,user);

            Account destination = accountRepo.findByAccountNumber(saveTxn.getDestinationAccount())
                    .orElseThrow(()->new NotFoundException("Destination Account not found"));

            User receiver = destination.getUser();

            Map<String,Object> receiverVariables = new HashMap<>();
            templateVariables.put("name", receiver.getFirstName());
            templateVariables.put("amount", saveTxn.getAmount());
            templateVariables.put("accountNumber", destination.getAccountNumber());
            templateVariables.put("balance", destination.getBalance());

            NotificationDTO notificationEmailTosendToReceiver = NotificationDTO.builder()
                    .subject("Credit Alert")
                    .recipient(receiver.getEmail())
                    .templateName("credit-alert")
                    .templateVariables(templateVariables)
                    .build();
            notificationService.sendEmail(notificationEmailTosend ,user);
        }
    }

    @Override
    @Transactional
    public Response<List<TransactionDTO>> getTransactionForMyAccount(String accountNumber, int page, int size) {
        return null;
    }
}
