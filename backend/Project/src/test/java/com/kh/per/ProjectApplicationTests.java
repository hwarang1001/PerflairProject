package com.kh.per;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Product;
import com.kh.dto.ProductDTO;
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
	
	//@Test 
	public void testRegister() { 
	ProductDTO productDTO = ProductDTO.builder() 
	.pname("향수") 
	.price(10000)
	.perfumeVol(100)
	.stock(10)
	.build(); 
	// uuid가 있어야함 
	productDTO.setUploadFileNames( 
	java.util.List.of(UUID.randomUUID() + "_" + "Test1.jpg", UUID.randomUUID() 
	+ "_" + "Test2.jpg")); 
	productService.register(productDTO); 
	}
	//@Test 
	public void testRead() { 
	// 실제 존재하는 번호로 테스트(DB에서 확인) 
	Long pno = 1L; 
	ProductDTO productDTO = productService.get(pno); 
	log.info(productDTO);  
	log.info(productDTO.getUploadFileNames()); 
	} 
	//@Test 
	public void testUpdate() {  
	Long pno = 1L; 
	Product product = productRepository.selectOne(pno).get(); 
	product.changePrice(15000); 
	product.changeStock(15); 
	// 첨부파일 수정 
	product.clearList(); 
	 
	product.addImageString(UUID.randomUUID().toString() + "-" + "NEWIMAGE1.jpg"); 
	product.addImageString(UUID.randomUUID().toString() + "-" + "NEWIMAGE2.jpg"); 
	product.addImageString(UUID.randomUUID().toString() + "-" + "NEWIMAGE3.jpg"); 
	 
	productRepository.save(product); 
	}
	@Commit 
	@Transactional 
	@Test 
	public void testDelete() {
		Long pno = 2L;
		productRepository.updateToDelete(pno, true);
	}

}
