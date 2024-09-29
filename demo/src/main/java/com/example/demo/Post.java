package com.example.demo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String content;
    
    private String username; // 작성자 username
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date(); // 기본값으로 현재 시간 설정
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt; // 수정 시 설정될 값

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
