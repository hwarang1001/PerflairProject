package com.kh.service;

import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ProductDTO;

public interface ProductService {

	
	public Long register(ProductDTO productDTO); 
	//update
	void modify(ProductDTO productDTO);
	//select
	public ProductDTO  get(Long pno);
	//delete
	public void remove(Long pno);
	//페이징처리 및 리스트요청
	 public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO);
}
