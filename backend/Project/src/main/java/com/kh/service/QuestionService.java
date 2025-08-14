package com.kh.service;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;

import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.QuestionDTO;

public interface QuestionService {

	
	Long create(String userId, QuestionDTO dto);

	QuestionDTO read(Long qid);
	
	void update(Long qid, String userId, QuestionDTO dto) throws NotFoundException;

	
	void delete(Long qid, String userId) throws NotFoundException;

	public PageResponseDTO<QuestionDTO> list(PageRequestDTO pageRequestDTO);
	
}
