//package com.example.ExpenseTracker.controller;
//
//import com.example.ExpenseTracker.dto.AuthResponse;
//import com.example.ExpenseTracker.dto.LoginRequest;
//import com.example.ExpenseTracker.dto.RegisterRequest;
//import com.example.ExpenseTracker.service.AuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/auth")
//public class AuthController {
//
//    @Autowired
//    private AuthService authService;
//
//    @PostMapping("/register")
//    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
//
//        AuthResponse response = authService.register(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
//
//        AuthResponse response = authService.login(request);
//        return ResponseEntity.ok(response);
//    }
//}
