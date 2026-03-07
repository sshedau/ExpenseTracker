package com.example.ExpenseTracker.service;

import com.example.ExpenseTracker.dto.BudgetRequest;
import com.example.ExpenseTracker.entity.Budget;
import com.example.ExpenseTracker.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public Budget setBudget(BudgetRequest request) {

        Budget budget = new Budget();

        budget.setMonth(request.getMonth());
        budget.setLimitAmount(request.getLimitAmount());

        return budgetRepository.save(budget);
    }

    public Budget getBudget() {

        return budgetRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }
}