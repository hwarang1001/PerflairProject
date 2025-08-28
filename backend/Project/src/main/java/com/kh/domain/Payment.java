package com.kh.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "tbl_payments")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@SequenceGenerator(name = "PAYMENT_SEQ_GEN", sequenceName = "PAYMENT_SEQ", allocationSize = 1)

public class Payment {
	@Id
	@Column(name = "payment_id")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PAYMENT_SEQ_GEN")
	private Long paymentId;

	@ManyToOne
	@JoinColumn(name = "cno")
	private Cart cart;

	private String payMethod;

	private String payStatus;

	private Long totalAmount;

	@Column(name = "payment_date", nullable = false)
	private LocalDateTime paymentDate;

	@OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PaymentDetail> details = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "address_id") // MemberAddress의 기본 키를 참조
	private MemberAddress shippingAddress; // 배송지 정보를 담는 필드 추가
}
