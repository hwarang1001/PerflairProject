package com.kh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.domain.Question;
import com.kh.domain.QuestionStatus;

public interface QuestionRepository extends JpaRepository<Question, Long> {

	
	 List<Question> findAllByStatusNot(QuestionStatus status);
}
