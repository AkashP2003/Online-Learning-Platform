package com.user.UserService.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDto {
    private int courseId;
    private int instructorId;
    private String title;
    private String description;
    private String category;
    private Double price;
    private boolean published;
    private LocalDateTime createdAt;
    private List<ModuleDto> modules = new ArrayList<>();
}
