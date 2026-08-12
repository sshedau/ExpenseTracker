package com.example.ExpenseTracker.repository;

import com.example.ExpenseTracker.entity.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportRequestRepository
        extends JpaRepository<SupportRequest, Long> {
}