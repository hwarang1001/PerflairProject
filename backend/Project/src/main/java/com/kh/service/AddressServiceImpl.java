package com.kh.service;

import com.kh.domain.Member;
import com.kh.domain.MemberAddress;
import com.kh.dto.AddressDTO;
import com.kh.repository.MemberAddressRepository;
import com.kh.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

	private final MemberAddressRepository addrRepo;
	private final MemberRepository memberRepo;

	private AddressDTO toDTO(MemberAddress a) {
		return AddressDTO.builder().id(a.getId()).receiverName(a.getReceiverName()).phone(a.getPhone())
				.zonecode(a.getZonecode()).address(a.getAddress()).detailAddress(a.getDetailAddress()).memo(a.getMemo())
				.isDefault(a.isDefault()).build();
	}

	@Override
	public List<AddressDTO> listMine(String userId) {
		// 최초 1회: 배송지 없고 회원 주소가 있으면 '기본 배송지' 자동 생성
		if (addrRepo.countByMember_UserId(userId) == 0) {
			Member m = memberRepo.findById(userId).orElseThrow();
			String signupAddress = Optional.ofNullable(m.getAddress()).orElse("").trim();
			if (!signupAddress.isEmpty()) {
				String receiver = Optional.ofNullable(m.getName()).filter(s -> !s.isBlank()).orElse("받는 분");
				String phone = Optional.ofNullable(m.getPhoneNum()).orElse("");

				MemberAddress a = MemberAddress.builder().member(m).receiverName(receiver) // ← 회원 이름 자동 채움
						.phone(phone).zonecode("") // 가입 때 없으면 빈 값
						.address(signupAddress) // 가입한 주소 그대로
						.detailAddress("") // 가입 때 없으면 빈 값
						.memo("").isDefault(true) // 기본 배송지로
						.build();
				addrRepo.save(a);
			}
		}

		return addrRepo.findAllByMember_UserIdOrderByIsDefaultDescIdDesc(userId).stream().map(this::toDTO).toList();
	}

	@Override
	public AddressDTO add(String userId, AddressDTO dto) {
		Member m = memberRepo.findById(userId).orElseThrow();
		MemberAddress a = MemberAddress.builder().member(m).receiverName(dto.getReceiverName()).phone(dto.getPhone())
				.zonecode(dto.getZonecode()).address(dto.getAddress()).detailAddress(dto.getDetailAddress())
				.memo(dto.getMemo()).isDefault(dto.isDefault()).build();
		if (dto.isDefault()) {
			addrRepo.clearDefault(userId);
		}
		return toDTO(addrRepo.save(a));
	}

	@Override
	public AddressDTO modify(String userId, Long id, AddressDTO dto) {
		MemberAddress a = addrRepo.findById(id).orElseThrow();
		if (!a.getMember().getUserId().equals(userId)) {
			throw new RuntimeException("권한 없음");
		}
		a.updateFrom(dto);
		if (dto.isDefault()) {
			addrRepo.clearDefault(userId);
			a.setDefault(true);
		}
		return toDTO(a);
	}

	@Override
	public void remove(String userId, Long id) {
		MemberAddress a = addrRepo.findById(id).orElseThrow();
		if (!a.getMember().getUserId().equals(userId)) {
			throw new RuntimeException("권한 없음");
		}
		addrRepo.delete(a);
	}

	@Override
	public void setDefault(String userId, Long id) {
		MemberAddress a = addrRepo.findById(id).orElseThrow();
		if (!a.getMember().getUserId().equals(userId)) {
			throw new RuntimeException("권한 없음");
		}
		addrRepo.clearDefault(userId);
		a.setDefault(true);
	}
}
