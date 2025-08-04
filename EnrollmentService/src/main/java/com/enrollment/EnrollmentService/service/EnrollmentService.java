package com.enrollment.EnrollmentService.service;

import com.enrollment.EnrollmentService.dto.Request.EnrollmentRequestDto;
import com.enrollment.EnrollmentService.dto.Response.EnrollmentResponseDto;

import java.util.List;


public interface EnrollmentService {
    EnrollmentResponseDto addEnroll(EnrollmentRequestDto enrollmentRequestDto);

    List<EnrollmentResponseDto> getEnrollmentsByUserId(int userId);

    List<EnrollmentResponseDto> getEnrollmentsByCourseId(int courseId);

    EnrollmentResponseDto updateEnrollments(int enrollmentId, EnrollmentRequestDto enrollmentRequestDto);

    void deleteEnrollments(int enrollmentId);

    int countCourseById(int courseId);
}
