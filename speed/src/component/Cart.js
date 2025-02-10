import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // jwtDecode 가져오기

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("jwt");

  const baseUrl = "http://localhost:8080"; // 서버의 기본 URL

  const fetchCartItems = async () => {
    try {
      const decodedToken = jwtDecode(jwtToken);
      const username = decodedToken.username;

      if (!username) {
        throw new Error("사용자 이름이 없습니다.");
      }

      const response = await axios.get(`http://localhost:8080/api/cart?username=${username}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log("장바구니 아이템 응답:", response.data); // 응답 데이터 확인
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("장바구니 아이템 가져오기 오류:", error);
      setError("장바구니 아이템을 가져오는 데 실패했습니다.");
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      fetchCartItems();
    } catch (error) {
      console.error("장바구니 아이템 삭제 오류:", error);
      alert("장바구니 아이템을 삭제하는 데 실패했습니다.");
    }
  };

  const handleOrder = () => {
    navigate("/order");
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>장바구니</h2>
      <button onClick={() => navigate('/')}>홈</button>
      {cartItems.length === 0 ? (
        <div>장바구니에 상품이 없습니다.</div>
      ) : (
        <ul>
          {cartItems.map((cart) => (
            <li key={cart.id}>
              <img src={`${baseUrl}${cart.imagesInCart}`} alt={cart.productNameInCart} width="100" />
              <h3>{cart.productNameInCart}</h3> {/* 상품명 */}
              <p>가격: {cart.priceInCart}원</p> {/* 가격 */}
              <button onClick={() => removeFromCart(cart.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <button onClick={handleOrder}>주문하기</button>
      )}
    </div>
  );
};

export default Cart;
