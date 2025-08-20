package com.kh.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.domain.Answer;
import com.kh.domain.Member;
import com.kh.domain.Question;
import com.kh.dto.AnswerDTO;
import com.kh.repository.AnswerRepository;
import com.kh.repository.MemberRepository;
import com.kh.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AnswerServiceImpl implements AnswerService {

	private final AnswerRepository answerRepository;
	private final MemberRepository memberRepository;
	private final QuestionRepository questionRepository;

	/**
	 * Entity to DTO
	 */
	private AnswerDTO toDTO(Answer a) {
		return AnswerDTO.builder().answerId(a.getAnswerId()).questionId(a.getQuestionId().getQuestionId())
				.userId(a.getAdmin().getUserId()).adminName(a.getAdmin().getName()).content(a.getContent())
				.createdAt(a.getCreatedAt()).updatedAt(a.getUpdatedAt()).build();
	}

	/** 등록 */
	public Long register(AnswerDTO dto) {
		Member admin = memberRepository.findById(dto.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("관리자 계정이 존재하지 않습니다."));
		Question question = questionRepository.findById(dto.getQuestionId())
				.orElseThrow(() -> new IllegalArgumentException("질문을 찾을 수 없습니다."));

		Answer answer = Answer.builder().questionId(question) // 연관세팅
				.admin(admin) // 연관세팅
				.content(dto.getContent()).build();

		return answerRepository.save(answer).getAnswerId();
	}

	/** 단건 조회(미삭제만) */
	@Transactional(readOnly = true)
	public AnswerDTO read(Long answerId) {
		Answer answer = answerRepository.findByAnswerId(answerId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 삭제된 답변입니다."));
		return toDTO(answer);
	}

	/** 수정(내용만) */
	public void modify(Long answerId, String content) {
		Answer answer = answerRepository.findByAnswerId(answerId)
				.orElseThrow(() -> new IllegalArgumentException("답변을 찾을 수 없습니다."));
		answer.changeContent(content); // 엔티티 내부에서 updatedAt 갱신
	}

	@Transactional(readOnly = true)
	public Optional<AnswerDTO> readByQuestionId(Long questionId) {
		return answerRepository.findByQuestionId_QuestionId(questionId).map(this::toDTO);
	}

}
