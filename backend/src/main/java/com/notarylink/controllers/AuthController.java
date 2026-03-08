package com.notarylink.controllers;

import com.notarylink.api.AuthApi;
import com.notarylink.dto.auth.AuthResponse;
import com.notarylink.dto.auth.ErrorResponse;
import com.notarylink.dto.auth.LoginRequest;
import com.notarylink.dto.auth.RegisterRequest;
import com.notarylink.dto.auth.ResendOtpRequest;
import com.notarylink.dto.auth.VerifyOtpRequest;
import com.notarylink.services.authentication.AuthService;
import com.notarylink.services.authentication.TwoFactorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private final AuthService authService;
    private final TwoFactorService twoFactorService;

    @Override
    public ResponseEntity<AuthResponse> register(RegisterRequest registerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(registerRequest));
    }

    @Override
    public ResponseEntity<AuthResponse> login(LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @Override
    public ResponseEntity<Void> verifyOtp(VerifyOtpRequest verifyOtpRequest) {
        try {
            twoFactorService.verifyCode(verifyOtpRequest.getEmail(), verifyOtpRequest.getCode());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return (ResponseEntity) ResponseEntity.badRequest()
                    .body(new ErrorResponse().message(e.getMessage() != null ? e.getMessage() : "Code invalide ou expiré"));
        }
    }

    @Override
    public ResponseEntity<Void> resendOtp(ResendOtpRequest resendOtpRequest) {
        try {
            twoFactorService.resendOtp(resendOtpRequest.getEmail());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return (ResponseEntity) ResponseEntity.badRequest()
                    .body(new ErrorResponse().message(e.getMessage() != null ? e.getMessage() : "Utilisateur introuvable"));
        }
    }
}
