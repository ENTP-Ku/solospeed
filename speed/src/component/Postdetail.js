import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const jwtToken = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  // 게시물 세부정보를 가져오는 함수
  const fetchPostDetail = async () => {
    const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setPost(data);
    } else {
      throw new Error('게시물 세부정보를 가져오는 데 실패했습니다.');
    }
  };

  // 게시물을 삭제하는 함수
  const deletePost = async () => {
    const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (response.ok) {
      navigate('/post'); // 삭제 후 게시물 목록으로 리다이렉트
    } else {
      throw new Error('게시물 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 게시물 세부정보를 가져옴
    fetchPostDetail().catch(err => console.error(err));
  }, [id]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>작성자: {post.username}</p>      
      <button onClick={deletePost}>게시물 삭제</button>
      <button onClick={() => navigate('/post')}>게시물 목록으로 돌아가기</button>
    </div>
  );
};

export default PostDetail;
