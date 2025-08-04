package com.enrollment.EnrollmentService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModuleDto {
    private int moduleId;
    private int courseId;
    private String title;
    private List<LessonDto> lessons = new ArrayList<>();
}
