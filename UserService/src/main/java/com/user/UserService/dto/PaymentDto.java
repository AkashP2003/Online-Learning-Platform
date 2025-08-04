package com.user.UserService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto {
//    private int userId;
    private int courseId;
    private Double amount;
    private String status; // PENDING, COMPLETED, FAILED
    private String paymentGateway; // razor pay
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
