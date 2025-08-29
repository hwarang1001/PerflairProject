package com.kh.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Cart;
import com.kh.domain.CartItem;
import com.kh.domain.MemberAddress;
import com.kh.domain.Payment;
import com.kh.domain.PaymentDetail;
import com.kh.domain.Product;
import com.kh.domain.ProductOption;
import com.kh.dto.PaymentDetailDTO;
import com.kh.dto.PaymentHistoryDTO;
import com.kh.dto.PaymentRequestDTO;
import com.kh.repository.CartItemRepository;
import com.kh.repository.MemberAddressRepository;
import com.kh.repository.PaymentDetailRepository;
import com.kh.repository.PaymentRepository;
import com.kh.repository.ProductOptionRepository;
import com.kh.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository paymentRepository;
	private final PaymentDetailRepository paymentDetailRepository;
	private final ProductRepository productRepository;
	private final CartItemRepository cartItemRepository;
	private final MemberAddressRepository memberAddressRepository;
	private final ProductOptionRepository productOptionRepository;
	@Override
	@Transactional
	public Long completePayment(PaymentRequestDTO requestDTO) {
		log.info("Starting payment completion process for user: {}", requestDTO.getUserId());

		// 1. DTO에 포함된 cinoList를 사용하여 선택된 장바구니 아이템 목록을 가져옵니다.
		List<CartItem> cartItems = cartItemRepository.findByCinoIn(requestDTO.getCinoList());

		// 2. 선택된 아이템이 없을 경우 예외를 발생시킵니다.
		if (cartItems.isEmpty()) {
			throw new IllegalArgumentException("Selected cart items are empty. Cannot process payment.");
		}

		// 3. 보안을 위해, 선택된 아이템들이 요청한 사용자의 장바구니에 속하는지 확인합니다.
		// 모든 아이템이 같은 장바구니에 속하는 것을 가정합니다.
		Cart cart = cartItems.get(0).getCart();
		if (!cart.getOwner().getUserId().equals(requestDTO.getUserId())) {
			throw new IllegalArgumentException("User ID does not match the cart items' owner.");
		}

		// 3. 총 결제 금액 계산
		long totalAmount = cartItems.stream()
				.mapToLong(item -> (long) item.getQty() * item.getProductOption().getPrice()).sum();
		log.info("Calculated total amount: {}", totalAmount);

//		// 4. 결제 PG사 API 호출 (실제 구현 필요)
//		boolean paymentSuccess = processPaymentWithPG(requestDTO, totalAmount);
//
//		if (!paymentSuccess) {
//			log.warn("Payment failed for user: {}", requestDTO.getUserId());
//			// 결제 실패 로직 처리
//			throw new IllegalStateException("Payment failed.");
//		}
		// 5. 배송지 정보 가져오기
		MemberAddress shippingAddress = null;
		if (requestDTO.getShippingAddressId() != null) {
			shippingAddress = memberAddressRepository.findById(requestDTO.getShippingAddressId())
					.orElseThrow(() -> new IllegalArgumentException("Shipping address not found."));
		}

		// 5. Payment 테이블에 결제 기록 추가
		Payment payment = Payment.builder().cart(cart).payMethod(requestDTO.getPayMethod()).payStatus("COMPLETED")
				.totalAmount(totalAmount).paymentDate(LocalDateTime.now()).shippingAddress(shippingAddress).build();
		Payment savedPayment = paymentRepository.save(payment);

		// 6. PaymentDetail 테이블에 상세 내역 기록
		for (CartItem cartItem : cartItems) {
			PaymentDetail paymentDetail = PaymentDetail.builder().payment(savedPayment)
					.productOption(cartItem.getProductOption()).quantity(cartItem.getQty())
					.price(cartItem.getProductOption().getPrice())
					.pno(cartItem.getProductOption().getProduct().getPno()).build();
			paymentDetailRepository.save(paymentDetail);

			ProductOption productOption = cartItem.getProductOption();
            if (productOption.getStock() < cartItem.getQty()) {
                throw new IllegalArgumentException("Not enough stock for product option " + productOption.getOid());
            }
            productOption.removeStock(cartItem.getQty());
            productOptionRepository.save(productOption);
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
	
	@Override
    @Transactional(readOnly = true) // ✅ 조회 전용이므로 readOnly = true 설정
    public List<PaymentHistoryDTO> getPaymentHistory(String userId) {
        log.info("Fetching payment history for user: {}", userId);

        // 1. PaymentRepository를 사용하여 특정 사용자의 모든 결제 정보를 가져옵니다.
        // 이 때, 연관된 PaymentDetail 정보도 함께 가져오도록 JPA의 Join Fetch를 사용할 수 있습니다.
        List<Payment> payments = paymentRepository.findByCart_Owner_UserIdOrderByPaymentDateDesc(userId);

        // 2. 조회된 Payment 엔티티 리스트를 DTO 리스트로 변환합니다.
        List<PaymentHistoryDTO> historyDTOs = new ArrayList<>();

        for (Payment payment : payments) {
            // PaymentDetail 엔티티 리스트를 PaymentDetailDTO 리스트로 변환
            List<PaymentDetailDTO> details = new ArrayList<>();
            for (PaymentDetail detail : payment.getDetails()) {
            	Optional<Product> product = productRepository.findById(detail.getPno());
            	Product product_ = product.get();
            	 // 대표 이미지 추출 (ord == 0)
                String imageFile = product_.getImageList().stream()
                    .filter(img -> img.getOrd() == 0)
                    .map(img -> img.getFileName())
                    .findFirst()
                    .orElse(null); // 없으면 null 반환
                // 상품 옵션 (용량)
                int perfumeVol = detail.getProductOption().getPerfumeVol();
                PaymentDetailDTO detailDTO = PaymentDetailDTO.builder()
                        .productOptionId(detail.getProductOption().getOid()).brand(product_.getBrand())
                        .pname(product_.getPname()).imageFile(imageFile).perfumeVol(perfumeVol)
                        .pno(detail.getProductOption().getProduct().getPno()).qty(detail.getQuantity())
                        .price(detail.getPrice()).build();
                details.add(detailDTO);
            }

            // Payment 엔티티를 PaymentHistoryDTO로 변환
            PaymentHistoryDTO historyDTO = PaymentHistoryDTO.builder().paymentId(payment.getPaymentId())
                    .userId(payment.getCart().getOwner().getUserId()).shippingAddress(payment.getShippingAddress().getAddress())
                    .totalAmount(payment.getTotalAmount()).paymentDate(payment.getPaymentDate().toLocalDate())
                    .payMethod(payment.getPayMethod()).details(details).build();

            historyDTOs.add(historyDTO);
        }

        return historyDTOs;
    }

}