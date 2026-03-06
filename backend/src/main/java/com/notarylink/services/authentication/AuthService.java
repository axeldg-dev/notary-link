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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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

        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(jwtService.generateAccessToken(user));
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        AuthResponse response = new AuthResponse();
        response.setAccessToken(jwtService.generateAccessToken(user));
        return response;
    }
}
