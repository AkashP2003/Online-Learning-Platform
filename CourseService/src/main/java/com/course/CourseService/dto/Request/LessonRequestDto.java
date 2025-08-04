package com.course.CourseService.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonRequestDto {
    private String title;
    private String videoUrl;
    private int durationInSeconds;
}
