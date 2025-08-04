package com.course.CourseService.controller;

import com.course.CourseService.dto.CourseDto;
import com.course.CourseService.dto.Request.CourseRequestDto;
import com.course.CourseService.dto.Response.CourseResponseDto;
import com.course.CourseService.entity.Course;
import com.course.CourseService.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/course")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @PostMapping("/")
    public ResponseEntity<CourseResponseDto> createCourse(@RequestBody CourseRequestDto courseRequestDto)
    {
        CourseResponseDto course = courseService.createCourse(courseRequestDto);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<CourseResponseDto>> getCourse()
    {
        List<CourseResponseDto> courses = courseService.getCourse();
        return new ResponseEntity<>(courses,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDto> getCourseById(@PathVariable("id") int id)
    {
        CourseResponseDto courseResponseDto = courseService.getCourseById(id);
        return new ResponseEntity<>(courseResponseDto,HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponseDto> updateCourse(@RequestBody CourseRequestDto requestDto, @PathVariable("id") int id)
    {
        CourseResponseDto courseResponseDto = courseService.updateCourse(requestDto,id);
        return new ResponseEntity<>(courseResponseDto,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable("id") int id)
    {
        courseService.deleteCourse(id);
        return new ResponseEntity<>("Course Deleted Successfully",HttpStatus.OK);
    }

    @GetMapping("/instructor/{instructorId}/courses")
    public ResponseEntity<List<CourseResponseDto>> getCourseByInstructor(@PathVariable("instructorId") int instructorId)
    {
        List<CourseResponseDto> response = courseService.getCourseByInstructor(instructorId);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}
