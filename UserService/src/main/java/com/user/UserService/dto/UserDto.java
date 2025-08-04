package com.user.UserService.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private int userId;
    private String username;
    private String email;
    private String password;
    private String role;
    private LocalDateTime createdAt;
    private boolean active;
}
