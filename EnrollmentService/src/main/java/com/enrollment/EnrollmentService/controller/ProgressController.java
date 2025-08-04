package com.enrollment.EnrollmentService.controller;

import com.enrollment.EnrollmentService.dto.Request.ProgressRequestDto;
import com.enrollment.EnrollmentService.dto.Response.ProgressResponseDto;
import com.enrollment.EnrollmentService.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping("/enrollments/{enrollmentId}/progress")
    public ResponseEntity<List<ProgressResponseDto>> getProgressByEnrollment(@PathVariable int enrollmentId)
    {
        List<ProgressResponseDto> progressResponseDtoList = progressService.getProgressOfEnrollment(enrollmentId);
        return new ResponseEntity<>(progressResponseDtoList, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<ProgressResponseDto> addProgress(@RequestBody ProgressRequestDto request)
    {
       ProgressResponseDto progressResponseDto = progressService.addProgress(request);
       return new ResponseEntity<>(progressResponseDto,HttpStatus.OK);
    }

    @PutMapping("/{progressId}")
    public ResponseEntity<ProgressResponseDto> updateProgress(@PathVariable int progressId, @RequestBody ProgressRequestDto request)
    {
        ProgressResponseDto progressResponseDto = progressService.updateProgress(request,progressId);
        return new ResponseEntity<>(progressResponseDto,HttpStatus.OK);
    }

    @DeleteMapping("/{progressId}")
    public ResponseEntity<String> deleteProgress(@PathVariable int progressId)
    {
        progressService.deleteProgress(progressId);
        return new ResponseEntity<>("Progress Deleted Successfully",HttpStatus.OK);
    }

}
