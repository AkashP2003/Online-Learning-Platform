package com.course.CourseService.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModuleDto {
    private int moduleId;
    private int courseId;
    private String title;
    private int orderIndex;

}
