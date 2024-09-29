package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    // 날짜 포맷 정의 (yyyy년 MM월 dd일 HH:mm)
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH:mm");

    public List<Chat> getChatMessages(String sender, String receiver) {
        Set<Chat> uniqueMessages = new HashSet<>(); // Set 사용하여 중복 제거
        List<Chat> messages1 = chatRepository.findBySenderAndReceiverOrderBySaveTimeAsc(sender, receiver);
        List<Chat> messages2 = chatRepository.findByReceiverAndSenderOrderBySaveTimeAsc(receiver, sender);

        uniqueMessages.addAll(messages1);
        uniqueMessages.addAll(messages2);

        // List로 변환 후 ID 기준으로 정렬
        List<Chat> formattedMessages = new ArrayList<>(uniqueMessages);
        formattedMessages.sort((chat1, chat2) -> Long.compare(chat1.getId(), chat2.getId())); // ID 기준 정렬

        // 각 메시지의 save_time을 yyyy년 MM월 dd일 HH:mm 형식으로 변환
        for (Chat chat : formattedMessages) {
            chat.setFormattedSaveTime(chat.getSaveTime().format(DATE_FORMATTER)); // 포맷팅된 날짜 설정
        }

        return formattedMessages; // 변환된 리스트 반환
    }

    public void saveMessage(Chat chat) {
        chat.setSaveTime(LocalDateTime.now());
        chatRepository.save(chat);
    }
}
