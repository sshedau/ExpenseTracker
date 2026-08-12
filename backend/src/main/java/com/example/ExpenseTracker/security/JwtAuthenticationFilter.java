package com.example.ExpenseTracker.security;

import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");


        // No JWT
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }


        try {

            String token =
                    authHeader.substring(7);

            String email =
                    jwtService.extractEmail(token);


            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            if (user != null) {

                String role = user.getRole();

                System.out.println(
                        "ROLE FROM DB: " + role
                );


                if (role != null) {

                    // Normalize role
                    role = role.trim();

                    if (role.startsWith("ROLE_")) {
                        role = role.substring(5);
                    }


                    System.out.println(
                            "AUTHORITY: " + role
                    );


                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    Collections.singletonList(
                                            new SimpleGrantedAuthority(role)
                                    )
                            );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(auth);
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT authentication failed: "
                            + e.getMessage()
            );
        }


        filterChain.doFilter(request, response);
    }
}