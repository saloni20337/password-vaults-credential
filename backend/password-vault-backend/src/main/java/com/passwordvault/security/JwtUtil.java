package com.passwordvault.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET =
            "mysecretkeymysecretkeymysecretkey123456";

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes());


    // Generate Token
    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                + 86400000
                        )
                )
                .signWith(key)
                .compact();
    }


    // Extract email from token
    public String extractEmail(String token){

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

    }


    // Validate token
    public boolean validateToken(String token){

        try {

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch(Exception e){

            return false;
        }
    }
}