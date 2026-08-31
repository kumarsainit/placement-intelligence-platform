package com.placementintelligence.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final JwtProperties jwtProperties;

    private final SecretKey secretKey;

    public static final String CLAIM_TOKEN_TYPE = "type";
    public static final String TOKEN_TYPE_ACCESS = "ACCESS";
    public static final String TOKEN_TYPE_REFRESH = "REFRESH";

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

    public String extractTokenType(String token) {

        Claims claims = extractAllClaims(token);
        return claims.get(CLAIM_TOKEN_TYPE, String.class);
    }

    public boolean isAccessToken(String token) {

        try {
            String type = extractTokenType(token);
            return TOKEN_TYPE_ACCESS.equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {

        try {
            String type = extractTokenType(token);
            return TOKEN_TYPE_REFRESH.equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenValid(String token, String username) {

        try {
            String extractedUsername = extractUsername(token);

            return extractedUsername.equals(username)
                && !extractAllClaims(token)
                .getExpiration()
                .before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRefreshTokenValid(String token, String username) {

        return isRefreshToken(token) && isTokenValid(token, username);
    }

    public String generateAccessToken(String username) {

        Date now = new Date();

        Date expiry = new Date(
            now.getTime() +
                jwtProperties.accessTokenExpiration()
        );

        return Jwts.builder()
            .subject(username)
            .claim(CLAIM_TOKEN_TYPE, TOKEN_TYPE_ACCESS)
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
            .claim(CLAIM_TOKEN_TYPE, TOKEN_TYPE_REFRESH)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(secretKey)
            .compact();
    }

}
