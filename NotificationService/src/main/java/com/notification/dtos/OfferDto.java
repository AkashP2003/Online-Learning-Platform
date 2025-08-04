package com.notification.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfferDto {
    private int id;
    private String code;
    private double discountPercentage;
    private boolean active;
    private LocalDate expiryDate;
}
