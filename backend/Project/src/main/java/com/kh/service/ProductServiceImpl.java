package com.kh.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Product;
import com.kh.domain.ProductImage;
import com.kh.domain.ProductOption;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.ProductDTO;
import com.kh.dto.ProductOptionDTO;
import com.kh.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

	private final ProductRepository productRepository;

	@Override
	public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO) {
		log.info("getList");

		Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
				Sort.by("pno").descending());

		// Object[] = [Product, ProductImage, ProductOption]
		Page<Object[]> result = productRepository.selectList(pageable);

		// Map으로 중복 제거하며 DTO 생성
		Map<Long, ProductDTO> dtoMap = new LinkedHashMap<>();

		result.get().forEach(arr -> {
			Product product = (Product) arr[0];
			ProductImage productImage = (ProductImage) arr[1];
			ProductOption productOption = (ProductOption) arr[2];

			Long pno = product.getPno();
			ProductDTO productDTO = dtoMap.get(pno);

			if (productDTO == null) {
				productDTO = ProductDTO.builder().pno(pno).brand(product.getBrand()).pname(product.getPname())
						.pdesc(product.getPdesc()).delFlag(product.isDelFlag()).uploadFileNames(new ArrayList<>()) // 초기화
						.options(new ArrayList<>()).build();

				dtoMap.put(pno, productDTO);
			}

			// 이미지 누적
			if (productImage != null) {
				String fileName = productImage.getFileName();
				if (!productDTO.getUploadFileNames().contains(fileName)) {
					productDTO.getUploadFileNames().add(fileName);
				}
			}

			// 옵션 누적
			if (productOption != null) {
				boolean exists = productDTO.getOptions().stream()
						.anyMatch(opt -> opt.getPerfumeVol() == productOption.getPerfumeVol()
								&& opt.getPrice() == productOption.getPrice()
								&& opt.getStock() == productOption.getStock());
				if (!exists) {
					ProductOptionDTO optionDTO = ProductOptionDTO.builder().price(productOption.getPrice())
							.stock(productOption.getStock()).perfumeVol(productOption.getPerfumeVol()).build();
					productDTO.getOptions().add(optionDTO);
				}
			}
		});
		// 최종 DTO 리스트 생성
		List<ProductDTO> dtoList = new ArrayList<>(dtoMap.values());
		long totalCount = result.getTotalElements();
		return PageResponseDTO.<ProductDTO>withAll().dtoList(dtoList).totalCount(totalCount)
				.pageRequestDTO(pageRequestDTO).build();
	}

	@Override
	public Long register(ProductDTO productDTO) {
		Product product = dtoToEntity(productDTO);
		Product result = productRepository.save(product);
		return result.getPno();
	}

	private Product dtoToEntity(ProductDTO productDTO) {
		Product product = Product.builder().pno(productDTO.getPno()).brand(productDTO.getBrand())
				.pname(productDTO.getPname()).pdesc(productDTO.getPdesc()).build();
		// 업로드 처리가 끝난 파일들의 이름 리스트
		List<String> uploadFileNames = productDTO.getUploadFileNames();
		if (uploadFileNames == null) {
			return product;
		}
		uploadFileNames.stream().forEach(uploadName -> {
			product.addImageString(uploadName);
		});

		// 옵션 처리
		if (productDTO.getOptions() != null) {
			productDTO.getOptions().forEach(optionDTO -> {
				ProductOption option = ProductOption.builder().price(optionDTO.getPrice()).stock(optionDTO.getStock())
						.perfumeVol(optionDTO.getPerfumeVol()).product(product) // 연관관계 설정
						.build();
				product.getOptions().add(option);
			});
		}

		return product;
	}

	@Override
	public ProductDTO get(Long pno) {
		java.util.Optional<Product> result = productRepository.selectOne(pno);
		Product product = result.orElseThrow();
		ProductDTO productDTO = entityToDTO(product);
		return productDTO;
	}

	private ProductDTO entityToDTO(Product product) {
		ProductDTO productDTO = ProductDTO.builder().pno(product.getPno()).brand(product.getBrand()).pname(product.getPname())
				.pdesc(product.getPdesc()).build();
		List<ProductImage> imageList = product.getImageList();
		if (imageList == null || imageList.size() == 0) {
			return productDTO;
		}
		List<String> fileNameList = imageList.stream().map(productImage -> productImage.getFileName()).distinct()
				.toList();
		productDTO.setUploadFileNames(fileNameList);

		// 옵션 리스트 처리
		Set<ProductOption> optionList = product.getOptions();
		if (optionList == null || optionList.isEmpty()) {
			return productDTO;
		}
		List<ProductOptionDTO> optionDTOList = optionList.stream()
				.sorted(Comparator.comparingInt(ProductOption::getPerfumeVol)) // PerfumeVol 오름차순정렬
				.map(option -> ProductOptionDTO.builder().oid(option.getOid()).price(option.getPrice()).stock(option.getStock())
						.perfumeVol(option.getPerfumeVol()).build())
				.toList();
		productDTO.setOptions(optionDTOList);

		return productDTO;
	}

	@Override
	public void modify(ProductDTO productDTO) {
		// 기존 상품 조회
		Optional<Product> result = productRepository.findById(productDTO.getPno());
		Product product = result.orElseThrow();
		product.setBrand(productDTO.getBrand());
		product.setPname(productDTO.getPname());
		product.setPdesc(productDTO.getPdesc());
		// 이미지 리스트 초기화 및 재설정
		product.clearList();
		List<String> uploadFileNames = productDTO.getUploadFileNames();
		if (uploadFileNames != null && uploadFileNames.size() > 0) {
			uploadFileNames.stream().forEach(uploadName -> {
				product.addImageString(uploadName);
			});
		}
		// 옵션 리스트 초기화 및 재설정
		product.getOptions().clear();
		if (productDTO.getOptions() != null && !productDTO.getOptions().isEmpty()) {
			productDTO.getOptions().forEach(optionDTO -> {
				ProductOption option = ProductOption.builder().price(optionDTO.getPrice()).stock(optionDTO.getStock())
						.perfumeVol(optionDTO.getPerfumeVol()).product(product) // 연관관계 설정 필수
						.build();
				product.getOptions().add(option);
			});
		}
		productRepository.save(product);
	}

	@Override
	public void remove(Long pno) {
		productRepository.updateToDelete(pno, true);
	}

}
