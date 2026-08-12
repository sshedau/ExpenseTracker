package com.example.ExpenseTracker.controller;

import com.example.ExpenseTracker.dto.SupportRequestDto;
import com.example.ExpenseTracker.entity.SupportRequest;
import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.SupportRequestRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportRequestRepository supportRequestRepository;

    @PostMapping("/contact")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> contactSupport(
            @RequestBody SupportRequestDto request,
            Authentication auth) {

        if (request.getSubject() == null ||
                request.getSubject().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Subject is required"
                    ));
        }

        if (request.getMessage() == null ||
                request.getMessage().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Message is required"
                    ));
        }

        if (request.getMessage().length() > 5000) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Message must be less than 5000 characters"
                    ));
        }

        User user = (User) auth.getPrincipal();

        SupportRequest supportRequest =
                new SupportRequest();

        supportRequest.setEmail(user.getEmail());
        supportRequest.setSubject(request.getSubject().trim());
        supportRequest.setMessage(request.getMessage().trim());
        supportRequest.setStatus("OPEN");
        supportRequest.setCreatedAt(LocalDateTime.now());

        supportRequestRepository.save(supportRequest);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Support request submitted successfully"
                )
        );
    }
}