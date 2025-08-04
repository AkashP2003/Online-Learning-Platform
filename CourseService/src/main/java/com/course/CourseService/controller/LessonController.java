package com.course.CourseService.controller;

import com.course.CourseService.dto.Request.LessonRequestDto;
import com.course.CourseService.dto.Response.LessonResponseDto;
import com.course.CourseService.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/lesson")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @PostMapping("modules/{moduleId}/lessons")
    public ResponseEntity<LessonResponseDto> createLesson(@RequestBody LessonRequestDto lessonRequestDto, @PathVariable("moduleId") int moduleId)
    {
        LessonResponseDto lessonResponseDto = lessonService.createLesson(lessonRequestDto,moduleId);
        return new ResponseEntity<>(lessonResponseDto, HttpStatus.OK);
    }

    @GetMapping("modules/{moduleId}/lessons")
    public ResponseEntity<List<LessonResponseDto>> getLesson(@PathVariable("moduleId") int moduleId)
    {
        List<LessonResponseDto> lessonResponseDto = lessonService.getLesson(moduleId);
        return new ResponseEntity<>(lessonResponseDto,HttpStatus.OK);
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonResponseDto> getLessonById(@PathVariable("lessonId") int lessonId)
    {
        LessonResponseDto lessonResponseDto = lessonService.getLessonById(lessonId);
        return new ResponseEntity<>(lessonResponseDto,HttpStatus.OK);
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<LessonResponseDto> updateLesson(@RequestBody LessonRequestDto lessonRequestDto, @PathVariable("lessonId") int lessonId)
    {
        LessonResponseDto lessonResponseDto = lessonService.updateLesson(lessonRequestDto,lessonId);
        return new ResponseEntity<>(lessonResponseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<String> deleteLesson( @PathVariable("lessonId") int lessonId)
    {
        lessonService.deleteLesson(lessonId);
        return new ResponseEntity<>("Lesson with id "+lessonId+" Deleted Successfully ", HttpStatus.OK);
    }

}
