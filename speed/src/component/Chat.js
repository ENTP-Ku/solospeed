import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode"; 
import io from "socket.io-client"; 

const socket = io("http://localhost:4000"); // 소켓 서버 URL

const Chat = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlUsername = queryParams.get("username"); 
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [inputMessage, setInputMessage] = useState(""); 

  const extractUsernameFromToken = () => {
    const token = localStorage.getItem("jwt"); 
    if (!token) return null;
    const payload = jwtDecode(token); 
    return payload.username; 
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/chats/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`, 
        },
      });

      const senderUsername = extractUsernameFromToken(); 
      const filteredMessages = response.data.filter(
        (msg) => (msg.sender === senderUsername || msg.receiver === senderUsername) &&
                  (msg.sender === urlUsername || msg.receiver === urlUsername)
      );

      setMessages(filteredMessages); 
      setLoading(false); 
    } catch (error) {
      console.error("메시지 가져오기 오류:", error); 
      setError("메시지를 가져오는 데 실패했습니다."); 
      setLoading(false); 
    }
  };

  const sendMessage = async () => {
    if (!inputMessage) return; 

    const senderUsername = extractUsernameFromToken(); 
    const messageData = {
      sender: senderUsername,
      receiver: urlUsername,
      message: inputMessage,
      createdAt: new Date().toISOString(), // 현재 시간을 ISO 형식으로 추가
      formattedSaveTime: formatDate(new Date()), // 포매팅된 시간 추가
    };

    try {
      // DB에 메시지 저장
      await axios.post(
        "http://localhost:8080/api/chats", 
        messageData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      // 소켓을 통해 메시지를 전송
      socket.emit("sendMessage", messageData); 

      setInputMessage(""); // 입력란 초기화
      fetchMessages(); // 메시지 목록 갱신
    } catch (error) {
      console.error("메시지 전송 오류:", error); 
      setError("메시지를 전송하는 데 실패했습니다."); 
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear(); // 연도
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const day = String(date.getDate()).padStart(2, '0'); // 일
    const hours = String(date.getHours()).padStart(2, '0'); // 시
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
  
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`; // 원하는 형식으로 반환
  };
  
  useEffect(() => {
    fetchMessages();
  
    // 소켓을 통해 수신한 메시지를 처리
    socket.on("receiveMessage", (message) => {
      // 수신한 메시지에 포매팅된 시간을 추가
      const formattedTime = formatDate(new Date()); // 현재 시간을 포맷팅
      message.formattedSaveTime = formattedTime; // 수신한 메시지에 포맷팅된 시간 추가
      setMessages((prevMessages) => [...prevMessages, message]); 
    });
  
    return () => {
      socket.off("receiveMessage"); 
    };
  }, []);
  
  if (loading) {
    return <div>로딩 중...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div>
      <h2>채팅 메시지 목록</h2>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.message}{" "}
            <em>({msg.formattedSaveTime})</em> {/* 포매팅된 시간 표시 */}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <button onClick={sendMessage}>전송</button> 
    </div>
  );
};

export default Chat;