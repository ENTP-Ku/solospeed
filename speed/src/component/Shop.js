import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Shop.css'; // CSS 파일 임포트

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/items");
        const data = response.data;
        const sortedData = data.sort(
          (a, b) => new Date(b.save_time) - new Date(a.save_time)
        );
        setProducts(sortedData);
        setFilteredProducts(sortedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const handleCategoryFilter = (category) => {
    if (category === "전체") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>홈</button>
      {jwtToken && (
        <button onClick={() => navigate("/Upload")}>상품등록</button>
      )}
      {jwtToken && (
        <button onClick={handleLogout}>로그아웃</button>
      )}
      <button onClick={() => handleCategoryFilter("전체")}>전체상품</button>
      <button onClick={() => handleCategoryFilter("휴대기기")}>휴대기기</button>
      <button onClick={() => handleCategoryFilter("의류")}>의류</button>
      <button onClick={() => handleCategoryFilter("식품")}>식품</button>

      <div className="product-container"> {/* 상품 컨테이너 추가 */}
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-item" // 상품 아이템 클래스 추가
            onClick={() => navigate(`/Detail/${product.id}`)}
          >
            <img
              src={`http://localhost:8080${product.images}`}
              alt={product.productName}
              style={{ width: "200px", height: "auto" }}
            />
            <h3>{product.productName}</h3>
            <p>{product.category}</p>
            <p>{product.price}</p>
            <p>{product.productUploader}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
