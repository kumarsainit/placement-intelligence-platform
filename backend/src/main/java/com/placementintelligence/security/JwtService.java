package com.placementintelligence.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final JwtProperties jwtProperties;

    private final SecretKey secretKey;

    public JwtService(JwtProperties jwtProperties) {

        this.jwtProperties = jwtProperties;

        this.secretKey = Keys.hmacShaKeyFor(
            jwtProperties.secret()
                .getBytes(StandardCharsets.UTF_8)
        );
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String extractUsername(String token) {

        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String username) {

        String extractedUsername = extractUsername(token);

        return extractedUsername.equals(username)
            && !extractAllClaims(token)
            .getExpiration()
            .before(new Date());
    }

    public String generateAccessToken(String username) {

        Date now = new Date();

        Date expiry = new Date(
            now.getTime() +
                jwtProperties.accessTokenExpiration()
        );

        return Jwts.builder()
            .subject(username)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(secretKey)
            .compact();
    }

    public String generateRefreshToken(String username) {

        Date now = new Date();

        Date expiry = new Date(
            now.getTime() +
                jwtProperties.refreshTokenExpiration()
        );

        return Jwts.builder()
            .subject(username)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(secretKey)
            .compact();
    }

}
