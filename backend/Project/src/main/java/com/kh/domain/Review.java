package com.kh.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "tbl_review")
@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@SequenceGenerator(name = "REVIEW_SEQ_GEN", sequenceName = "REVIEW_SEQ", allocationSize = 1)
public class Review {

	@Id
	@Column(name = "REVIEW_ID")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "REVIEW_SEQ_GEN")
	private Long reviewId;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "USER_ID", nullable = false)
	private Member member;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "PRODUCT_ID", nullable = false)
	private Product product;
	
	@Column(name = "RATING", nullable = false)
	private Integer rating;

	@CreationTimestamp
	@Column(name = "CREATED_AT", updatable = false)
	private LocalDate createdAt;

	@Column(name = "CONTENT", nullable = false, length = 4000)
	private String content;

	@ElementCollection
	@Builder.Default
	@CollectionTable(name = "Review_image_list", joinColumns = @JoinColumn(name = "review_id"))
	private List<ReviewImage> imageList = new ArrayList<>();

	public void addImage(ReviewImage image) {
		// 이미지 추가시 순서(ord) 자동 설정 (0, 1, 2, ...)
		image.setOrd(this.imageList.size());
		imageList.add(image);
	}

	public void addImageString(String fileName) {
		ReviewImage reviewImage = ReviewImage.builder().fileName(fileName).build();
		addImage(reviewImage);
	}
}
