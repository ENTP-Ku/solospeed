import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const jwtToken = localStorage.getItem('jwt');
  const navigate = useNavigate();

  // Function to fetch posts using axios
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setPosts(response.data); // response.data에 데이터 저장
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  useEffect(() => {
    // Fetch posts when the component mounts
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('ko-KR', options).replace(',', ''); // 한국어 형식으로 변환
  };

  return (
    <div>
      <h2>게시물 목록</h2>
      {jwtToken && (
        <button onClick={() => navigate('/Write')}>글쓰기</button>
      )}
      {jwtToken && (
        <button onClick={handleLogout}>로그아웃</button>
      )}
      <ul>
        {posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // createdAt 기준 내림차순 정렬
          .map((post) => (
            <li key={post.id}>
              <Link to={`/postdetail/${post.id}`}>{post.title}</Link> - {post.username} - {formatDate(post.createdAt)} {/* 날짜 포맷 적용 */}
            </li>
          ))}
      </ul>
      <button onClick={() => navigate('/')}>홈</button>
    </div>
  );
};

export default Post;
