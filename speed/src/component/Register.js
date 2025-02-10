import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios import 추가

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uniqueNumber, setUniqueNumber] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword || !uniqueNumber) {
      alert('모든 필드를 입력해주세요');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // API 호출 로직 추가
    console.log('가입 요청 보내는 중...'); // 로그 추가
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        username,
        password,
        uniqueNumber,
      });

      console.log('응답 상태:', response.status); // 응답 상태 로그 추가

      if (response.status === 200) {
        alert('가입이 완료되었습니다. 로그인 후 이용해주세요.');
        navigate('/Login');
      } else {
        console.log('응답 오류 메시지:', response.data); // 오류 메시지 로그 추가
        alert('가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버에 문제가 발생했습니다.');
    }
  };
  
  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호 확인" />
      <input type="text" value={uniqueNumber} onChange={(e) => setUniqueNumber(e.target.value)} placeholder="고유번호" />
      <button onClick={handleRegister}>가입</button>
      <button onClick={() => navigate('/')}>홈</button>
    </div>
  );
};

export default Register;
