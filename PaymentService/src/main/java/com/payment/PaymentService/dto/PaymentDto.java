package com.payment.PaymentService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto {
    private int paymentId;
    private int userId;
    private int courseId;
    private Double amount;
    private String status;
    private String paymentGateway;
    private LocalDateTime createdAt;
}
