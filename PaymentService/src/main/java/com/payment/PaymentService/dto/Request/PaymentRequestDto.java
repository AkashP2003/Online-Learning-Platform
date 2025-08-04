package com.payment.PaymentService.dto.Request;

import com.payment.PaymentService.enums.PaymentStatus;
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
    private PaymentStatus status;
    private String paymentGateway;
    private String couponCode;

}
