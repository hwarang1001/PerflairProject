package com.kh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Cart;
import com.kh.domain.CartItem;
import com.kh.dto.CartItemListDTO;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	@Query("""
			    SELECT new com.kh.dto.CartItemListDTO(
			        ci.cino,
			        ci.qty,
			        po.oid,
			        po.product.pname,
			        po.price,
			        po.perfumeVol,
			        pi.fileName
			    )
			    FROM CartItem ci
			    JOIN ci.cart c
			    JOIN ci.productOption po
			    LEFT JOIN po.product.imageList pi ON pi.ord = 0
			    WHERE c.owner.userId = :userId
			    ORDER BY ci.cino DESC
			""")
	List<CartItemListDTO> getItemsOfCartDTOByEmail(@Param("userId") String userId);

	@Query("""
			    SELECT ci
			    FROM CartItem ci
			    JOIN ci.cart c
			    JOIN ci.productOption po
			    WHERE c.owner.userId = :userId AND po.product.pno = :pno
			""")
	CartItem getItemOfPno(@Param("userId") String userId, @Param("pno") Long pno);

	@Query("SELECT c.cno FROM Cart c JOIN c.cartItems ci WHERE ci.cino = :cino")
	Long getCartFromItem(@Param("cino") Long cino);

	@Query("""
			    SELECT new com.kh.dto.CartItemListDTO(
			        ci.cino,
			        ci.qty,
			        po.product.pno,
			        po.product.pname,
			        po.price,
			        pi.fileName
			    )
			    FROM CartItem ci
			    JOIN ci.cart c
			    JOIN ci.productOption po
			    LEFT JOIN po.product.imageList pi ON pi.ord = 0
			    WHERE c.cno = :cno
			    ORDER BY ci.cino DESC
			""")
	List<CartItemListDTO> getItemsOfCartDTOByCart(@Param("cno") Long cno);

	@Query("""
			    SELECT SUM(ci.qty * po.price)
			    FROM CartItem ci
			    JOIN ci.productOption po
			    JOIN ci.cart c
			    JOIN c.owner u
			    WHERE u.userId = :userId AND ci.cino IN :cartItemIds
			""")
	Long getSelectedCartTotalPrice(@Param("userId") String userId, @Param("cartItemIds") List<Long> cartItemIds);

	List<CartItem> findByCart(Cart cart);

	
}
