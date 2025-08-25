package com.kh.domain;

import com.kh.dto.AddressDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tbl_member_address")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberAddress {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// 회원
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private Member member;

	// 배송지 필드
	private String receiverName; // 받는 분
	private String phone; // 연락처
	private String zonecode; // 우편번호
	private String address; // 기본 주소(도로명/지번)
	private String detailAddress; // 상세 주소
	private String memo; // 배송 메모
	private boolean isDefault; // 기본 배송지 여부

	public void updateFrom(AddressDTO dto) {
		this.receiverName = dto.getReceiverName();
		this.phone = dto.getPhone();
		this.zonecode = dto.getZonecode();
		this.address = dto.getAddress();
		this.detailAddress = dto.getDetailAddress();
		this.memo = dto.getMemo();
	}
}
