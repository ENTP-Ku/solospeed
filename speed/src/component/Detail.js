import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/Detail.css"; // CSS 파일 임포트
import { jwtDecode } from "jwt-decode"; // Named import로 변경

const Detail = () => {
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();
  const jwtToken = localStorage.getItem("jwt");
  let username = "";

  // JWT에서 username 추출
  if (jwtToken) {
    try {
      const decodedToken = jwtDecode(jwtToken); // jwtDecode 함수 사용
      username = decodedToken.username; // username이 포함되어 있다고 가정
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/items/${id}`
        );
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
        alert("상품 정보를 가져오는 데 실패했습니다."); // 사용자에게 에러 메시지 표시
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    try {
        const cartItem = {
            imagesInCart: item.images,
            productNameInCart: item.productName,
            priceInCart: item.price,
            usernameInCart: username,
            itemId: item.id,  // itemId를 포함해 전송
        };

        const response = await axios.post("http://localhost:8080/api/cart/save", cartItem);
        alert("장바구니에 저장되었습니다."); // 성공 메시지
    } catch (error) {
        if (error.response) {
            // 서버에서 반환한 에러 메시지 표시
            alert(error.response.data); // 여기서 에러 메시지를 표시
        } else {
            alert("장바구니에 담는 데 실패했습니다."); // 다른 원인으로 실패한 경우
        }
    }
};
    
  const handleOrder = () => {
    if (!jwtToken) {
      alert("로그인 후 주문할 수 있습니다.");
      return;
    }
    navigate("/Order"); // 주문하기 페이지로 이동
  };

  const handleChat = () => {
    if (!jwtToken) {
      alert("로그인 후 판매자와 채팅할 수 있습니다.");
      return;
    }
    // 새로운 창에서 판매자와 채팅하기
    window.open(
      `/Chat?username=${item.productUploader}`,
      "",
      "width=800,height=600"
    ); // 두 번째 인자 ''로 빈 문자열 설정
  };

  if (!item) {
    return <div>Loading...</div>; // 아이템 로딩 중
  }

  return (
    <div>
      <button onClick={() => navigate("/")}>홈</button>
      <button onClick={() => navigate("/Shop")}>목록으로</button>
      <img
        className="item-image"
        src={`http://localhost:8080${item.images}`}
        alt={item.productName}
      />
      <h3>{item.productName}</h3>
      <p>카테고리: {item.category}</p>
      <p>가격: {item.price}</p>
      <p>업로더: {item.productUploader}</p>

      {jwtToken && (
        <>
          <label>
            수량:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              min="1"
            />
          </label>
          <button onClick={handleAddToCart}>장바구니에 담기</button>
          <button onClick={handleOrder}>주문하기</button>
          {item.productUploader !== username && ( // 판매자와 채팅하기 버튼 조건부 렌더링
            <button onClick={handleChat}>판매자와 채팅하기</button>
          )}
        </>
      )}
    </div>
  );
};

export default Detail;
