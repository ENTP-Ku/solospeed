package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findBySenderAndReceiverOrderBySaveTimeAsc(String sender, String receiver);
    List<Chat> findByReceiverAndSenderOrderBySaveTimeAsc(String receiver, String sender);
}
