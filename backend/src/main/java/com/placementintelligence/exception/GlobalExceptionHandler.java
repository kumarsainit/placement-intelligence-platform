package com.placementintelligence.exception;

import com.placementintelligence.common.response.ApiResponse;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(
        ResourceNotFoundException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(
        BadRequestException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(
        UnauthorizedException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.UNAUTHORIZED.value(),
            ex.getMessage(),
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {

        String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error ->
                error.getField() + ": " + error.getDefaultMessage()
            )
            .collect(Collectors.joining(", "));

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.BAD_REQUEST.value(),
            message,
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(response);
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ApiResponse<Void>> handleFileStorageException(
        FileStorageException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Unable to process resume file.",
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
        Exception ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred.",
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
        AccessDeniedException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.FORBIDDEN.value(),
            "Access denied: " + ex.getMessage(),
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(
        BadCredentialsException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.UNAUTHORIZED.value(),
            "Invalid credentials",
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<Void>> handleJwtException(
        JwtException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.UNAUTHORIZED.value(),
            "Invalid or expired token",
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(
        HttpMessageNotReadableException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.BAD_REQUEST.value(),
            "Malformed request body",
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceAlreadyExists(
        ResourceAlreadyExistsException ex,
        HttpServletRequest request
    ) {

        ApiResponse<Void> response = new ApiResponse<>(
            false,
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            null,
            Instant.now(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(response);
    }
}
