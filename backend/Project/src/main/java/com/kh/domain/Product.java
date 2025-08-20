package com.kh.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "tbl_product")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SequenceGenerator(name = "PRODUCT_SEQ_GEN", sequenceName = "PRODUCT_SEQ", allocationSize = 1)
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PRODUCT_SEQ_GEN")
	private Long pno;
	
	@Column(nullable = false)
	private String pname;
	
	@Column(nullable = false)
	private int price;
	
	@Column(nullable = false)
	private int stock;
	
	@Column(nullable = false)
	private int perfumeVol;
	
	@Column(nullable = false, columnDefinition = "NUMBER(1,0) default 0")
	private boolean delFlag;
	
	@Column(nullable = false)
	private String pdesc;
	
	@ElementCollection
	@CollectionTable(name = "product_image_list", joinColumns = @JoinColumn(name = "product_pno"))

	@Builder.Default
	private List<ProductImage> imageList = new ArrayList<>();

	
	public void changeDel(boolean delFlag) {
		this.delFlag = delFlag;
	}
	public void changePrice(int price) {
		this.price = price;
	}

	public void changeStock(int stock) {
		this.stock = stock;
	}

	

	public void addImage(ProductImage image) {
		// 이미지 추가시 순서(ord) 자동 설정 (0, 1, 2, ...)
		image.setOrd(this.imageList.size());
		imageList.add(image);
	}

	public void addImageString(String fileName) {
		ProductImage productImage = ProductImage.builder().fileName(fileName).build();
		addImage(productImage);
	}

	public void clearList() {
		this.imageList.clear();
	}
	

}

