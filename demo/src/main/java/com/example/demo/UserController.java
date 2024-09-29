package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService; 

    @Autowired
    private PasswordEncoder passwordEncoder; // 비밀번호 암호화 사용을 위한 빈

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login") // 로그인 요청을 처리하는 메서드
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());
        
        if (user == null) {
            return ResponseEntity.status(404).body("존재하지 않는 아이디입니다.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        // JWT 생성 로직 추가 필요
        String jwt = userService.generateJwtToken(user); // JWT 생성
        return ResponseEntity.ok(jwt); // JWT 반환
    }
}
