package com.example.ExpenseTracker.service;

import com.example.ExpenseTracker.dto.ExpenseRequest;
import com.example.ExpenseTracker.entity.Expense;
import com.example.ExpenseTracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(ExpenseRequest request) {

        Expense expense = new Expense();

        expense.setDescription(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());

        return expenseRepository.save(expense);
    }

    public List<Expense> getUserExpenses() {

        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Long id) {

        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public Expense updateExpense(Long id, ExpenseRequest request) {

        Expense expense = getExpenseById(id);

        expense.setDescription(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {

        expenseRepository.deleteById(id);
    }

    public List<Expense> getAllExpenses() {

        return expenseRepository.findAll();
    }
}