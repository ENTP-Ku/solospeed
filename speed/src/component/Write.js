import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 임포트

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const jwtToken = localStorage.getItem('jwt'); // JWT 토큰 가져오기
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt'); // JWT 토큰 제거
    navigate('/'); // 로그아웃 후 Home.js로 이동
  };

  const handlePostList = () => {
    navigate('/Post'); // 목록 버튼 클릭 시 Post.js로 이동
  };

  const savePost = async () => {
    // JWT 토큰에서 username 추출
    const username = extractUsernameFromJWT();
    const saveTime = new Date().toISOString(); // 로컬 날짜 및 시간 저장

    try {
      // POST 요청을 통한 새 게시물 저장
      const response = await axios.post('http://localhost:8080/api/posts', {
        title,
        content,
        username,
        save_time: saveTime,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        navigate('/Post'); // Post.js로 이동
      }
    } catch (error) {
      console.error('Failed to save post:', error); // 오류 로그
      throw new Error('Failed to save post');
    }
  };

  const extractUsernameFromJWT = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Decoded Payload:', payload); // 디코딩된 페이로드 로그
            return payload.username || null; // username이 없을 경우 null 반환
        } catch (error) {
            console.error('JWT 디코딩 오류:', error);
        }
    }
    return null;
};

  const handleSubmit = (e) => {
    e.preventDefault();

    // 제목 및 내용 유효성 검사
    if (!title) {
      alert('제목을 입력해 주세요');
      return;
    }

    if (!content) {
      alert('내용을 입력해 주세요');
      return;
    }

    savePost().catch(err => console.error(err)); // 게시물 저장
  };

  return (
    <div>
      <h2>새 게시물 작성하기</h2>
      <button onClick={() => navigate('/')}>홈</button> {/* 홈 버튼 */}
      {jwtToken && ( // JWT 토큰이 있을 때만 로그아웃 버튼 표시
        <button onClick={handleLogout}>로그아웃</button>
      )}
      <button onClick={handlePostList}>목록</button> {/* 목록 버튼 */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>내용:</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">등록</button> {/* 등록 버튼 */}
      </form>
    </div>
  );
};

export default Write;
