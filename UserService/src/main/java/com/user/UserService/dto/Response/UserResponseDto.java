package com.user.UserService.dto.Response;

import com.user.UserService.enums.Role;
import com.user.UserService.dto.EnrollmentDto;
import com.user.UserService.dto.PaymentDto;
import com.user.UserService.dto.WalletDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private int userId;
    private String username;
    private String email;
    private WalletDto walletBalanace;
    private String password;
    private Role role;
    private LocalDateTime createdAt;
    private boolean active;
    private List<EnrollmentDto> enrollments = new ArrayList<>();
    private List<PaymentDto> payments = new ArrayList<>();

}
