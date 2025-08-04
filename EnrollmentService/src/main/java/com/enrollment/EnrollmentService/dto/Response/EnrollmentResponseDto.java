package com.enrollment.EnrollmentService.dto.Response;

import com.enrollment.EnrollmentService.dto.CourseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentResponseDto {
    private int enrollmentId;
    private int userId;
    private int courseId;
    private List<CourseDto> courseDetails = new ArrayList<>();
    private LocalDateTime enrolledAt;
    private boolean completed;
    private List<ProgressResponseDto> progress = new ArrayList<>();
}
