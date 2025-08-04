package com.user.UserService.repository;

import com.user.UserService.enums.Role;
import com.user.UserService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Integer> {
    User findByUserId(int id);
    boolean existsByUserId(int userId);
    void deleteByUserId(int userId);
    List<User> findByRole(Role role);
}
