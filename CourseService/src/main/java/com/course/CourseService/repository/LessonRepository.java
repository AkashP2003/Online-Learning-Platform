package com.course.CourseService.repository;

import com.course.CourseService.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LessonRepository extends JpaRepository<Lesson,Integer> {
    boolean existsByModuleId(int moduleId);
    Lesson findByLessonId(int lessonId);
    List<Lesson> findByModuleId(int id);
    boolean existsByLessonId(int id);
    void deleteByLessonId(int id);
}
