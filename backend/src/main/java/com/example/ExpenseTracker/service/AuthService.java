package com.example.ExpenseTracker.service;

import com.example.ExpenseTracker.dto.AuthResponse;
import com.example.ExpenseTracker.dto.LoginRequest;
import com.example.ExpenseTracker.dto.RegisterRequest;
import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.UserRepository;
import com.example.ExpenseTracker.security.JwtService;
import com.example.ExpenseTracker.dto.ResetPasswordRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTER
    public ResponseEntity<?> register(RegisterRequest request) {

        //  CHECK IF USER ALREADY EXISTS
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new AuthResponse(null, "User already exists"));
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(token, "User registered successfully"));
    }

    //  LOGIN
    public ResponseEntity<?> login(LoginRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        // USER NOT FOUND
        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new AuthResponse(null, "User does not exist"));
        }

        User user = userOptional.get();

        //  WRONG PASSWORD
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(new AuthResponse(null, "Invalid credentials"));
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
    }

    public ResponseEntity<?> forgotPassword(String email) {

        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "User does not exist"
                    ));
        }

        User user = userOptional.get();

        // Generate secure random token
        String resetToken = UUID.randomUUID().toString();

        user.setResetToken(resetToken);

        // Token valid for 1 hour
        user.setResetTokenExpiry(
                LocalDateTime.now().plusHours(1)
        );

        userRepository.save(user);

        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + resetToken;

        return ResponseEntity.ok(
                Map.of(
                        "message", "Reset link generated",
                        "resetLink", resetLink
                )
        );
    }

    public ResponseEntity<?> resetPassword(
            ResetPasswordRequest request) {

        Optional<User> userOptional =
                userRepository.findByResetToken(request.getToken());

        if (userOptional.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Invalid reset token"
                    ));
        }

        User user = userOptional.get();

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry()
                        .isBefore(LocalDateTime.now())) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Reset token has expired"
                    ));
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        // Invalidate token after successful reset
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset successfully"
                )
        );
    }
}