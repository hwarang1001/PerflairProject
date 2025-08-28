package com.kh.controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.dto.MemberDTO;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ReviewDTO;
import com.kh.service.ReviewService;
import com.kh.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/reviews") // 전역 prefix가 /api면 최종은 /api/v1/reviews
public class ReviewController {

	private final ReviewService service;
	private final CustomFileUtil fileUtil;

	@PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, Long> create(@ModelAttribute ReviewDTO reviewDTO,
			@RequestParam("files") List<MultipartFile> files, @AuthenticationPrincipal MemberDTO memberDTO) {

		// 토큰에서 사용자 ID를 추출하여 DTO에 설정
		String userId = memberDTO.getUserId();
		reviewDTO.setUserId(userId);

		log.info("received files: {}", files);
		List<String> uploadFileNames = fileUtil.saveFiles(files);
		reviewDTO.setUploadFileNames(uploadFileNames);

		Long reviewId = service.register(reviewDTO);
		return Map.of("result", reviewId);

	}

	@GetMapping("/view/{fileName}")
	public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
		return fileUtil.getFile(fileName);
	}

	@GetMapping("/{reviewId}")
	public ReviewDTO get(@PathVariable("reviewId") Long id) {
	    return service.get(id);
	}

	@GetMapping("/list")
	public PageResponseDTO<ReviewDTO> list(@RequestParam Long pno, PageRequestDTO pageRequestDTO) {
		log.info("list............." + pageRequestDTO);

		return service.list(pno, pageRequestDTO);
	}

	@DeleteMapping("/{reviewId}")
	public void delete(@PathVariable("reviewId") Long id) {
		service.remove(id);
	}

}
