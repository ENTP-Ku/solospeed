package com.example.demo;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    // 장바구니에 상품 추가
    public Cart addToCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public List<Cart> getCartsByUsername(String username) {
        return cartRepository.findByUsernameInCart(username);
    }

    // 장바구니 아이템 삭제
    public void deleteCartItem(Long itemId) {
        // 아이템이 존재하는지 확인 후 삭제
        if (cartRepository.existsById(itemId)) {
            cartRepository.deleteById(itemId);
        } else {
            throw new RuntimeException("해당 아이템이 존재하지 않습니다.");
        }
    }


}


