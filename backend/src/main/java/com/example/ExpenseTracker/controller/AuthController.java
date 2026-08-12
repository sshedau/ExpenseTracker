package com.example.ExpenseTracker.controller;

import com.example.ExpenseTracker.dto.AuthResponse;
import com.example.ExpenseTracker.dto.LoginRequest;
import com.example.ExpenseTracker.dto.RegisterRequest;
import com.example.ExpenseTracker.repository.UserRepository;
import com.example.ExpenseTracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.ExpenseTracker.dto.ResetPasswordRequest;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/check-user")
    public ResponseEntity<?> checkUser(@RequestBody Map<String, String> req) {
        String email = req.get("email");

        if (!userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "User does not exist"));
        }

        return ResponseEntity.ok(Map.of("message", "User exists"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> req) {

        String email = req.get("email");

        return authService.forgotPassword(email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        return authService.resetPassword(request);
    }
}
