package com.course.CourseService.repository;

import com.course.CourseService.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CourseRepository extends JpaRepository<Course,Integer> {
    Course findByCourseId(int id);
    boolean existsByCourseId(int id);
    void deleteByCourseId(int id);
    boolean existsByInstructorId(int id);
    List<Course> findByInstructorId(int id);
}
