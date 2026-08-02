package com.passwordvault.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.passwordvault.entity.User;
import com.passwordvault.repository.UserRepo;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        String authHeader = request.getHeader("Authorization");
        

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }
        System.out.println("Auth Header: " + authHeader);

        String token = authHeader.substring(7);
        System.out.println("Token: " + token);


        String email = jwtUtil.extractEmail(token);
        System.out.println("email"+email);

        if(email != null &&
           SecurityContextHolder.getContext().getAuthentication() == null) {


            User user = userRepo.findByEmail(email)
                    .orElse(null);


            if(user != null && jwtUtil.validateToken(token)) {

                UsernamePasswordAuthenticationToken authentication =
                 new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    Collections.emptyList()
            );





                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                        .buildDetails(request)
                );


                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

        }


        filterChain.doFilter(request, response);

    }
}