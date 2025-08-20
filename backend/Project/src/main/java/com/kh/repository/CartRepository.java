package com.kh.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

	@Query("select cart from Cart cart where cart.owner.userId = :userId")
	public Optional<Cart> getCartOfMember(@Param("userId") String userId);

	Optional<Cart> findByOwnerUserId(String userId);
}
