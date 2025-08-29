package com.kh.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.kh.repository.MemberRepository;
import com.kh.security.filter.JWTCheckFilter;
import com.kh.security.handler.APILoginSuccessHandler;
import com.kh.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@RequiredArgsConstructor
@EnableWebSecurity 
@EnableMethodSecurity
public class CustomSecurityConfig {

	private final MemberRepository memberRepository;

	@Bean
	public JWTUtil jwtUtil() {
		return new JWTUtil();
	}

	@Bean
	public JWTCheckFilter jwtCheckFilter(JWTUtil jwtUtill) {
		// new 키워드를 사용해 직접 객체를 생성하여 반환합니다.
		// 이때, 의존성 주입이 필요한 MemberRepository를 파라미터로 넘겨줍니다.
		return new JWTCheckFilter(memberRepository, jwtUtill);
	}

	@Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JWTCheckFilter jwtCheckFilter) throws Exception {
        log.info("-------------------- security config ---------------------------------------");

        http.csrf(config -> config.disable())
                .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(config -> config.configurationSource(corsConfigurationSource()))
                // 💡 formLogin() 설정을 유지하고, 성공/실패 핸들러를 지정합니다.
                .formLogin(config -> {
                    config.loginPage("/api/member/login");
                    config.successHandler(new APILoginSuccessHandler());
                }).authorizeHttpRequests(config -> {
                    // 모든 사용자에게 허용되는 경로
                    config.requestMatchers("/api/product/view/**","/api/member/login","/api/member/signup",
                    		"/api/reviews/**","/api/product/read/{pno}","/api/product/list","/api/notice/**",
                    		"/api/member/check-id", "/api/member/find-id", "/api/member/password-reset/**"
                    		).permitAll();

                    // 인증된 사용자만 접근 가능한 경로(장바구니, 결제, 내정보, 질의응답)
                    config.requestMatchers("/api/cart/", "/api/payment/**", "/api/member/me", "/api/qna/").authenticated();

                    // 관리자 역할만 접근 가능한 경로(상품관리 목록, 추가, 삭제, 수정)
                    config.requestMatchers("/api/product/admin/list","/api/product/**").hasRole("ADMIN");

                    // 그 외 모든 요청은 인증 필요
                    config.anyRequest().authenticated();
                })
                // JWTCheckFilter를 UsernamePasswordAuthenticationFilter 이전에 추가
                .addFilterBefore(jwtCheckFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE"));
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache- Control", "Content-Type"));
// 자격 증명(쿠키, 인증 헤더 등)을 CORS 요청과 함께 보낼 수 있도록 허용
		configuration.setAllowCredentials(true);
// URL 패턴에 따라 CORS 설정을 매핑할 수 있는 객체
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}