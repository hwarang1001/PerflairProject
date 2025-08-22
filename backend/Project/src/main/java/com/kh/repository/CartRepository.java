package com.kh.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // 특정 유저의 Cart 조회
    @Query("SELECT c FROM Cart c WHERE c.owner.userId = :userId")
    Optional<Cart> findCartByUserId(@Param("userId") String userId);

    // 메서드 이름으로도 조회 가능
    Optional<Cart> findByOwnerUserId(String userId);
}