package com.enrollment.EnrollmentService.controller;

import com.enrollment.EnrollmentService.dto.Request.EnrollmentRequestDto;
import com.enrollment.EnrollmentService.dto.Response.EnrollmentResponseDto;
import com.enrollment.EnrollmentService.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/enroll")
    public ResponseEntity<EnrollmentResponseDto> addEnroll(@RequestBody EnrollmentRequestDto enrollmentRequestDto)
    {
        EnrollmentResponseDto enrollmentResponseDto = enrollmentService.addEnroll(enrollmentRequestDto);
        return new ResponseEntity<>(enrollmentResponseDto, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/enrollments")
    public ResponseEntity<List<EnrollmentResponseDto>> getEnrollmentsByUser(@PathVariable("userId") int userId)
    {
        List<EnrollmentResponseDto> enrollmentResponseDto = enrollmentService.getEnrollmentsByUserId(userId);
        return new ResponseEntity<>(enrollmentResponseDto, HttpStatus.OK);
    }

    @GetMapping("/courses/{courseId}/enrollments")
    public ResponseEntity<List<EnrollmentResponseDto>> getEnrollmentsByCourse(@PathVariable("courseId") int courseId)
    {
        List<EnrollmentResponseDto> enrollmentResponseDto = enrollmentService.getEnrollmentsByCourseId(courseId);
        return new ResponseEntity<>(enrollmentResponseDto, HttpStatus.OK);
    }

    @PutMapping("/{enrollmentId}")
    public ResponseEntity<EnrollmentResponseDto> updateEnrollment(@PathVariable("enrollmentId") int enrollmentId, @RequestBody EnrollmentRequestDto enrollmentRequestDto)
    {
        EnrollmentResponseDto enrollmentResponseDto = enrollmentService.updateEnrollments(enrollmentId,enrollmentRequestDto);
        return new ResponseEntity<>(enrollmentResponseDto,HttpStatus.OK);
    }

    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<String> deleteEnrollment(@PathVariable("enrollmentId") int enrollmentId)
    {
        enrollmentService.deleteEnrollments(enrollmentId);
        return new ResponseEntity<>("Enrollment Deleted Successfully",HttpStatus.OK);
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Integer> getEnrollmentCount(@PathVariable int courseId) {
        int enrollments = enrollmentService.countCourseById(courseId);
        return new ResponseEntity<>(enrollments,HttpStatus.OK);
    }


}
