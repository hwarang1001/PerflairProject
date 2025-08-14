package com.kh.service;

import com.kh.dto.AnswerDTO;

public interface AnswerService {

    /** 등록 */
    Long register(AnswerDTO dto);

    /** 단건 조회(미삭제만) */
    AnswerDTO read(Long answerId);

    /** 수정(내용만) */
    void modify(Long answerId, String content);

}