package com.placementintelligence.common.response;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

import java.time.Instant;

public final class ApiResponseFactory {

    private ApiResponseFactory() {
    }

    public static <T> ApiResponse<T> success(
        T data,
        String message,
        HttpServletRequest request
    ) {
        return new ApiResponse<>(
            true,
            HttpStatus.OK.value(),
            message,
            data,
            Instant.now(),
            request.getRequestURI()
        );
    }

    public static <T> ApiResponse<T> created(
        T data,
        String message,
        HttpServletRequest request
    ) {
        return new ApiResponse<>(
            true,
            HttpStatus.CREATED.value(),
            message,
            data,
            Instant.now(),
            request.getRequestURI()
        );
    }

    public static ApiResponse<Void> error(
        HttpStatus status,
        String message,
        HttpServletRequest request
    ) {
        return new ApiResponse<>(
            false,
            status.value(),
            message,
            null,
            Instant.now(),
            request.getRequestURI()
        );
    }
}
