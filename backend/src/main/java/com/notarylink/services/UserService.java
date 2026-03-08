package com.notarylink.services;

import com.notarylink.dto.auth.User;
import com.notarylink.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public com.notarylink.model.entities.User loadUserByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public User getCurrentUser(com.notarylink.model.entities.User entity) {
        User dto = new User();
        dto.setId(entity.getId().toString());
        dto.setEmail(entity.getEmail());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setPhone(entity.getPhone());
        dto.setRole(User.RoleEnum.valueOf(entity.getRole().name()));
        dto.setOtpVerified(entity.isOtpVerified());
        return dto;
    }
}
