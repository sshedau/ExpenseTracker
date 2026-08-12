package com.example.ExpenseTracker.service;

import com.example.ExpenseTracker.dto.ExpenseRequest;
import com.example.ExpenseTracker.entity.*;
import com.example.ExpenseTracker.repository.ExpenseRepository;
import com.example.ExpenseTracker.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;


    // ================= GET ALL =================

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }


    // ================= ADD EXPENSE =================

    public Expense addExpense(ExpenseRequest request) {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = (User) auth.getPrincipal();

        Expense expense = new Expense();

        expense.setDescription(request.getDescription());

        expense.setAmount(request.getAmount());

        expense.setCategory(request.getCategory());

        // Use date from request if provided,
        // otherwise use today's date
        expense.setDate(
                request.getDate() != null
                        ? request.getDate()
                        : LocalDate.now()
        );

        // Set transaction type
        if (request.getAmount() < 0) {
            expense.setType(TransactionType.EXPENSE);
        } else {
            expense.setType(TransactionType.INCOME);
        }

        expense.setUser(user);

        return expenseRepository.save(expense);
    }


    // ================= GET USER EXPENSES =================

    public List<Expense> getUserExpenses() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = (User) auth.getPrincipal();

        return expenseRepository.findByUser(user);
    }


    // ================= DELETE =================

    public void deleteExpense(Long id) {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = (User) auth.getPrincipal();

        Expense expense =
                expenseRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Expense not found"
                                )
                        );

        if (!expense.getUser()
                .getUserId()
                .equals(user.getUserId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        expenseRepository.delete(expense);
    }


    // ================= BUDGET CHECK =================

    public void checkBudgetAndNotify(User user) {

        String currentMonth =
                LocalDate.now()
                        .getMonth()
                        .name();

        Budget budget =
                budgetService
                        .getBudgetByUserId(
                                user.getUserId()
                        )
                        .stream()
                        .filter(
                                b -> b.getMonth()
                                        .equalsIgnoreCase(
                                                currentMonth
                                        )
                        )
                        .findFirst()
                        .orElse(null);

        if (budget != null) {

            double totalSpent =
                    getUserExpenses()
                            .stream()
                            .filter(
                                    e -> e.getType()
                                            == TransactionType.EXPENSE
                            )
                            .mapToDouble(
                                    Expense::getAmount
                            )
                            .map(Math::abs)
                            .sum();

            if (totalSpent >
                    budget.getLimitAmount()) {

                String msg =
                        "You've exceeded your "
                                + currentMonth
                                + " budget! Spent: "
                                + totalSpent;

                Notification notification =
                        new Notification();

                notification.setUser(user);
                notification.setMessage(msg);
                notification.setTitle(
                        "Budget Alert"
                );

                notificationRepository.save(
                        notification
                );

                emailService.sendSimpleMessage(
                        user.getEmail(),
                        "Budget Exceeded!",
                        msg
                );
            }
        }
    }
}