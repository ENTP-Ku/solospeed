const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Express 앱 설정
const app = express();
const server = http.createServer(app);

// Socket.IO 설정
const io = socketIO(server, {
  cors: {
    origin: "*",  // 모든 도메인 허용 (CORS 문제 방지)
    methods: ["GET", "POST"]
  }
});

// 소켓 연결 시 이벤트 처리
io.on('connection', (socket) => {
  console.log('새로운 클라이언트가 연결되었습니다.');

  // 클라이언트로부터 메시지 받기
  socket.on('sendMessage', (msg) => {
    console.log('메시지 수신:', msg);
    
    // 메시지를 다시 클라이언트에게 보내기 (브로드캐스트)
    io.emit('receiveMessage', msg); // 이벤트 이름을 'receiveMessage'로 변경
  });

  // 클라이언트가 연결을 끊었을 때 처리
  socket.on('disconnect', () => {
    console.log('클라이언트가 연결을 끊었습니다.');
  });
});

// 4000번 포트에서 서버 실행
server.listen(4000, () => {
  console.log('서버가 4000번 포트에서 실행 중입니다.');
});
