package com.example.ExpenseTracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String role;

    // Profile
    private String phone;

    private String profileImageUrl;

    // Password reset
    @JsonIgnore
    private String resetToken;

    @JsonIgnore
    private LocalDateTime resetTokenExpiry;
}