package com.placementintelligence.exception;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

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
