package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @GetMapping
    public List<Chat> getChats(@RequestParam String sender, @RequestParam String receiver) {
        return chatService.getChatMessages(sender, receiver);
    }

    @PostMapping
    public void sendMessage(@RequestBody Chat chat) {
        chatService.saveMessage(chat);
    }
    
    // 모든 채팅 메시지 가져오기
    @GetMapping("/all")
    public List<Chat> getAllChats() {
        return chatService.getAllChats();
    }



}
