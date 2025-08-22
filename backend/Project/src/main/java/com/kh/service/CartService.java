package com.kh.service;

import java.util.List;

import com.kh.domain.Cart;
import com.kh.dto.CartItemDTO;
import com.kh.dto.CartItemListDTO;

public interface CartService {

    /** 장바구니 조회 */
    List<CartItemListDTO> getCartItems(String userId);

    /** 장바구니에 상품 추가 */
    void addItem(CartItemDTO dto, String userId);

    /** 장바구니 아이템 삭제 */
    void removeItems(List<Long> cinos);

    /** 장바구니 수량 변경 */
    void changeQty(Long cino, int qty);

    /** 선택 아이템 총액 계산 */
    Long getSelectedTotal(String userId, List<Long> cartItemIds);
   
    Cart createCartForUser(String userId);
}
