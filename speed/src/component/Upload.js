import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios를 사용하여 API 호출

const Upload = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    // 입력 검증
    if (!productName) {
      alert('상품이름을 입력해 주세요');
      return;
    }
    if (!category) {
      alert('카테고리를 선택해 주세요');
      return;
    }
    if (!price) {
      alert('가격을 입력해 주세요');
      return;
    }
    if (!image) {
      alert('사진을 등록해 주세요');
      return;
    }

    // JWT 토큰에서 username 추출
    const token = localStorage.getItem('jwt'); // JWT 토큰을 로컬 스토리지에서 가져옴
    const username = token ? JSON.parse(atob(token.split('.')[1])).username : '';

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('product_uploader', username); // username 추가
    formData.append('image', image);

    try {
      // API 호출
      await axios.post('http://localhost:8080/api/items/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // 인증 헤더 추가
        },
      });

      // 업로드 성공 후 Shop.js로 이동
      navigate('/Shop');
    } catch (error) {
      console.error('Error uploading item:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>상품 등록</h1>
      <input 
        type="text" 
        value={productName} 
        onChange={(e) => setProductName(e.target.value)} 
        placeholder="상품 이름" 
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">카테고리 선택</option>
        <option value="휴대기기">휴대기기</option>
        <option value="의류">의류</option>
        <option value="식품">식품</option>
      </select>
      <input 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        placeholder="상품 가격" 
      />
      <input 
        type="file" 
        onChange={(e) => setImage(e.target.files[0])} 
      />
      <button onClick={handleUpload}>등록</button>
      <button onClick={() => navigate('/')}>홈</button>
      <button onClick={() => navigate('/Shop')}>목록으로</button>
    </div>
  );
};

export default Upload;
