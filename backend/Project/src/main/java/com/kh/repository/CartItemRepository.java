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
			        ci.cino, ci.qty, p.pno, p.pname, p.price, pi.fileName
			    )
			    FROM CartItem ci
			    JOIN ci.cart mc
			    JOIN ci.product p
			    LEFT JOIN p.imageList pi
			    WHERE mc.owner.userId = :userId AND pi.ord = 0
			    ORDER BY ci.cino DESC
			""")
	public List<CartItemListDTO> getItemsOfCartDTOByEmail(@Param("userId") String userId);

	@Query("select" + " ci " + " from " + " CartItem ci inner join Cart c on ci.cart = c " + " where "
			+ "c.owner.userId=:userId and ci.product.pno=:pno")
	public CartItem getItemOfPno(@Param("userId") String userId, @Param("pno") Long pno);

	@Query("select " + " c.cno " + "from " + " Cart c inner join CartItem ci on ci.cart = c " + " where "
			+ " ci.cino=:cino")
	public Long getCartFromItem(@Param("cino") Long cino);

	@Query("""
			    select new com.kh.dto.CartItemListDTO(
			        ci.cino,
			        ci.qty,
			        p.pno,
			        p.pname,
			        p.price,
			        pi.fileName
			    )
			    from CartItem ci
			    join ci.cart mc
			    join ci.product p
			    left join p.imageList pi
			    where mc.cno = :cno
			      and pi.ord = 0
			    order by ci.cino desc
			""")
	List<CartItemListDTO> getItemsOfCartDTOByCart(@Param("cno") Long cno);

	@Query("SELECT SUM(ci.qty * p.price) " + "FROM CartItem ci " + "JOIN ci.product p " + "JOIN ci.cart c " + // CartItem에서
																												// Cart로
																												// 조인
			"JOIN c.owner u " + // Cart에서 User로 조인
			"WHERE u.userId = :userId " + "AND ci.cino IN :cartItemIds")
	Long getSelectedCartTotalPrice(@Param("userId") String userId, @Param("cartItemIds") List<Long> cartItemIds);

	List<CartItem> findByCart(Cart cart);
}
