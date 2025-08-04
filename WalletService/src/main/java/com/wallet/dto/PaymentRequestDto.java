package com.wallet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDto {
    private int userId;
    private int courseId;
    private Double amount;
    private String status;         // "SUCCESS"
    private String paymentGateway;
    private String couponCode;
}
