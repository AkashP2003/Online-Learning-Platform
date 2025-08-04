package com.course.CourseService.service;

import com.course.CourseService.dto.Request.LessonRequestDto;
import com.course.CourseService.dto.Response.LessonResponseDto;

import java.util.List;

public interface LessonService {
    LessonResponseDto createLesson(LessonRequestDto lessonRequestDto, int moduleId);

    List<LessonResponseDto> getLesson(int moduleId);

    LessonResponseDto getLessonById(int lessonId);

    LessonResponseDto updateLesson(LessonRequestDto lessonRequestDto, int lessonId);

    void deleteLesson(int lessonId);
}
