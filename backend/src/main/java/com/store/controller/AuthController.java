package com.store.controller;

import com.store.auth.PasswordUtils;
import com.store.auth.TokenStore;
import com.store.dto.LoginRequest;
import com.store.dto.SignupRequest;
import com.store.dto.UserResponse;
import com.store.model.User;
import com.store.model.UserRole;
import com.store.repository.UserRepository;
import com.store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final TokenStore tokenStore;
    @Autowired
    private UserService userService;

    public AuthController(UserRepository userRepository, TokenStore tokenStore) {
        this.userRepository = userRepository;
        this.tokenStore = tokenStore;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.CUSTOMER);
        user.setPassword(PasswordUtils.hash(request.getPassword()));
        userRepository.save(user);

        String token = tokenStore.generateToken(user.getId());
        UserResponse userResponse = userService.mapToUserResponse(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", userResponse);
        response.put("token", token);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !PasswordUtils.match(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = userOpt.get();
        String token = tokenStore.generateToken(user.getId());
        UserResponse userResponse = userService.mapToUserResponse(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", userResponse);
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

}
