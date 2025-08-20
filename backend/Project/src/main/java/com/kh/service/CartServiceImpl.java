package com.kh.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kh.domain.Cart;
import com.kh.domain.CartItem;
import com.kh.domain.Member;
import com.kh.domain.Product;
import com.kh.dto.CartItemDTO;
import com.kh.dto.CartItemListDTO;
import com.kh.repository.CartItemRepository;
import com.kh.repository.CartRepository;
import com.kh.repository.MemberRepository;
import com.kh.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor
@Service
@Log4j2
public class CartServiceImpl implements CartService {
	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final MemberRepository memberRepository;
	private final ProductRepository productRepository;

	
	 private CartItemDTO entityToDTO(CartItem cartItem) {
	        if (cartItem == null) {
	            return null;
	        }
	        CartItemDTO dto = new CartItemDTO();
	        dto.setCino(cartItem.getCino());
	        dto.setUserId(cartItem.getCart().getOwner().getUserId());
	        dto.setPno(cartItem.getProduct().getPno());
	        dto.setQty(cartItem.getQty());
	        return dto;
	    }

	    /**
	     * DTO to Entity 변환 메서드
	     * @param cartItemDTO CartItemDTO
	     * @return CartItem 엔티티
	     */
	    private CartItem dtoToEntity(CartItemDTO cartItemDTO) {
	        if (cartItemDTO == null) {
	            return null;
	        }
	        
	        // DTO에서 ID를 가져와서 엔티티를 찾거나 새로 생성
	        CartItem cartItem = CartItem.builder()
	            .cino(cartItemDTO.getCino())
	            .qty(cartItemDTO.getQty())
	            // 필요한 경우 Cart와 Product 엔티티를 레포지토리에서 조회하여 설정
	            .cart(cartRepository.getCartOfMember(cartItemDTO.getUserId()).orElse(null))
	            .product(productRepository.findById(cartItemDTO.getPno()).orElse(null))
	            .build();
	            
	        return cartItem;
	    }
	
	public long calculateTotalPrice(Long cno) {
        long totalPrice = 0;

        // 1. 장바구니 번호(cno)를 이용하여 CartItemListDTO 목록을 가져온다.
        // 이 DTO에는 이미 상품 가격(price)과 수량(qty) 정보가 포함되어 있다.
        List<CartItemListDTO> cartItems = cartItemRepository.getItemsOfCartDTOByCart(cno);

        // 2. 각 DTO의 가격과 수량을 곱하여 totalPrice에 합산한다.
        for (CartItemListDTO item : cartItems) {
            totalPrice += (item.getPrice() * item.getQty());
        }

        return totalPrice;
    }
	
	@Override
	public List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO) {
		String email = cartItemDTO.getUserId();
		Long pno = cartItemDTO.getPno();
		int qty = cartItemDTO.getQty();
		Long cino = cartItemDTO.getCino();
		log.info("======================");
		log.info(cartItemDTO.getCino() == null);
		
		Cart cart = getCart(email);
		CartItem cartItem = null;
		
		if (cino != null) { // 장바구니 아이템 번호가 있어서 수량만 변경하는 경우
			Optional<CartItem> cartItemResult = cartItemRepository.findById(cino);
			cartItem = cartItemResult.orElseThrow();
			cartItem.changeQty(qty);
			
		} else { // 장바구니 아이템 번호 cino가 없는 경우
			// 이미 동일한 상품이 담긴적이 있을 수 있으므로
			cartItem = cartItemRepository.getItemOfPno(email, pno);
	
			if (cartItem == null) {
				// DTO를 사용하여 새로운 CartItem 엔티티 생성
				cartItem = dtoToEntity(cartItemDTO);
			} else {
				cartItem.changeQty(qty);
			}
		}

		// 상품 아이템 저장
		cartItemRepository.save(cartItem);
		return getCartItems(email);
	}

	// 사용자의 장바구니가 없었다면 새로운 장바구니를 생성하고 반환
	private Cart getCart(String email) {
		Cart cart = null;
		Optional<Cart> result = cartRepository.getCartOfMember(email);
		if (result.isEmpty()) {
			log.info("Cart of the member is not exist!!");
			// Member member = Member.builder().email(email).build();
			Optional<Member> _result = memberRepository.findById(email);
			Member member = _result.orElseThrow();
			Cart tempCart = Cart.builder().owner(member).build();
			cart = cartRepository.save(tempCart);
		} else {
			cart = result.get();
		}	
		return cart;
	}

	@Override
	public List<CartItemListDTO> getCartItems(String email) {
		return cartItemRepository.getItemsOfCartDTOByEmail(email);
	}

	@Override
	public List<CartItemListDTO> remove(Long cino) {
		Long cno = cartItemRepository.getCartFromItem(cino);
		log.info("cart no: " + cno);
		cartItemRepository.deleteById(cino);
		return cartItemRepository.getItemsOfCartDTOByCart(cno);
	}
	  public Long calculateSelectedCartTotalPrice(String userId, List<Long> cartItemIds) {
	        // 리포지토리 메서드를 호출하여 데이터베이스에서 총 가격을 조회
	        return cartItemRepository.getSelectedCartTotalPrice(userId, cartItemIds);
	    }
}
