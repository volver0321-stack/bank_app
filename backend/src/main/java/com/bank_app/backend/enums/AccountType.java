package com.bank_app.backend.enums;

import lombok.Getter;

@Getter
public enum AccountType {
    SAVINGS("普通預金"),
    CURRENT("当座預金");

    private final String label;
    AccountType(String label) {
        this.label = label;
    }
}
