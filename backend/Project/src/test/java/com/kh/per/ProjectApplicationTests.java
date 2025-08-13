package com.kh.per;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Product;
import com.kh.dto.ProductDTO;
import com.kh.dto.ProductOptionDTO;
import com.kh.repository.ProductRepository;
import com.kh.service.ProductService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
class ProjectApplicationTests {

	@Autowired
	ProductService productService;
	@Autowired
	ProductRepository productRepository;

//	 @Test
	public void testRegister() {
		ProductDTO productDTO = ProductDTO.builder().pname("향수").pdesc("향수입니다.").build();
		// 이미지 파일명 설정 (UUID 포함)
		productDTO.setUploadFileNames(
				java.util.List.of(UUID.randomUUID() + "_" + "Test1.jpg", UUID.randomUUID() + "_" + "Test2.jpg"));

		// 옵션 리스트 추가
		List<ProductOptionDTO> optionList = List.of(
				ProductOptionDTO.builder().price(5000).stock(5).perfumeVol(50).build(),
				ProductOptionDTO.builder().price(7000).stock(7).perfumeVol(70).build());
		productDTO.setOptions(optionList);

		productService.register(productDTO);
	}

//	@Test
	public void testRead() {
		Long pno = 1L;
		try {
			ProductDTO productDTO = productService.get(pno);
			log.info(productDTO);
			log.info(productDTO.getUploadFileNames());
			log.info(productDTO.getOptions()); // 옵션도 로그로 찍기
		} catch (Exception e) {
			log.error("상품 조회 실패", e);
		}
	}

	@Commit
	@Transactional
	// @Test
//	@Test
	public void testModify() {
		Long pno = 1L;

		List<String> newImages = List.of(UUID.randomUUID().toString() + "-UPDATED_IMAGE1.jpg",
				UUID.randomUUID().toString() + "-UPDATED_IMAGE2.jpg");

		List<ProductOptionDTO> newOptions = List.of(
				ProductOptionDTO.builder().price(1000).stock(50).perfumeVol(30).build(),
				ProductOptionDTO.builder().price(2000).stock(30).perfumeVol(50).build());

		ProductDTO productDTO = ProductDTO.builder().pno(pno).uploadFileNames(newImages).options(newOptions).build();

		productService.modify(productDTO);
	}

	@Commit
	@Transactional
//	@Test
	public void testDelete() {
		Long pno = 2L;
		productRepository.updateToDelete(pno, true);
	}

}
