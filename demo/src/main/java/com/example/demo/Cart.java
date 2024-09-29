package com.example.demo;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imagesInCart;        // 상품 이미지
    private String productNameInCart;  // 상품명
    private Double priceInCart;         // 가격
    private String usernameInCart;      // 사용자 이름
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item;  // 외래키로 Item과 연결
}
