package com.kh.controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ProductDTO;
import com.kh.service.ProductService;
import com.kh.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/product")
public class ProductController {

	private final ProductService productService;
	private final CustomFileUtil fileUtil;

	@PostMapping("/")
	// multipart/form-data 요청에서 JSON(또는 다른 미디어 타입) 파트를 객체로 변환해서 받음
	public Map<String, Long> register(@RequestPart("productDTO") ProductDTO productDTO,
			@RequestPart("files") List<MultipartFile> files) {

		log.info("Received productDTO: {}", productDTO);
		log.info("Received files: {}", files);

		// 파일 저장
		List<String> uploadFileNames = fileUtil.saveFiles(files);
		productDTO.setUploadFileNames(uploadFileNames);

		// 상품 등록
		Long pno = productService.register(productDTO);

		return Map.of("result", pno);
	}

	@GetMapping("/view/{fileName}")
	public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
		return fileUtil.getFile(fileName);
	}

	// 일반 사용자가 볼 수 있는 상품 리스트
    @GetMapping("/list")
    public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO) {
        log.info("list............." + pageRequestDTO);
        return productService.list(pageRequestDTO);
    }

    // 관리자만 접근할 수 있는 상품 관리 리스트
    @GetMapping("/admin/list")
    public PageResponseDTO<ProductDTO> adminList(PageRequestDTO pageRequestDTO) {
        log.info("admin list............." + pageRequestDTO);
        return productService.list(pageRequestDTO);
    }
    
	@GetMapping("/read/{pno}")
	public ProductDTO read(@PathVariable(name = "pno") Long pno) {
		return productService.get(pno);
	}

	@PutMapping("/{pno}")
	public Map<String, String> modify(@PathVariable Long pno, @RequestPart("productDTO") ProductDTO productDTO,
			@RequestPart(value = "files", required = false) List<MultipartFile> files) {
		productDTO.setPno(pno);
		ProductDTO oldProductDTO = productService.get(pno);
		List<String> oldFileNames = oldProductDTO.getUploadFileNames(); // 기존 파일
		List<String> currentUploadFileNames = fileUtil.saveFiles(files); // 새 업로드된 파일들
		List<String> uploadedFileNames = productDTO.getUploadFileNames(); // 유지된 파일들 (클라이언트에서 전달됨)
		if (currentUploadFileNames != null && !currentUploadFileNames.isEmpty()) {
			uploadedFileNames.addAll(currentUploadFileNames); // 유지 + 신규 업로드된 파일 합치기
		}
		productDTO.setUploadFileNames(uploadedFileNames); // 최종 저장할 파일 목록으로 설정
		// 실제 DB 수정
		productService.modify(productDTO);
		// 삭제할 파일 식별
		List<String> removeFiles = oldFileNames.stream().filter(name -> !uploadedFileNames.contains(name)).toList();
		fileUtil.deleteFiles(removeFiles); // 삭제

		return Map.of("RESULT", "SUCCESS");
	}

	@DeleteMapping("/{pno}")
	public Map<String, String> remove(@PathVariable("pno") Long pno) {
		// 삭제해야 할 파일들 알아내기
		List<String> oldFileNames = productService.get(pno).getUploadFileNames();
		productService.remove(pno);
		fileUtil.deleteFiles(oldFileNames);
		return Map.of("RESULT", "SUCCESS");
	}
}
