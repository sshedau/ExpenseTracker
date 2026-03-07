package com.example.ExpenseTracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "budgets")
@Data
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String month;

    private double limitAmount;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
