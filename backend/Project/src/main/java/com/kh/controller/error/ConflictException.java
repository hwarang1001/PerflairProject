package com.kh.controller.error;

public class ConflictException extends RuntimeException {
	public ConflictException(String m) {
		super(m);
	}
}