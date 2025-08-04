package com.course.CourseService.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonDto {
    private int moduleId;
    private String title;
    private String videoUrl;
    private int durationInSeconds;
    private int orderIndex;
}
