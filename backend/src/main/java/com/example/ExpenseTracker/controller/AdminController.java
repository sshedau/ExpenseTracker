//package com.example.ExpenseTracker.controller;
//
//import com.example.ExpenseTracker.entity.Expense;
//import com.example.ExpenseTracker.entity.User;
//import com.example.ExpenseTracker.service.ExpenseService;
//import com.example.ExpenseTracker.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/admin")
//public class AdminController {
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private ExpenseService expenseService;
//
//    @GetMapping("/users")
//    public ResponseEntity<List<User>> getAllUsers() {
//
//        return ResponseEntity.ok(userService.getAllUsers());
//    }
//
//    @GetMapping("/expenses")
//    public ResponseEntity<List<Expense>> getAllExpenses() {
//
//        return ResponseEntity.ok(expenseService.getAllExpenses());
//    }
//
//    @DeleteMapping("/users/{id}")
//    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
//
//        userService.deleteUser(id);
//        return ResponseEntity.ok("User deleted");
//    }
//}
