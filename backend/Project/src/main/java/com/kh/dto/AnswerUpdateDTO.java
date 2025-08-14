package com.kh.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerUpdateDTO {
    @NotBlank(message = "content는 필수입니다.")
    private String content;
}
