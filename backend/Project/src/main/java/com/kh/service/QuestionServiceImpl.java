package com.kh.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.controller.error.ConflictException;
import com.kh.controller.error.ForbiddenException;
import com.kh.domain.Answer;
import com.kh.domain.Member;
import com.kh.domain.Question;
import com.kh.domain.QuestionStatus;
import com.kh.dto.AnswerDTO;
import com.kh.dto.PageRequestDTO;
import com.kh.dto.PageResponseDTO;
import com.kh.dto.QuestionDTO;
import com.kh.repository.AnswerRepository;
import com.kh.repository.MemberRepository;
import com.kh.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * 질문 관련 비즈니스 로직을 처리하는 서비스 클래스. Spring의 @Service 어노테이션과
 * Lombok의 @RequiredArgsConstructor를 사용합니다. 모든 메소드는 @Transactional 어노테이션으로 트랜잭션
 * 관리를 합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class QuestionServiceImpl implements QuestionService {

	private final QuestionRepository questionRepo;
	private final MemberRepository memberRepo;
	private final AnswerRepository answerRepo;

	/**
	 * 작성: 새로운 질문을 생성하고 저장합니다.
	 * 
	 * @param userId 질문을 작성하는 사용자의 ID
	 * @param dto    질문의 제목과 내용을 담고 있는 DTO
	 * @return 생성된 질문의 ID
	 */

	@Override
	public PageResponseDTO<QuestionDTO> list(PageRequestDTO pageRequestDTO) {
		log.info("getList ");

		// 페이지 번호가 1 미만일 경우 1로 보정합니다.
		int page = pageRequestDTO.getPage() <= 0 ? 0 : pageRequestDTO.getPage() - 1;

		// Pageable 객체 생성
		Pageable pageable = PageRequest.of(page, pageRequestDTO.getSize(), Sort.by("questionId").descending());

		// 데이터 조회
		Page<Question> result = questionRepo.findAllNotDeleted(QuestionStatus.DELETED, pageable);

		// Page<Notice>를 NoticeDTO 리스트로 변환
		// result.get() 대신 result.stream()을 사용해야 합니다.
		List<QuestionDTO> dtoList = result.stream().map(question -> {
			QuestionDTO questionDTO = QuestionDTO.builder().questionId(question.getQuestionId())
					.userId(question.getUserId().getUserId()).title(question.getTitle()).content(question.getContent())
					.createdAt(question.getCreatedAt()).status(question.getStatus()).build();
			return questionDTO;
		}).collect(Collectors.toList());

		long totalCount = result.getTotalElements();

		return PageResponseDTO.<QuestionDTO>withAll().dtoList(dtoList).totalCount(totalCount)
				.pageRequestDTO(pageRequestDTO).build();
	}

	@Override
	public Long create(String userId, QuestionDTO dto) {
		Member member = memberRepo.getReferenceById(userId);
		Question q = new Question();
		q.setUserId(member);
		q.setTitle(dto.getTitle());
		q.setContent(dto.getContent());
		q.setStatus(QuestionStatus.WAITING);

		return questionRepo.save(q).getQuestionId();
	}

	@Override
	public QuestionDTO read(Long qid) {
		Question question = questionRepo.findByQuestionIdAndStatusNot(qid, QuestionStatus.DELETED)
				.orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + qid));

		// Question → QuestionDTO 변환
		QuestionDTO qdto = QuestionDTO.builder().questionId(question.getQuestionId())
				.userId(question.getUserId().getUserId()).title(question.getTitle()).content(question.getContent())
				.createdAt(question.getCreatedAt()).status(question.getStatus()).build();

		// 답변 Optional 조회 → DTO 변환 후 끼워넣기
		answerRepo.findByQuestionId_QuestionId(qid).ifPresent(a -> qdto.setAnswer(toAnswerDTO(a)));

		return qdto;
	}

	/**
	 * 업데이트: 질문의 제목과 내용을 수정합니다. 본인의 글만, 그리고 상태가 WAITING일 때만 수정 가능합니다.
	 *
	 * @param qid    업데이트할 질문의 ID
	 * @param userId 수정 요청을 한 사용자의 ID
	 * @param dto    업데이트할 데이터가 담긴 DTO
	 * @throws NotFoundException  질문이 존재하지 않을 경우
	 * @throws ForbiddenException 사용자 ID가 일치하지 않을 경우
	 * @throws ConflictException  질문 상태가 WAITING이 아닐 경우
	 */
	@Override
	public void update(Long qid, String userId, QuestionDTO dto) throws NotFoundException {
		Question q = questionRepo.findById(qid).orElseThrow(NotFoundException::new);
		// 사용자 ID 비교
		if (!q.getUserId().getUserId().equals(userId)) {
			throw new ForbiddenException();
		}
		// 질문 상태 확인
		if (q.getStatus() != QuestionStatus.WAITING) {
			throw new ConflictException("수정할 수 없는 상태입니다.");
		}
		// 제목 및 내용 업데이트
		q.setTitle(dto.getTitle());
		q.setContent(dto.getContent());
		questionRepo.save(q); // ✅ 변경 사항을 저장
	}

	/**
	 * 삭제: 질문의 상태를 DELETED로 변경합니다. 본인의 글만 삭제 가능합니다.
	 * 
	 * @param qid    삭제할 질문의 ID
	 * @param userId 삭제 요청을 한 사용자의 ID
	 * @throws NotFoundException  질문이 존재하지 않을 경우
	 * @throws ForbiddenException 사용자 ID가 일치하지 않을 경우
	 */

	@Override
	public void delete(Long qid, String userId) throws NotFoundException {
		// 질문 로드
		Question q = questionRepo.findById(qid).orElseThrow(NotFoundException::new);

		// 로그인한 사용자 찾기
		Member member = memberRepo.findById(userId).orElseThrow();

		// 로그인한 사용자 관리자 여부
		boolean isAdmin = member.getMemberRoleList() != null
				&& member.getMemberRoleList().stream().anyMatch(r -> r.name().equals("ADMIN"));

		// 관리자와 작성한 사용자가 아니면 에러처리
		if (!q.getUserId().getUserId().equals(userId) && !isAdmin) {
			throw new ForbiddenException();
		}
		
		// 상태를 DELETED로 변경
		q.setStatus(QuestionStatus.DELETED);
	}

	private AnswerDTO toAnswerDTO(Answer a) {
		return AnswerDTO.builder().answerId(a.getAnswerId()).questionId(a.getQuestionId().getQuestionId())
				.userId(a.getAdmin().getUserId()).adminName(a.getAdmin().getName()).content(a.getContent())
				.createdAt(a.getCreatedAt()).updatedAt(a.getUpdatedAt()).build();
	}
}
