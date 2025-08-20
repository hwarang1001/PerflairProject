package com.kh.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity  
@Builder 
@AllArgsConstructor 
@NoArgsConstructor 
@Getter 
@ToString(exclude = "userId") 
@Table(name = "tbl_cart", indexes = { @Index(name = "idx_cart_email", columnList = "user_id") })  
public class Cart {
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private Long cno; 
	 
	@OneToOne 
	@JoinColumn(name = "user_id") 
	private Member owner;

}
