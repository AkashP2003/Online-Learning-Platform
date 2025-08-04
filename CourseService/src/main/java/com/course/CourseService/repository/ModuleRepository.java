package com.course.CourseService.repository;
import com.course.CourseService.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module,Integer> {
    boolean existsByCourseId(int id);
    Module findByModuleId(int id);
    List<Module> findByCourseId(int courseId);
    boolean existsByModuleId(int moduleId);
    void deleteByModuleId(int id);
}
