import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwt');

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/'); // 홈으로 이동
  };

  const handleChatList = () => {
    window.open('/Chatlist', null, 'width=400,height=600'); // 새 윈도우로 Chatlist.js 열기
  };

  const handleDirectChat = () => {
    const username = extractUsernameFromJWT();
    if (username === 'master') {
      window.open('/Chatlist', null, 'width=400,height=600'); // master일 경우 Chatlist.js 열기
    } else {
      window.open(`/Chat?username=master`, null, 'width=400,height=600'); // master가 아닐 경우 Chat.js 열기
    }
  };

  const handleCart = () => {    
    navigate('/cart'); 
  };


  const extractUsernameFromJWT = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username;
    }
    return null;
  };

  return (
    <div>
      {jwtToken ? (
        <>
          <button onClick={() => navigate('/Shop')}>중고거래게시판</button>
          <button onClick={handleLogout}>로그아웃</button>
          <button onClick={() => navigate('/Post')}>자유게시판</button>
          <button onClick={handleDirectChat}>1대1문의</button> {/* 새 윈도우로 열기 */}
          <button onClick={handleChatList}>채팅목록</button> {/* 새 윈도우로 열기 */}
          <button onClick={handleCart}>장바구니</button>

        </>
      ) : (
        <>
          <button onClick={() => navigate('/Login')}>로그인</button>
          <button onClick={() => navigate('/Register')}>회원가입</button>
          <button onClick={() => navigate('/Shop')}>중고거래게시판</button>
          <button onClick={() => navigate('/Post')}>자유게시판</button>
        </>
      )}
    </div>
  );
};

export default Home;
