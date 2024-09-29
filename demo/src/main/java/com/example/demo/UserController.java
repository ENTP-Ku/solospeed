package com.example.demo;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

// 다른 import 문 생략

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login") // 로그인 요청을 처리하는 메서드
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return ResponseEntity.status(404).body("존재하지 않는 아이디입니다.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        // JWT 생성 로직
        String jwt = generateJwtToken(user); // JWT 생성
        System.out.println(jwt);
        return ResponseEntity.ok(jwt); // JWT 반환
    }

    private String generateJwtToken(User user) {
        // JWT 생성
        return Jwts.builder()
                .setSubject(user.getUsername()) // 주제는 사용자 이름
                .setIssuedAt(new Date()) // 발급일
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 만료일 (1일 후)
                .signWith(SignatureAlgorithm.HS256, "secret_key") // 서명 알고리즘 및 비밀 키
                .compact(); // JWT 생성
    }
}
