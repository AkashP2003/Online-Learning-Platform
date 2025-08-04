package com.payment.PaymentService.dto.Response;

import com.payment.PaymentService.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDto {
    private int paymentId;
    private int userId;
    private int courseId;
    private Double amount;
    private PaymentStatus status;
    private String paymentGateway;
    private LocalDateTime createdAt;
}
