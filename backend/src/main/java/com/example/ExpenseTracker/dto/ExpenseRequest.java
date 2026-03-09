package com.example.ExpenseTracker.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpenseRequest {

    private String title;
    private double amount;
    private String category;
    private LocalDate date;

}