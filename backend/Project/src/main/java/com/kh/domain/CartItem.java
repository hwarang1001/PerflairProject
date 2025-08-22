package com.kh.domain;

import jakarta.persistence.Column;
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
import lombok.Setter;
import lombok.ToString;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString(exclude = {"cart", "productOption"})
@Table(name = "tbl_cart_item", indexes = {
		@Index(columnList = "cno", name = "idx_cartitem_cart"),
		@Index(columnList = "pno, cno", name = "idx_cartitem_pno_cart") // 인덱스 이름은 변경
})
public class CartItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cino;

	// CartItem은 특정 ProductOption과 연결됩니다.
	@ManyToOne
	@JoinColumn(name = "oid") // 옵션 ID를 외래키로 사용
	private ProductOption productOption;
	
	 // DB에 pno 컬럼이 있는데, ProductOption.product.pno에서 가져오도록 매핑
    @Column(name = "pno")
    private Long pno;

	@ManyToOne
	@JoinColumn(name = "cno")
	private Cart cart;

	private int qty;

	public void changeQty(int qty) {
		this.qty = qty;
	}
}
