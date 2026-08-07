package com.placementintelligence.common.response;

import java.time.Instant;

public record ApiResponse<T>(
    boolean success,
    int status,
    String message,
    T data,
    Instant timestamp,
    String path
) {
}
