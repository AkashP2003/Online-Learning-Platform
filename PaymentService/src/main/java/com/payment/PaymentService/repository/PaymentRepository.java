package com.payment.PaymentService.repository;

import com.payment.PaymentService.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment,Integer> {
    List<Payment> findByUserId(int id);
    boolean existsByUserId(int id);
    Payment findByPaymentId(int id);
    boolean existsByPaymentId(int id);
    void deleteByPaymentId(int id);
}

