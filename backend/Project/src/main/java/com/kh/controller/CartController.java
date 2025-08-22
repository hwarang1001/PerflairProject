package com.kh.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.domain.CartItem;
import com.kh.dto.CartItemDTO;
import com.kh.dto.CartItemListDTO;
import com.kh.dto.MemberDTO;
import com.kh.service.CartServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartServiceImpl cartService;

	/** SecurityContext에서 MemberDTO 가져와 장바구니 조회 */
	@GetMapping("/")
	public ResponseEntity<List<CartItemListDTO>> getCart() {
		String userId = getCurrentUserId();
		List<CartItemListDTO> items = cartService.getCartItems(userId);
		return ResponseEntity.ok(items);
	}

	/** 장바구니 상품 추가 */
	@PostMapping("/")
	public ResponseEntity<String> addCart(@RequestBody CartItemDTO dto) {
		String userId = getCurrentUserId();
		cartService.addItem(dto, userId);
		return ResponseEntity.ok("장바구니에 추가되었습니다.");
	}

	/** 장바구니 아이템 삭제 */
	@DeleteMapping("/")
	public ResponseEntity<String> removeItems(@RequestBody List<Long> cinos) {
	    cartService.removeItems(cinos); // 서비스에서 여러 아이템 삭제
	    return ResponseEntity.ok("선택된 아이템들이 삭제되었습니다.");
	}

	/** 장바구니 수량 변경 */
	@PutMapping("/{cino}")
	public ResponseEntity<String> changeQty(@PathVariable Long cino, @RequestBody CartItemDTO cartItemDTO) {
		cartService.changeQty(cino, cartItemDTO.getQty());
		return ResponseEntity.ok("수량 변경 완료");
	}

	/** SecurityContext에서 현재 로그인한 사용자 ID 가져오기 */
	private String getCurrentUserId() {
		MemberDTO member = (MemberDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return member.getUserId();
	}

	@PostMapping("/total")
	public ResponseEntity<Long> getSelectedTotal(@RequestBody List<Long> cartItemIds) {
		String userId = getCurrentUserId();
		Long total = cartService.getSelectedTotal(userId, cartItemIds);
		return ResponseEntity.ok(total != null ? total : 0L);
	}
}