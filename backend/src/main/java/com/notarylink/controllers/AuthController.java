package com.notarylink.controllers;

import com.notarylink.api.AuthApi;
import com.notarylink.dto.auth.AuthResponse;
import com.notarylink.dto.auth.LoginRequest;
import com.notarylink.dto.auth.RegisterRequest;
import com.notarylink.services.authentication.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private final AuthService authService;

    @Override
    public ResponseEntity<AuthResponse> register(RegisterRequest registerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(registerRequest));
    }

    @Override
    public ResponseEntity<AuthResponse> login(LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}
