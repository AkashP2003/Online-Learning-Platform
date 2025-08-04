package com.payment.PaymentService.service.serviceImp;

import com.payment.PaymentService.enums.PaymentStatus;
import com.payment.PaymentService.dto.EnrollmentRequestDto;
import com.payment.PaymentService.dto.OfferDto;
import com.payment.PaymentService.dto.Request.PaymentRequestDto;
import com.payment.PaymentService.dto.Response.PaymentResponseDto;
import com.payment.PaymentService.dto.WalletRequestDto;
import com.payment.PaymentService.entity.Payment;
import com.payment.PaymentService.exception.PaymentNotFoundException;
import com.payment.PaymentService.repository.PaymentRepository;
import com.payment.PaymentService.service.PaymentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentServiceImp implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public PaymentResponseDto makePayment(PaymentRequestDto request) {

//        double discountAmount = 0;
//        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
//            try {
//                String offerUrl = "http://OFFERSERVICE/api/offers/" + request.getCouponCode();
//                OfferDto offer = restTemplate.getForObject(offerUrl, OfferDto.class);
//                if (offer != null && offer.isActive() && offer.getExpiryDate().isAfter(LocalDate.now())) {
//                    discountAmount = originalAmount * (offer.getDiscountPercentage() / 100);
//                    finalAmount = originalAmount - discountAmount;
//                }
//            } catch (Exception e) {
//                System.out.println("Failed to apply coupon: " + e.getMessage());
//            }
//        }
//        if (discountAmount > 0) {
//            try {
//                String walletUrl = "http://WALLETSERVICE/api/wallet/" + request.getUserId() + "/add";
//                WalletRequestDto walletRequestDto = new WalletRequestDto();
//                walletRequestDto.setAmount(discountAmount);
//                restTemplate.postForObject(walletUrl, walletRequestDto, Void.class);
//            } catch (Exception e) {
//                System.out.println("Failed to refund discount to wallet: " + e.getMessage());
//            }
//        }
        Payment payment = new Payment();
        payment.setUserId(request.getUserId());
        payment.setCourseId(request.getCourseId());
        payment.setAmount(request.getAmount());
        payment.setStatus(PaymentStatus.fromCustomString(String.valueOf(request.getStatus())));
        payment.setPaymentGateway(request.getPaymentGateway());
        Payment p = paymentRepository.save(payment);

        PaymentResponseDto responseDto = new PaymentResponseDto();
        responseDto.setPaymentId(p.getPaymentId());
        responseDto.setUserId(p.getUserId());
        responseDto.setCourseId(p.getCourseId());
        responseDto.setAmount(p.getAmount());
        responseDto.setPaymentGateway(p.getPaymentGateway());
        responseDto.setStatus(PaymentStatus.fromCustomString(String.valueOf(p.getStatus())));
        responseDto.setCreatedAt(p.getCreatedAt());

        EnrollmentRequestDto enrollmentRequestDto = new EnrollmentRequestDto();
        enrollmentRequestDto.setCourseId(p.getCourseId());
        enrollmentRequestDto.setUserId(p.getUserId());
        enrollmentRequestDto.setCompleted(false);
        restTemplate.postForObject("http://ENROLLMENTSERVICE/api/enrollment/enroll", enrollmentRequestDto, Void.class);
        return responseDto;
    }

    @Override
    public List<PaymentResponseDto> getPaymentsByUserId(int userId) {
        if(!paymentRepository.existsByUserId(userId))
        {
            throw new PaymentNotFoundException("Payments not found for userId : "+userId);
        }else {
            List<Payment> payments = paymentRepository.findByUserId(userId);
            List<PaymentResponseDto> responseDtos = new ArrayList<>();
            for (Payment p : payments) {
                PaymentResponseDto responseDto = new PaymentResponseDto();
                responseDto.setPaymentId(p.getPaymentId());
                responseDto.setUserId(p.getUserId());
                responseDto.setCourseId(p.getCourseId());
                responseDto.setAmount(p.getAmount());
                responseDto.setPaymentGateway(p.getPaymentGateway());
                responseDto.setStatus(PaymentStatus.fromCustomString(String.valueOf(p.getStatus())));
                responseDto.setCreatedAt(p.getCreatedAt());
                responseDtos.add(responseDto);
            }
            return responseDtos;
        }
    }

    @Override
    public PaymentResponseDto updatePayment(int paymentId, PaymentRequestDto requestDto) {
        if(!paymentRepository.existsByPaymentId(paymentId))
        {
            throw new PaymentNotFoundException("Payment Not found sor paymentID : "+paymentId);
        }
        else {
            Payment payment = paymentRepository.findByPaymentId(paymentId);
            payment.setUserId(requestDto.getUserId());
            payment.setCourseId(requestDto.getCourseId());
            payment.setAmount(requestDto.getAmount());
            payment.setStatus(requestDto.getStatus());
            payment.setPaymentGateway(requestDto.getPaymentGateway());
            Payment p = paymentRepository.save(payment);

            PaymentResponseDto responseDto = new PaymentResponseDto();
            responseDto.setPaymentId(p.getPaymentId());
            responseDto.setUserId(p.getUserId());
            responseDto.setCourseId(p.getCourseId());
            responseDto.setAmount(p.getAmount());
            responseDto.setPaymentGateway(p.getPaymentGateway());
            responseDto.setStatus(PaymentStatus.fromCustomString(String.valueOf(p.getStatus())));
            responseDto.setCreatedAt(p.getCreatedAt());
            return responseDto;
        }
    }

    @Override
    @Transactional
    public void deletePayment(int paymentId) {
        if(!paymentRepository.existsByPaymentId(paymentId))
        {
            throw new PaymentNotFoundException("Payment Not found sor paymentID : "+paymentId);
        }
        else
        {
            paymentRepository.deleteByPaymentId(paymentId);
        }
    }
}
