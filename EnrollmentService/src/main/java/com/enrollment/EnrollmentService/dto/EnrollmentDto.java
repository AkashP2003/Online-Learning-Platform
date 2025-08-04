package com.enrollment.EnrollmentService.dto;

import com.enrollment.EnrollmentService.dto.Response.ProgressResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDto {
    private int enrollmentId;
    private int userId;
    private int courseId;
    private LocalDateTime enrolledAt;
    private boolean completed;
    private List<ProgressResponseDto> progress = new ArrayList<>();
}
