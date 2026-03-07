package com.example.ExpenseTracker.repository;

import com.example.ExpenseTracker.entity.Expense;
import com.example.ExpenseTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);

}