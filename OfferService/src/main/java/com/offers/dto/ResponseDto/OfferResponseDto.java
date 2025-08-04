package com.offers.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfferResponseDto {
    private int id;
    private String code;
    private double discountPercentage;
    private boolean active;
    private LocalDate expiryDate;
}
