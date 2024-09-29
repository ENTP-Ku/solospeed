package com.example.demo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String receiver;
    private String message;

    @Column(name = "save_time")
    private LocalDateTime saveTime;
    private String formattedSaveTime; // 포맷팅된 날짜 필드 (프론트엔드로 보낼 때 사용)

}
