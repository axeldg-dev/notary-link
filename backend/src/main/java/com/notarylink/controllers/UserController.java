package com.notarylink.controllers;

import com.notarylink.api.UserApi;
import com.notarylink.dto.auth.User;
import com.notarylink.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserService userService;

    @Override
    public ResponseEntity<User> getCurrentUser() {
        com.notarylink.model.entities.User principal =
            (com.notarylink.model.entities.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.getCurrentUser(principal));
    }
}
