package com.madadnow.backend.controller;

import com.madadnow.backend.dto.AdminLoginDTO;
import com.madadnow.backend.utils.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody AdminLoginDTO dto) {

        // 🔥 For now (demo): hardcoded admin
        if ("admin".equals(dto.getUsername()) && "password".equals(dto.getPassword())) {
            return JwtUtil.generateToken(dto.getUsername());
        }

        throw new RuntimeException("Invalid credentials");
    }
}