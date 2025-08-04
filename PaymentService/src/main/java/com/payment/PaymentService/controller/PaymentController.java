package com.payment.PaymentService.controller;

import com.payment.PaymentService.dto.Request.PaymentRequestDto;
import com.payment.PaymentService.dto.Response.PaymentResponseDto;
import com.payment.PaymentService.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/")
    public ResponseEntity<PaymentResponseDto> makePayment(@RequestBody PaymentRequestDto request)
    {
        PaymentResponseDto paymentResponseDto = paymentService.makePayment(request);
        return new ResponseEntity<>(paymentResponseDto, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/payments")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByUser(@PathVariable int userId) {
        List<PaymentResponseDto> payments = paymentService.getPaymentsByUserId(userId);
        return new ResponseEntity<>(payments,HttpStatus.FOUND);
    }

    @PutMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDto> updatePayment(@PathVariable int paymentId,@RequestBody PaymentRequestDto requestDto) {
        PaymentResponseDto updatedPayment = paymentService.updatePayment(paymentId, requestDto);
        return new ResponseEntity<>(updatedPayment,HttpStatus.OK);
    }

    @DeleteMapping("/{paymentId}")
    public ResponseEntity<String> deletePayment(@PathVariable int paymentId) {
        paymentService.deletePayment(paymentId);
        return new ResponseEntity<>("Payment Deleted Successfully",HttpStatus.OK);
    }

}
