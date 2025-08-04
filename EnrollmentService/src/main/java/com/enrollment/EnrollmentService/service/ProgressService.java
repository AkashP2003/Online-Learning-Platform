package com.enrollment.EnrollmentService.service;

import com.enrollment.EnrollmentService.dto.Request.ProgressRequestDto;
import com.enrollment.EnrollmentService.dto.Response.ProgressResponseDto;

import java.util.List;

public interface ProgressService {
    List<ProgressResponseDto> getProgressOfEnrollment(int enrollmentId);

    ProgressResponseDto addProgress(ProgressRequestDto request);

    ProgressResponseDto updateProgress(ProgressRequestDto request, int progressId);

    void deleteProgress(int progressId);
}
