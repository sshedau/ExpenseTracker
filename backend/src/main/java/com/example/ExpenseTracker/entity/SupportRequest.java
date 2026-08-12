package com.example.ExpenseTracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status;

    private LocalDateTime createdAt;
}