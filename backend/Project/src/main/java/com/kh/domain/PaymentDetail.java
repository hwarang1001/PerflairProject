package com.kh.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "tbl_payment_detail")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@SequenceGenerator(name = "PAYMENT_DETAIL_SEQ_GEN", sequenceName = "PAYMENT_DETAIL_SEQ", allocationSize = 1)
public class PaymentDetail {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PAYMENT_DATAIL_SEQ_GEN")
	private Long detailId;

	@ManyToOne
	@JoinColumn(name = "payment_id")
	private Payment payment;

	@ManyToOne
	@JoinColumn(name = "OID")
	private ProductOption productOption;

	// DB에 pno 컬럼이 있는데, ProductOption.product.pno에서 가져오도록 매핑
	@Column(name = "pno")
	private Long pno;

	private int quantity;

	private int price;
}
