package com.kh.service;

import java.util.List;

import com.kh.dto.PaymentHistoryDTO;
import com.kh.dto.PaymentRequestDTO;

public interface PaymentService {

	
	public Long completePayment(PaymentRequestDTO requestDTO);
	
	List<PaymentHistoryDTO> getPaymentHistory(String userId);
}
