package com.kh.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Member;
import com.kh.domain.Product;
import com.kh.domain.Review;
import com.kh.domain.ReviewImage;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ReviewDTO;
import com.kh.repository.MemberRepository;
import com.kh.repository.ProductRepository;
import com.kh.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {

	private final ReviewRepository reviewRepository;
	private final MemberRepository memberRepository;
	private final ProductRepository productRepository;

	@Override
	@Transactional
	public Long register(ReviewDTO reviewDTO) {

		Product product = productRepository.findById(reviewDTO.getPno())
				.orElseThrow(() -> new RuntimeException("상품이 존재하지 않습니다"));

		// 2. DTO에서 사용자 ID를 추출
		String userId = reviewDTO.getUserId();

		// 3. 사용자 ID로 DB에서 Member 엔티티를 조회하여 영속성 컨텍스트에 포함시킴
		Member member = memberRepository.findById(userId).orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다"));

		Review review = dtoToEntity(reviewDTO, member, product);
		Review saved = reviewRepository.save(review);
		return saved.getReviewId();
	}

	@Override
	public ReviewDTO get(Long reviewId) {
		Review review = reviewRepository.selectOne(reviewId).orElseThrow(() -> new RuntimeException("리뷰가 존재하지 않습니다"));
		return entityToDto(review);
	}

	@Override
	@Transactional
	public void remove(Long reviewId) {
		reviewRepository.deleteById(reviewId);
	}

	@Override
	public PageResponseDTO<ReviewDTO> list(PageRequestDTO pageRequestDTO) {
		log.info("getList ");
		// 페이지 시작 번호가 0 부터 시작하므로
		Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
				Sort.by("reviewId").descending());
		Page<Object[]> result = reviewRepository.selectList(pageable);
		List<ReviewDTO> dtoList = result.get().map(arr -> {
			Review review = (Review) arr[0];
			ReviewImage reviewImage = (ReviewImage) arr[1];
			ReviewDTO reviewDTO = ReviewDTO.builder().reviewId(review.getReviewId())
					.userId(review.getMember().getUserId()).pno(review.getProduct().getPno()).rating(review.getRating())
					.createdAt(review.getCreatedAt()).content(review.getContent()).build();

			String imageStr = reviewImage.getFileName();
			reviewDTO.setUploadFileNames(List.of(imageStr));
			return reviewDTO;
		}).collect(Collectors.toList());
		long totalCount = result.getTotalElements();
		return PageResponseDTO.<ReviewDTO>withAll().dtoList(dtoList).totalCount(totalCount)
				.pageRequestDTO(pageRequestDTO).build();
	}

	// entity -> dto 변환
	private ReviewDTO entityToDto(Review review) {
		ReviewDTO dto = new ReviewDTO();
		dto.setReviewId(review.getReviewId());
		dto.setUserId(review.getMember().getUserId());
		if (review.getProduct() != null) {
			dto.setPno(review.getProduct().getPno());
		}
		dto.setRating(review.getRating());
		dto.setContent(review.getContent());
		dto.setCreatedAt(review.getCreatedAt());
		// 이미지 변환 추가 가능
		if (review.getImageList() != null && !review.getImageList().isEmpty()) {
			List<String> uploadFileNames = review.getImageList().stream().map(image -> image.getFileName())
					.collect(Collectors.toList());
			dto.setUploadFileNames(uploadFileNames);
		} else {
			dto.setUploadFileNames(new ArrayList<>());
		}
		return dto;
	}

	// dto -> entity 변환
	private Review dtoToEntity(ReviewDTO reviewDTO, Member member, Product product) {
		Review review = Review.builder().reviewId(reviewDTO.getReviewId()).member(member).product(product)
				.rating(reviewDTO.getRating()).content(reviewDTO.getContent()).createdAt(reviewDTO.getCreatedAt())
				.build();
		// 업로드 처리가 끝난 파일들의 이름 리스트
		List<String> uploadFileNames = reviewDTO.getUploadFileNames();
		if (uploadFileNames == null) {
			return review;
		}
		uploadFileNames.stream().forEach(uploadName -> {
			review.addImageString(uploadName);
		});
		return review;
	}
}
