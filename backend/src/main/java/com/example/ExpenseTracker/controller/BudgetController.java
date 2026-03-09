package com.example.ExpenseTracker.controller;

import com.example.ExpenseTracker.dto.BudgetRequest;
import com.example.ExpenseTracker.entity.Budget;
import com.example.ExpenseTracker.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> setBudget(@RequestBody BudgetRequest request) {

        return ResponseEntity.ok(budgetService.setBudget(request));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getBudget() {

        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    // Get budget by userId .
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Budget>> getBudgetByUserId(@PathVariable Long userId) {

        return ResponseEntity.ok(budgetService.getBudgetByUserId(userId));
    }

}
