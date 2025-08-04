package com.course.CourseService.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequestDto {
    private int instructorId;
    private String title;
    private String description;
    private String category;
    private Double price;
    private boolean published;
}
