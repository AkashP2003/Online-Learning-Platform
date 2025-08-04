package com.enrollment.EnrollmentService.repository;

import com.enrollment.EnrollmentService.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Integer> {
    List<Progress> findAllByEnrollmentId(int id);
    Progress findByProgressId(int id);
    boolean existsByProgressId(int id);
    void deleteByProgressId(int id);
}
