package com.example.ExpenseTracker.dto;

import lombok.Data;

@Data
public class BudgetRequest {

    private String month;
    private double limitAmount;
    private Long userId;

}