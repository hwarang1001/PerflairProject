package com.kh.service;

import com.kh.dto.AddressDTO;
import java.util.List;

public interface AddressService {
	List<AddressDTO> listMine(String userId);

	AddressDTO add(String userId, AddressDTO dto);

	AddressDTO modify(String userId, Long id, AddressDTO dto);

	void remove(String userId, Long id);

	void setDefault(String userId, Long id);
}
