package com.kh.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class PaymentRequestDTO {
    private String userId;

    private List<Long> cinoList;

    private String payMethod;

    private Long shippingAddressId;
}