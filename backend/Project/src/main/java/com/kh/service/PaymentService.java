package com.kh.service;

import com.kh.dto.PaymentRequestDTO;

public interface PaymentService {

	
	Long completePayment(PaymentRequestDTO requestDTO);
}
