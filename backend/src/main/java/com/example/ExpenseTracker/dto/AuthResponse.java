package com.example.ExpenseTracker.dto;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;

    private String message;

    public AuthResponse(String message) {
        this.message = message ;
    }

}