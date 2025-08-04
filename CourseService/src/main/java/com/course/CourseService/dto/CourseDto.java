package com.course.CourseService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
}
