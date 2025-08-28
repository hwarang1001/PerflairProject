package com.kh.service;

import com.kh.domain.Member;
import com.kh.domain.MemberAddress;
import com.kh.dto.AddressDTO;
import com.kh.repository.MemberAddressRepository;
import com.kh.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
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
	    // 사용자의 주소 목록을 기본 배송지를 우선으로 정렬해서 조회
	    return addrRepo.findAllByMember_UserIdOrderByIsDefaultDescIdDesc(userId).stream()
	                   .map(this::toDTO)
	                   .toList();
	}

	@Override
	public AddressDTO add(String userId, AddressDTO dto) {
		addrRepo.clearDefault(userId);
		Member m = memberRepo.findById(userId).orElseThrow();		
		MemberAddress a = MemberAddress.builder().member(m).receiverName(dto.getReceiverName()).phone(dto.getPhone())
				.zonecode(dto.getZonecode()).address(dto.getAddress()).detailAddress(dto.getDetailAddress())
				.memo(dto.getMemo()).isDefault(true).build();
		
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

		addrRepo.save(a);
	}
}
