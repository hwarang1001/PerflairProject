package com.kh.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Cart;
import com.kh.domain.CartItem;
import com.kh.domain.Member;
import com.kh.domain.Product;
import com.kh.domain.ProductOption;
import com.kh.dto.CartItemDTO;
import com.kh.dto.CartItemListDTO;
import com.kh.repository.CartItemRepository;
import com.kh.repository.CartRepository;
import com.kh.repository.MemberRepository;
import com.kh.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class CartServiceImpl implements CartService {

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final MemberRepository memberRepository;

	/** 장바구니 조회 */
	public List<CartItemListDTO> getCartItems(String userId) {
		return cartItemRepository.getItemsOfCartDTOByEmail(userId);
	}

	/** 장바구니에 상품 추가 */
	public void addItem(CartItemDTO dto, String userId) {
		// 1. 유저용 Cart 가져오기 (없으면 생성)
		Cart cart = cartRepository.findByOwnerUserId(userId).orElseGet(() -> createCartForUser(userId));

		// 2. 옵션으로 Product 가져오기
		Product product = productRepository.findByOptionId(dto.getProductOptionId())
				.orElseThrow(() -> new IllegalArgumentException("상품 또는 옵션이 존재하지 않습니다."));

		// 3. 옵션 객체 찾기
		ProductOption option = product.getOptions().stream().filter(op -> op.getOid().equals(dto.getProductOptionId()))
				.findFirst().orElseThrow(() -> new IllegalArgumentException("해당 옵션을 찾을 수 없습니다."));

		// 4. 이미 장바구니에 있으면 수량 증가
		CartItem existing = cartItemRepository.getItemOfPno(userId, product.getPno());
		if (existing != null) {
			existing.changeQty(existing.getQty() + dto.getQty());
		} else {
			CartItem item = CartItem.builder().cart(cart).productOption(option).qty(dto.getQty())
					.pno(option.getProduct().getPno()).build();
			cart.addCartItem(item);
		}
	}

	/** 장바구니 아이템 삭제 */
	public void removeItem(Long cino) {
		CartItem item = cartItemRepository.findById(cino)
				.orElseThrow(() -> new IllegalArgumentException("장바구니 아이템이 없습니다."));
		cartItemRepository.delete(item);
	}

	/** 장바구니 수량 변경 */
	@Transactional
	public void changeQty(Long cino, int qty) {
		System.out.println(">>> changeQty 요청 cino=" + cino + ", qty=" + qty);
		CartItem item = cartItemRepository.findById(cino)
				.orElseThrow(() -> new IllegalArgumentException("장바구니 아이템이 없습니다."));
		item.changeQty(qty);
	}

	/** 선택 아이템 총액 계산 */
	public Long getSelectedTotal(String userId, List<Long> cartItemIds) {
		return cartItemRepository.getSelectedCartTotalPrice(userId, cartItemIds);
	}

	public Cart createCartForUser(String userIdFromToken) {
		// JWT에서 넘어온 userId를 안전하게 trim
		String userId = userIdFromToken.trim();
		log.info("userId");
		// DB에서 Member 조회
		Member member = memberRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. userId=" + userId));

		// Cart 생성 후 Member 연결
		Cart cart = Cart.builder().owner(member) // owner에 Member 넣기
				.build();

		return cartRepository.save(cart);
	}

	
}
