package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUsername(String username); // 작성자별 게시물 조회
}
