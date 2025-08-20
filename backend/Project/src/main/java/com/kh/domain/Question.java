package com.kh.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

/** QUESTION 테이블 – 요구된 컬럼만 사용 */
@Entity
@Table(name = "tbl_question")
@Data
public class Question {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "QUESTION_ID")
	private Long questionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = false)
	private Member userId;

	@Column(name = "TITLE", nullable = false, length = 200)
	private String title;

	
	@Column(name = "CONTENT", nullable = false)
	private String content;

	@CreationTimestamp
	@Column(name = "CREATED_AT", updatable = false)
	private LocalDateTime createdAt;

	// 💡 ENUM 타입을 사용하도록 필드 수정
	@Enumerated(EnumType.STRING) // 💡 데이터베이스에 문자열로 저장
	private QuestionStatus status;

}
