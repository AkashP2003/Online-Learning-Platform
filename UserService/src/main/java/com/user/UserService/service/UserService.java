package com.user.UserService.service;

import com.user.UserService.enums.Role;
import com.user.UserService.dto.Request.UserRequestDto;
import com.user.UserService.dto.Response.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto createUser(UserRequestDto userRequestDto);

    List<UserResponseDto> getUsers();

    UserResponseDto getUserById(Integer id);

    UserResponseDto updateUserProfile(Integer id, UserRequestDto userDto);

    void deleteUserProfile(Integer id);

    List<UserResponseDto> getUserByRole(Role role);
}
