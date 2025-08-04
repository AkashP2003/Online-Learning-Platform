package com.payment.PaymentService.service;

import com.payment.PaymentService.dto.Request.PaymentRequestDto;
import com.payment.PaymentService.dto.Response.PaymentResponseDto;

import java.util.List;

public interface PaymentService {
    PaymentResponseDto makePayment(PaymentRequestDto request);

    List<PaymentResponseDto> getPaymentsByUserId(int userId);

    PaymentResponseDto updatePayment(int paymentId, PaymentRequestDto requestDto);

    void deletePayment(int paymentId);
}
