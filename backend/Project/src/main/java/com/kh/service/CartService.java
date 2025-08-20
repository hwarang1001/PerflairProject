package com.kh.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.kh.dto.CartItemDTO;
import com.kh.dto.CartItemListDTO;

@Transactional
public interface CartService {
	// 장바구니 아이템 추가 혹은 변경
	public List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO);

	// 모든 장바구니 아이템 목록
	public List<CartItemListDTO> getCartItems(String userId);

	// 아이템 삭제
	public List<CartItemListDTO> remove(Long cino);
	  
	public Long calculateSelectedCartTotalPrice(String userId, List<Long> cartItemIds);
}
