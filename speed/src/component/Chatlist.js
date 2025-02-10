import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import io from "socket.io-client"; 
import { jwtDecode } from "jwt-decode"; 

const socket = io("http://localhost:4000"); // 소켓 서버에 연결

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const senderUsername = extractUsernameFromToken(); 

  function extractUsernameFromToken() {
    const token = localStorage.getItem("jwt"); 
    if (!token) return null;

    const payload = jwtDecode(token); 
    return payload.username; 
  }

  const fetchAllChats = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/chats/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const filteredChats = response.data.filter(
        (chat) => chat.sender === senderUsername || chat.receiver === senderUsername
      );

      const modifiedChats = filteredChats.map((chat) => {
        if (chat.sender === senderUsername) {
          return { ...chat, receiver: chat.receiver }; 
        }
        return chat; 
      });

      const uniqueChats = [];
      const chatMap = {};

      modifiedChats.forEach((chat) => {
        const chatSender = chat.sender === senderUsername ? chat.receiver : chat.sender; 

        if (!chatMap[chatSender]) {
          chatMap[chatSender] = chat; 
        } else {
          if (chat.id > chatMap[chatSender].id) {
            chatMap[chatSender] = chat; 
          }
        }
      });

      Object.values(chatMap).forEach((chat) => uniqueChats.push(chat));

      const sortedChats = uniqueChats.sort((a, b) => b.id - a.id);
      setChats(sortedChats);
    } catch (error) {
      console.error("채팅 메시지 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    // 소켓 메시지 수신
    socket.on("receiveMessage", (newMessage) => {
      const chatSender = newMessage.sender === senderUsername ? newMessage.receiver : newMessage.sender;

      setChats((prevChats) => {
        const isDuplicate = prevChats.some(
          (chat) => chat.sender === chatSender || chat.receiver === chatSender
        );

        if (!isDuplicate) {
          return [newMessage, ...prevChats]; // 새로운 메시지를 추가
        } else {
          // 중복인 경우 기존 메시지를 업데이트
          return prevChats.map(chat => 
            (chat.sender === chatSender || chat.receiver === chatSender) ? newMessage : chat
          );
        }
      });
    });

    return () => {
      socket.off("receiveMessage"); 
    };
  }, [senderUsername]);

  const handleChatClick = (receiver) => {
    const chatUrl = `/Chat?username=${receiver}`; 
    window.open(chatUrl, '_blank', 'width=400,height=600'); 
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  return (
    <div>
      <h2>채팅 목록</h2>
      <div>
        {chats.map((chat, index) => (
          <div
            key={index}
            onClick={() =>
              handleChatClick(
                chat.sender === senderUsername ? chat.receiver : chat.sender
              )
            }
            style={{ cursor: "pointer" }}
          >
            <strong>
              {chat.sender === senderUsername ? chat.receiver : chat.sender}
            </strong>
            : {chat.message} <em>({chat.formattedSaveTime})</em>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
