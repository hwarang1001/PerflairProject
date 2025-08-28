package com.kh.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.dto.PaymentHistoryDTO;
import com.kh.dto.PaymentRequestDTO;
import com.kh.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

	private final PaymentService paymentService;

	@PostMapping("/complete")
	public ResponseEntity<String> completePayment(@RequestBody PaymentRequestDTO requestDTO) {
		log.info("Payment completion request received for user: {}", requestDTO.getUserId());

		try {
			Long paymentId = paymentService.completePayment(requestDTO);
			return new ResponseEntity<>("Payment completed successfully. Payment ID: " + paymentId, HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			log.error("Payment failed due to an error: {}", e.getMessage());
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			log.error("An unexpected error occurred during payment.", e);
			return new ResponseEntity<>("Payment failed.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	// ✅ 추가: 결제 내역 조회 API
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<PaymentHistoryDTO>> getPaymentHistory(@PathVariable String userId) {
        log.info("Payment history request received for user: {}", userId);
        List<PaymentHistoryDTO> history = paymentService.getPaymentHistory(userId);
        return ResponseEntity.ok(history);
    }
}
