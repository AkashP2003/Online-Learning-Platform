package com.enrollment.EnrollmentService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressDto {
    private int progressId;
    private int enrollmentId;
    private int lessonId;
    private boolean watched;
    private LocalDateTime watchedAt;
}
