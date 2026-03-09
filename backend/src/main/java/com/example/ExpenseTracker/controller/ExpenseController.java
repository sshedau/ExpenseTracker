package com.example.ExpenseTracker.controller;

import com.example.ExpenseTracker.dto.ExpenseRequest;
import com.example.ExpenseTracker.entity.Expense;
import com.example.ExpenseTracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/users/{userId}")
    public Expense addExpense(@PathVariable Long userId,
                              @RequestBody ExpenseRequest request) {
        System.out.println("----------------In ExpenseController----------------------------");
        return expenseService.addExpense(userId, request);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Expense>> getUserExpenses() {

        return ResponseEntity.ok(expenseService.getUserExpenses());
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long expenseId) {
        return ResponseEntity.ok(expenseService.getExpenseById(expenseId));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Expense>> getUserExpenses(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.getUserExpenses(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseRequest request) {

        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {

        expenseService.deleteExpense(id);
        return ResponseEntity.ok("Expense deleted successfully");
    }
}
