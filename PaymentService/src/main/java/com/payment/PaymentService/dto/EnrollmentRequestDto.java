package com.payment.PaymentService.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentRequestDto {
    private int userId;
    private int courseId;
    private boolean completed;
}
