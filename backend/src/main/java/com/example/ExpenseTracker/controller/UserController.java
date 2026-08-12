package com.example.ExpenseTracker.controller;

import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Backend base URL
    // Local: http://localhost:8081
    // Render: https://expense-tracker-backend-p1gj.onrender.com
    @Value("${app.base-url:http://localhost:8081}")
    private String baseUrl;


    // ================= PROFILE =================

    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> getProfile(Authentication auth) {

        User user = (User) auth.getPrincipal();

        return ResponseEntity.ok(
                Map.of(
                        "userId", user.getUserId(),

                        "name",
                        user.getName(),

                        "email",
                        user.getEmail(),

                        "phone",
                        user.getPhone() == null
                                ? ""
                                : user.getPhone(),

                        "role",
                        user.getRole() == null
                                ? ""
                                : user.getRole(),

                        "profileImage",
                        user.getProfileImageUrl() == null
                                ? ""
                                : user.getProfileImageUrl()
                )
        );
    }


    // ================= UPDATE PROFILE =================

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> updateProfile(
            @RequestBody User updatedUser,
            Authentication auth) {

        User user = (User) auth.getPrincipal();

        if (updatedUser.getName() == null ||
                updatedUser.getName().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Name is required"
                            )
                    );
        }

        user.setName(updatedUser.getName());

        if (updatedUser.getPhone() != null) {
            user.setPhone(updatedUser.getPhone());
        }

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Profile updated successfully",

                        "name",
                        user.getName(),

                        "email",
                        user.getEmail(),

                        "phone",
                        user.getPhone() == null
                                ? ""
                                : user.getPhone()
                )
        );
    }


    // ================= PROFILE IMAGE =================

    @PutMapping("/profile-image")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("image") MultipartFile image,
            Authentication auth) {

        try {

            User user = (User) auth.getPrincipal();

            // Check file
            if (image == null || image.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Please select an image"
                                )
                        );
            }


            // Maximum 5 MB
            if (image.getSize() > 5 * 1024 * 1024) {

                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Image must be smaller than 5 MB"
                                )
                        );
            }


            // Check content type
            String contentType =
                    image.getContentType();

            if (contentType == null ||
                    !contentType.startsWith("image/")) {

                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Only image files are allowed"
                                )
                        );
            }


            // Create upload directory
            Path uploadDirectory =
                    Paths.get("uploads/profile-images");

            Files.createDirectories(uploadDirectory);


            // Get extension
            String originalName =
                    image.getOriginalFilename();

            String extension = "";

            if (originalName != null &&
                    originalName.contains(".")) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }


            // Generate unique filename
            String fileName =
                    UUID.randomUUID() + extension;


            Path filePath =
                    uploadDirectory.resolve(fileName);


            // Save file
            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );


            // =========================
            // GENERATE IMAGE URL
            // =========================

            String imageUrl =
                    baseUrl +
                            "/uploads/profile-images/" +
                            fileName;


            // Save URL in database
            user.setProfileImageUrl(imageUrl);

            userRepository.save(user);


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile image uploaded successfully",

                            "profileImage",
                            imageUrl
                    )
            );

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to upload image"
                            )
                    );
        }
    }


    // ================= CHANGE PASSWORD =================

    @PutMapping("/change-password")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<String> changePassword(
            @RequestBody Map<String, String> req,
            Authentication auth) {

        User user = (User) auth.getPrincipal();

        String currentPassword =
                req.get("password");

        String newPassword =
                req.get("newPassword");


        // Validation
        if (currentPassword == null ||
                newPassword == null ||
                currentPassword.isBlank() ||
                newPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(
                            "All fields are required"
                    );
        }


        if (newPassword.length() < 6) {

            return ResponseEntity.badRequest()
                    .body(
                            "Password must be at least 6 characters"
                    );
        }


        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Incorrect current password"
                    );
        }


        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);


        return ResponseEntity.ok(
                "Password updated successfully"
        );
    }


    // ================= DELETE ACCOUNT =================

    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Void> deleteAccount(
            Authentication auth) {

        User user =
                (User) auth.getPrincipal();

        userRepository.delete(user);

        return ResponseEntity
                .noContent()
                .build();
    }
}