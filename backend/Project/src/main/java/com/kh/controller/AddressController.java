package com.kh.controller;

import com.kh.dto.AddressDTO;
import com.kh.dto.MemberDTO;
import com.kh.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/address")
public class AddressController {

	private final AddressService addressService;

	@GetMapping("/me")
	public List<AddressDTO> myAddresses(@AuthenticationPrincipal MemberDTO me) {
		return addressService.listMine(me.getUserId());
	}

	@PostMapping
	public AddressDTO add(@AuthenticationPrincipal MemberDTO me, @RequestBody AddressDTO dto) {
		return addressService.add(me.getUserId(), dto);
	}

	@PutMapping("/{id}")
	public AddressDTO modify(@AuthenticationPrincipal MemberDTO me, @PathVariable Long id,
			@RequestBody AddressDTO dto) {
		return addressService.modify(me.getUserId(), id, dto);
	}

	@DeleteMapping("/{id}")
	public Map<String, String> remove(@AuthenticationPrincipal MemberDTO me, @PathVariable Long id) {
		addressService.remove(me.getUserId(), id);
		return Map.of("result", "SUCCESS");
	}

	@PutMapping("/{id}/default")
	public Map<String, String> setDefault(@AuthenticationPrincipal MemberDTO me, @PathVariable Long id) {
		addressService.setDefault(me.getUserId(), id);
		return Map.of("result", "SUCCESS");
	}
}
