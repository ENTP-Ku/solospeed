package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; 
    
    @Autowired
    private PasswordEncoder passwordEncoder; // PasswordEncoder를 자동 주입합니다.


    @Autowired
    private JwtUtil jwtUtil; // JWT 유틸리티 클래스

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username); // 사용자 조회
    }

    public String generateJwtToken(User user) {
        return jwtUtil.generateToken(user.getUsername()); // JWT 생성
    }
}
