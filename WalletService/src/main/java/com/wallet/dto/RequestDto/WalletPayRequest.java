package com.wallet.dto.RequestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletPayRequest {
    private int userId;
    private int courseId;
    private double amount;
    private String couponCode;
}
