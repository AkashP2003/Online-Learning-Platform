package com.payment.PaymentService.enums;

public enum PaymentStatus {
    PENDING, SUCCESS, FAILED;

    public static PaymentStatus fromCustomString(String status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        return switch (status.toLowerCase()) {
            case "pending" -> PENDING;
            case "success" -> SUCCESS;
            case "failed" -> FAILED;
            default -> throw new IllegalArgumentException("Invalid payment status: " + status);
        };
    }
}
