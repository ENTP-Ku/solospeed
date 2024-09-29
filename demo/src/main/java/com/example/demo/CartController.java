package com.example.demo;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    // 장바구니에 상품 추가
    @PostMapping("/save")
    public ResponseEntity<String> addToCart(@RequestBody Cart cart) {
        cartService.addToCart(cart);
        return ResponseEntity.ok("장바구니에 저장되었습니다.");
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getCartItems(@RequestParam String username) {
        List<Cart> cartItems = cartService.getCartsByUsername(username);
        return ResponseEntity.ok(cartItems);
    }
    
    // 장바구니 아이템 삭제
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Long itemId) {
        try {
            cartService.deleteCartItem(itemId);
            return ResponseEntity.ok("아이템이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("아이템 삭제에 실패했습니다.");
        }
    }

}
