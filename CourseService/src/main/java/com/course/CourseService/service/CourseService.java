package com.course.CourseService.service;

import com.course.CourseService.dto.CourseDto;
import com.course.CourseService.dto.Request.CourseRequestDto;
import com.course.CourseService.dto.Response.CourseResponseDto;
import com.course.CourseService.entity.Course;

import java.util.List;

public interface CourseService {
    CourseResponseDto createCourse(CourseRequestDto courseRequestDto);

    List<CourseResponseDto> getCourse();

    CourseResponseDto getCourseById(int id);

    CourseResponseDto updateCourse(CourseRequestDto requestDto, int id);

    void deleteCourse(int id);

    List<CourseResponseDto> getCourseByInstructor(int instructorId);
}
