package com.user.UserService.controller;

import com.user.UserService.enums.Role;
import com.user.UserService.dto.Request.UserRequestDto;
import com.user.UserService.dto.Response.UserResponseDto;
import com.user.UserService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
//@CrossOrigin(origins = "https://7k7zdg08-3000.inc1.devtunnels.ms/")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/")
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRequestDto userRequestDto)
    {
        UserResponseDto userResponseDto = userService.createUser(userRequestDto);
        return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<UserResponseDto>> getUsers()
    {
        List<UserResponseDto> userList = userService.getUsers();
        return new ResponseEntity<>(userList,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable("id") Integer id)
    {
        UserResponseDto user = userService.getUserById(id);
        return  new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUserProfile(@PathVariable("id") Integer id, @RequestBody UserRequestDto userRequestDto)
    {
        UserResponseDto user = userService.updateUserProfile(id,userRequestDto);
        return  new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserProfile(@PathVariable("id") Integer id)
    {
        userService.deleteUserProfile(id);
        return new ResponseEntity<>("Successfully Deleted", HttpStatus.OK);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponseDto>> getUserByRole(@PathVariable("role") Role role)
    {
        List<UserResponseDto> user = userService.getUserByRole(role);
        return  new ResponseEntity<>(user, HttpStatus.OK);
    }
}
