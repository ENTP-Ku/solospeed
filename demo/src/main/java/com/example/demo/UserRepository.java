package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // username으로 사용자 조회
    User findByUsername(String username);
    
    // username이 존재하는지 확인하는 메서드
    boolean existsByUsername(String username);
}
