package com.enrollment.EnrollmentService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoDto {
    private String videoId;
    private int lessonId;
    private String videoUrl;
    private LocalDateTime uploadedAt;
}
