package com.example.demo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private String secretKey = "yourSecretKey"; // 비밀 키
    private long validityInMilliseconds = 3600000; // 1시간

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username); // username을 claims에 추가
        return createToken(claims);
    }

    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims) // claims 설정, sub 사용하지 않음
                .setIssuedAt(new Date(System.currentTimeMillis())) // 발급일
                .setExpiration(new Date(System.currentTimeMillis() + validityInMilliseconds)) // 만료일
                .signWith(SignatureAlgorithm.HS256, secretKey) // 서명 알고리즘 및 비밀 키
                .compact(); // JWT 생성
    }

    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private String extractUsername(String token) {
        // "username" claims에서 추출
        return extractAllClaims(token).get("username", String.class);
    }

    private Claims extractAllClaims(String token) {
        // claims에서 모든 정보 추출
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    private boolean isTokenExpired(String token) {
        // 토큰 만료 여부 확인
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}
