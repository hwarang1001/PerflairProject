package com.kh.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.domain.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

	// 단건: 미삭제만
	
	
	
	
	Optional<Answer> findByAnswerId(Long answerId);

	Optional<Answer> findByQuestionId_QuestionId(Long questionId);

}
