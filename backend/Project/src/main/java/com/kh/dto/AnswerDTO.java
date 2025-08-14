package com.kh.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Answer API 등록/조회 DTO */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {

    private Long answerId;

    /** ERD: ANSWER.QUESTION_ID */
    @NotNull(message = "questionId는 필수입니다.")
    private Long questionId;

    /** ERD: ANSWER.ADMIN_USER_ID */
    private String userId;

    /** ERD: ANSWER.CONTENT */
    @NotBlank(message = "content는 필수입니다.")
    private String content;

    // 조회 응답 편의 필드
    private String adminName;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
