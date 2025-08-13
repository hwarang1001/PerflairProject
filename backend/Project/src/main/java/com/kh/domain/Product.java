package com.kh.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "tbl_product")
@Getter
@Setter
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
	private String brand;

	@Column(nullable = false)
	private String pname;

	@Column(nullable = false, columnDefinition = "NUMBER(1,0) default 0")
	private boolean delFlag;

	@Column(nullable = false)
	private String pdesc;

	@ElementCollection
	@CollectionTable(name = "product_image_list", joinColumns = @JoinColumn(name = "product_pno"))
	@Builder.Default
	@Fetch(FetchMode.SUBSELECT)
	private List<ProductImage> imageList = new ArrayList<>();

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	@Fetch(FetchMode.SUBSELECT)
	private Set<ProductOption> options = new HashSet<>();

	public void changeDel(boolean delFlag) {
		this.delFlag = delFlag;
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

	public void addOption(ProductOption option) {
		option.setProduct(this);
		options.add(option);
	}

	public void clearOptions() {
		options.clear();
	}

}
