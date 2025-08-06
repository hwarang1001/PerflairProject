package com.kh.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RootConfig {
	@Bean
	public ModelMapper getMapper() {
		ModelMapper modelMapper = new ModelMapper();
		// 1. 두개 클래스에서 필드이름이 같으면 매칭
		// 2. 접근제어자 private 매칭
		// 3. 접근 전략 글자 완전히 같지 않아도 매칭시킨다
		modelMapper.getConfiguration().setFieldMatchingEnabled(true)
				.setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
				.setMatchingStrategy(MatchingStrategies.LOOSE);
		return modelMapper;
	}
}
