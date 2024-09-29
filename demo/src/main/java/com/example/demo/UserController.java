package com.example.demo;



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

    @Autowired
    private JwtUtil jwtUtil; // JwtUtil 클래스 주입

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
        String jwt = jwtUtil.generateToken(user.getUsername()); // JwtUtil의 generateToken 메서드 호출
        System.out.println(jwt);
        return ResponseEntity.ok(jwt); // JWT 반환
    }

    @PostMapping("/register") // 사용자 등록 요청 처리
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

}
