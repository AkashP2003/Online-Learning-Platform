package com.enrollment.EnrollmentService.dto.Request;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressRequestDto {
    private int enrollmentId;
    private int lessonId;
    private boolean watched;
}
