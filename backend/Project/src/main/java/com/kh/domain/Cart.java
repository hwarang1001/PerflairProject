package com.kh.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = {"owner", "cartItems"})
@Table(name = "tbl_cart", indexes = {@Index(name = "idx_cart_email", columnList = "user_id")})
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cno;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Member owner;

    // CartItem과 일대다 관계 설정
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CartItem> cartItems = new HashSet<>();

    // CartItem을 장바구니에 추가하는 메서드
    public void addCartItem(CartItem item) {
        item.setCart(this); // CartItem에 이 Cart를 연결
        this.cartItems.add(item);
    }

    // CartItem을 장바구니에서 제거하는 메서드
    public void removeCartItem(CartItem item) {
        this.cartItems.remove(item);
        item.setCart(null); // 관계 해제
    }
}