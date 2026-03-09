package com.example.ExpenseTracker.service;

import com.example.ExpenseTracker.dto.ExpenseRequest;
import com.example.ExpenseTracker.entity.Expense;
import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.ExpenseRepository;
import com.example.ExpenseTracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private UserRepository userRepository ;

    public Expense addExpense(Long userId, ExpenseRequest request) {

        System.out.println("----------------In ExpenseService----------------------------");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = new Expense();
        expense.setDescription(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    public List<Expense> getUserExpenses(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return expenseRepository.findByUser(user);
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