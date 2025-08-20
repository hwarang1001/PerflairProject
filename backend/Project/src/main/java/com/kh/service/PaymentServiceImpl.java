package com.kh.service;


import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Cart;
import com.kh.domain.CartItem;
import com.kh.domain.Payment;
import com.kh.domain.PaymentDetail;
import com.kh.dto.PaymentRequestDTO;
import com.kh.repository.CartItemRepository;
import com.kh.repository.CartRepository;
import com.kh.repository.PaymentDetailRepository;
import com.kh.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
@Service
@RequiredArgsConstructor
@Log4j2
public class PaymentServiceImpl implements PaymentService {

	
	private final PaymentRepository paymentRepository;
    private final PaymentDetailRepository paymentDetailRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
	@Override
	@Transactional
	public Long completePayment(PaymentRequestDTO requestDTO) {
		log.info("Starting payment completion process for user: {}", requestDTO.getUserId());

		// 1. 장바구니 정보 가져오기
		Cart cart = cartRepository.findByOwnerUserId(requestDTO.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("Cart not found for user: " + requestDTO.getUserId()));

		// 2. 장바구니 아이템 목록 가져오기
		List<CartItem> cartItems = cartItemRepository.findByCart(cart);
		if (cartItems.isEmpty()) {
			throw new IllegalArgumentException("Cart is empty. Cannot process payment.");
		}

		// 3. 총 결제 금액 계산
		long totalAmount = cartItems.stream().mapToLong(item -> (long) item.getQty() * item.getProduct().getPrice())
				.sum();
		log.info("Calculated total amount: {}", totalAmount);

		// 4. 결제 PG사 API 호출 (실제 구현 필요)
		boolean paymentSuccess = processPaymentWithPG(requestDTO, totalAmount);

		if (!paymentSuccess) {
			log.warn("Payment failed for user: {}", requestDTO.getUserId());
			// 결제 실패 로직 처리
			throw new IllegalStateException("Payment failed.");
		}

		// 5. Payment 테이블에 결제 기록 추가
		Payment payment = Payment.builder().cart(cart).payMethod(requestDTO.getPayMethod()).payStatus("COMPLETED")
				.totalAmount(totalAmount).build();
		Payment savedPayment = paymentRepository.save(payment);

		// 6. PaymentDetail 테이블에 상세 내역 기록
		for (CartItem cartItem : cartItems) {
			PaymentDetail paymentDetail = PaymentDetail.builder().payment(savedPayment).product(cartItem.getProduct())
					.quantity(cartItem.getQty()).price(cartItem.getProduct().getPrice()).build();
			paymentDetailRepository.save(paymentDetail);

			// 7. 재고 감소 (실제 비즈니스 로직에 맞게 구현)
			// product.removeStock(cartItem.getQty());
			// productRepository.save(product);
		}

		// 8. 장바구니 비우기
		cartItemRepository.deleteAll(cartItems);

		log.info("Payment successfully completed. Payment ID: {}", savedPayment.getPaymentId());
		return savedPayment.getPaymentId();
	}

	// PG사 결제 처리 가상 메서드
	private boolean processPaymentWithPG(PaymentRequestDTO requestDTO, long amount) {
		// 이 부분에 실제 결제 게이트웨이(PG) API 호출 로직을 구현합니다.
		// 예를 들어, 카카오페이, 토스페이 API를 호출하고 응답을 처리하는 로직이 들어갑니다.
		// 여기서는 예시로 항상 성공을 반환합니다.
		return true;
	}

}
