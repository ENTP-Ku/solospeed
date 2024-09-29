package com.example.demo;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ItemRepository itemRepository;



    // 장바구니에 상품 추가
    @PostMapping("/save")
    public ResponseEntity<?> saveToCart(@RequestBody Map<String, Object> requestData) {
        Long itemId = Long.parseLong(requestData.get("itemId").toString()); // itemId 추출
        String username = requestData.get("usernameInCart").toString(); // username 추출

        // itemId로 Item을 찾음
        Item item = itemRepository.findById(itemId)
                                  .orElseThrow(() -> new RuntimeException("Item not found"));

        // Cart 객체 생성 및 저장
        Cart cart = new Cart();
        cart.setItem(item); // item 설정
        cart.setUsernameInCart(username); // username 설정

        cartRepository.save(cart);

        return ResponseEntity.ok().build();
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
