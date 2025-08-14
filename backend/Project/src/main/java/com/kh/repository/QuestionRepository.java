package com.kh.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.domain.Question;
import com.kh.domain.QuestionStatus;

public interface QuestionRepository extends JpaRepository<Question, Long> {

	
	 
	@Query("SELECT q FROM Question q WHERE q.questionId = :questionId AND q.status <> :status")
	Optional<Question> findByQuestionIdAndStatusNot(
	        @Param("questionId") Long questionId,
	        @Param("status") QuestionStatus status
	);
	 
	// 삭제되지 않은(delFlag = false) 공지사항 목록을 페이징 처리하여 조회
		// JPQL을 사용하여 Notice 엔티티를 직접 조회합니다.
	 @Query("SELECT q FROM Question q WHERE q.status <> :status")
	 Page<Question> findAllNotDeleted(@Param("status") QuestionStatus status, Pageable pageable);
}
