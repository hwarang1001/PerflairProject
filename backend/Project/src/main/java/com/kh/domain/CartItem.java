package com.kh.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude = { "cart", "product" })
@Table(name = "tbl_cart_item", indexes = { @Index(columnList = "cno", name = "idx_cartitem_cart"),
		@Index(columnList = "pno, cno", name = "idx_cartitem_pno_cart") })
public class CartItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cino;

	@ManyToOne
	@JoinColumn(name = "pno")
	private Product product;

	@ManyToOne
	@JoinColumn(name = "cno")
	private Cart cart;

	private int qty;

	public void changeQty(int qty) {
		this.qty = qty;
	}
}
