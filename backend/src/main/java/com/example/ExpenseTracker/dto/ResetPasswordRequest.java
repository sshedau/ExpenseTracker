package com.example.ExpenseTracker.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String token;

    private String newPassword;
}