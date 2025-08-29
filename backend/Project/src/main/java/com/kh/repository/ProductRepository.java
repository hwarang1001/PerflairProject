package com.kh.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	@EntityGraph(attributePaths = { "imageList", "options" })
	@Query("select p from Product p where p.pno = :pno")
	Optional<Product> selectOne(@Param("pno") Long pno);

	// @Modifying 어노테이션은 @Query가 SELECT가 아닌 DML(UPDATE, DELETE 등)일 때 필요함.
	@Modifying
	@Query("update Product p set p.delFlag = :flag where p.pno = :pno")
	void updateToDelete(@Param("pno") Long pno, @Param("flag") boolean flag);

	// 리스트에 첫번째 이미지(ord=0) + 가격이 가장 낮은 옵션 출력
	@Query("select p, pi, op from Product p "
		     + "left join p.imageList pi on pi.ord = 0 "
		     + "left join p.options op "
		     + "where p.delFlag = false "
		     + "and exists ("
		     + "   select 1 from ProductOption o "
		     + "   where o.product = p and o.stock > 0"
		     + ") "
		     + "and op.price = ("
		     + "   select min(o.price) "
		     + "   from ProductOption o "
		     + "   where o.product = p and o.stock > 0"
		     + ")")
    Page<Object[]> selectList(Pageable pageable);

	
	// product 옵션으로 product 맵핑
	@EntityGraph(attributePaths = { "options" })
    @Query("select p from Product p join p.options op where op.oid = :optionId")
    Optional<Product> findByOptionId(@Param("optionId") Long optionId);
}
