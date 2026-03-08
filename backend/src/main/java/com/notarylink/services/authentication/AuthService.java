package com.notarylink.services.authentication;

import com.notarylink.dto.auth.AuthResponse;
import com.notarylink.dto.auth.LoginRequest;
import com.notarylink.dto.auth.RegisterRequest;
import com.notarylink.model.entities.User;
import com.notarylink.model.enums.Role;
import com.notarylink.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TwoFactorService twoFactorService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .build();

        String otp = twoFactorService.generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);
        twoFactorService.sendOtp(user.getEmail(), otp);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(jwtService.generateAccessToken(user));

        return response;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        if (!user.isOtpVerified()) {
            String otp = twoFactorService.generateOtp();
            user.setOtpCode(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);
            twoFactorService.sendOtp(user.getEmail(), otp);
        }

        AuthResponse response = new AuthResponse();
        response.setAccessToken(jwtService.generateAccessToken(user));
        return response;
    }
}
