package com.kh.controller.advice;

import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.kh.util.CustomJWTException;

@RestControllerAdvice
public class CustomControllerAdvice {
	// 없는 데이터를 요청했을 때
	@ExceptionHandler(NoSuchElementException.class)
	protected ResponseEntity<?> notExist(NoSuchElementException e) {
		String msg = e.getMessage();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", msg));
	}

	// 폼 양식에 맞지 않는 데이터를 전송했을 때
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<?> handleIllegalArgumentException(MethodArgumentNotValidException e) {
		String msg = e.getMessage();
		return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("msg", msg));
	}

	@ExceptionHandler(CustomJWTException.class)
	protected ResponseEntity<?> handleJWTException(CustomJWTException e) {
		String msg = e.getMessage();
		return ResponseEntity.ok().body(Map.of("error", msg));
	}
}
