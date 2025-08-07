package com.kh.service;

import com.kh.dto.NoticeDTO;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
//import com.kh.dto.PageRequestDTO;
//import com.kh.dto.PageResponseDTO;

public interface NoticeService {
	
	
	public Long register(NoticeDTO noticeDTO);

	// update
	void modify(NoticeDTO noticeDTO);

	// select
	public NoticeDTO get(Long noticeId);

	// delete
	public void remove(Long noticeId);

	// 페이징처리 및 리스트요청
	public PageResponseDTO<NoticeDTO> list(PageRequestDTO pageRequestDTO);
}
