package com.placementintelligence.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/users")
public class UserController {

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {

        return Map.of(
            "username", authentication.getName(),
            "authenticated", true
        );
    }
}
