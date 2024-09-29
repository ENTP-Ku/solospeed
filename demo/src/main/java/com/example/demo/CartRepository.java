package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUsernameInCart(String username); // 메소드 이름 수정
    Optional<Cart> findByItemAndUsernameInCart(Item item, String usernameInCart);

}
	