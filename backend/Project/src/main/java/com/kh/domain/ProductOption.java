package com.kh.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tbl_product_option")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOption {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long oid;

	@Column(nullable = false)
	private int price;

	@Column(nullable = false)
	private int stock;

	@Column(nullable = false)
	private int perfumeVol;

	// Product와 ManyToOne 관계 매핑 (옵션은 한 상품에 속한다)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_pno")
	private Product product;
}