import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 아이디와 비밀번호 입력 유효성 검사
    if (!username) {
      alert('아이디를 입력해주세요');
      return;
    }
    if (!password) {
      alert('비밀번호를 입력해주세요');
      return;
    }
    
    try {
      // 사용자 존재 여부 확인
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username,
        password,
      });

      // 로그인 성공 시
      if (response.status === 200) {
        const token = response.data; // JWT 토큰을 받아옴 (문자열)
        localStorage.setItem('jwt', token); // 로컬 스토리지에 토큰 저장
        alert('로그인 성공');
        navigate('/'); // 홈으로 리다이렉트
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert('존재하지 않는 아이디입니다.');
        } else if (error.response.status === 401) {
          alert('비밀번호가 일치하지 않습니다.');
        } else {
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        console.error('로그인 오류:', error);
        alert('서버에 문제가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleLogin}>로그인</button>
      <button onClick={() => navigate('/Register')}>회원가입</button>
      <button onClick={() => navigate('/')}>홈</button>
    </div>
  );
};

export default Login;
