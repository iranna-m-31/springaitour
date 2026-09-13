package com.imm.springai.tutor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global exception handler that returns consistent JSON error shapes
 * so the UI can render helpful hints instead of raw stack traces.
 * Uses only exception types known to exist in Spring AI 2.0.1.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", ex.getClass().getSimpleName());
        body.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
        body.put("hint", "Check the request and server configuration");
        body.put("path", request.getDescription(false));
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "invalid-request");
        body.put("message", ex.getMessage());
        body.put("hint", "Please check the request parameters and try again");
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(jakarta.servlet.ServletException.class)
    public ResponseEntity<Map<String, Object>> handleServlet(jakarta.servlet.ServletException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "invalid-endpoint");
        body.put("message", ex.getMessage());
        body.put("hint", "The requested endpoint may not exist or is not configured");
        return ResponseEntity.notFound().build();
    }
}