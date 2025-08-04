package com.enrollment.EnrollmentService.repository;

import com.enrollment.EnrollmentService.entity.Enrollement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollement, Integer> {
    List<Enrollement> findAllByUserId(int id);
    List<Enrollement> findAllByCourseId(int id);
    Enrollement findByEnrollmentId(int id);
    boolean existsByEnrollmentId(int id);
    void deleteByEnrollmentId(int id);
    int countByCourseId(int courseId);
}
