package com.course.CourseService.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModuleResponseDto {
    private int moduleId;
    private int courseId;
    private String title;
    private List<LessonResponseDto> lessons = new ArrayList<>();
}
