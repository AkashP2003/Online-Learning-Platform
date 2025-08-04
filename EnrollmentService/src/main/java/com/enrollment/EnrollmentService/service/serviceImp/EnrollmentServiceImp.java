package com.enrollment.EnrollmentService.service.serviceImp;

import com.enrollment.EnrollmentService.dto.CourseDto;
import com.enrollment.EnrollmentService.dto.Request.EnrollmentRequestDto;
import com.enrollment.EnrollmentService.dto.Response.EnrollmentResponseDto;
import com.enrollment.EnrollmentService.dto.Response.ProgressResponseDto;
import com.enrollment.EnrollmentService.entity.Enrollement;
import com.enrollment.EnrollmentService.exception.EnrollmentNotFoundException;
import com.enrollment.EnrollmentService.repository.EnrollmentRepository;
import com.enrollment.EnrollmentService.service.EnrollmentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class EnrollmentServiceImp implements EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public EnrollmentResponseDto addEnroll(EnrollmentRequestDto enrollmentRequestDto) {
        Enrollement enrollement = new Enrollement();
        enrollement.setUserId(enrollmentRequestDto.getUserId());
        enrollement.setCourseId(enrollmentRequestDto.getCourseId());
        enrollement.setCompleted(enrollmentRequestDto.isCompleted());
        Enrollement e = enrollmentRepository.save(enrollement);

        EnrollmentResponseDto ResponseDto = new EnrollmentResponseDto();
        ResponseDto.setEnrollmentId(e.getEnrollmentId());
        ResponseDto.setUserId(e.getUserId());
        ResponseDto.setCourseId(e.getCourseId());
        ResponseDto.setCompleted(e.isCompleted());
        ResponseDto.setEnrolledAt(e.getEnrolledAt());
        return ResponseDto;
    }

    @Override
    public List<EnrollmentResponseDto> getEnrollmentsByUserId(int userId) {
        List<Enrollement> enrollements = enrollmentRepository.findAllByUserId(userId);
        List<EnrollmentResponseDto> responseDtos = new ArrayList<>();
        for (Enrollement e : enrollements)
        {
            List<ProgressResponseDto> progressResponseDtos = new ArrayList<>();
            try {
                String videoServiceUrl = "http://ENROLLMENTSERVICE/api/progress/enrollments/" + e.getEnrollmentId() + "/progress";

                ResponseEntity<List<ProgressResponseDto>> response = restTemplate.exchange(
                        videoServiceUrl,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<ProgressResponseDto>>() {}
                );

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    progressResponseDtos.addAll(response.getBody());
                }
            } catch (ResourceAccessException ex) {
                System.out.println("Progress service is unreachable for enrollId " + e.getEnrollmentId() + ": " + ex.getMessage());
            } catch (Exception ex) {
                System.out.println("Error fetching progress for enrollId " + e.getEnrollmentId() + ": " + ex.getMessage());
            }

            CourseDto courseDto = null;
            try {
                String videoServiceUrl = "http://COURSESERVICE/api/course/" + e.getCourseId();

                ResponseEntity<CourseDto> response = restTemplate.getForEntity(videoServiceUrl, CourseDto.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    courseDto = response.getBody();
                }
            } catch (ResourceAccessException ex) {
                System.out.println("Course service is unreachable for courseId " + e.getCourseId() + ": " + ex.getMessage());
            } catch (Exception ex) {
                System.out.println("Error fetching course for courseId " + e.getCourseId() + ": " + ex.getMessage());
            }
            List<CourseDto> courseDtos = new ArrayList<>();
            if (courseDto != null) {
                courseDtos.add(courseDto);
            }
            EnrollmentResponseDto ResponseDto = new EnrollmentResponseDto();
            ResponseDto.setEnrollmentId(e.getEnrollmentId());
            ResponseDto.setUserId(e.getUserId());
            ResponseDto.setCourseId(e.getCourseId());
            ResponseDto.setCourseDetails(courseDtos);
            ResponseDto.setCompleted(e.isCompleted());
            ResponseDto.setEnrolledAt(e.getEnrolledAt());
            ResponseDto.setProgress(progressResponseDtos);
            responseDtos.add(ResponseDto);
        }
        return responseDtos;
    }

    @Override
    public List<EnrollmentResponseDto> getEnrollmentsByCourseId(int courseId) {
        List<Enrollement> enrollements = enrollmentRepository.findAllByCourseId(courseId);
        List<EnrollmentResponseDto> responseDtos = new ArrayList<>();
        for (Enrollement e : enrollements)
        {
            EnrollmentResponseDto ResponseDto = new EnrollmentResponseDto();
            ResponseDto.setEnrollmentId(e.getEnrollmentId());
            ResponseDto.setUserId(e.getUserId());
            ResponseDto.setCourseId(e.getCourseId());
            ResponseDto.setCompleted(e.isCompleted());
            ResponseDto.setEnrolledAt(e.getEnrolledAt());
            responseDtos.add(ResponseDto);
        }
        return responseDtos;
    }

    @Override
    public EnrollmentResponseDto updateEnrollments(int enrollmentId, EnrollmentRequestDto enrollmentRequestDto) {
        if(!enrollmentRepository.existsByEnrollmentId(enrollmentId))
        {
            throw new EnrollmentNotFoundException("This enrollment is not in the database");
        }else {
            Enrollement enrollement = enrollmentRepository.findByEnrollmentId(enrollmentId);
            enrollement.setUserId(enrollmentRequestDto.getUserId());
            enrollement.setCourseId(enrollmentRequestDto.getCourseId());
            enrollement.setCompleted(enrollmentRequestDto.isCompleted());
            Enrollement e = enrollmentRepository.save(enrollement);

            EnrollmentResponseDto ResponseDto = new EnrollmentResponseDto();
            ResponseDto.setEnrollmentId(e.getEnrollmentId());
            ResponseDto.setUserId(e.getUserId());
            ResponseDto.setCourseId(e.getCourseId());
            ResponseDto.setCompleted(e.isCompleted());
            ResponseDto.setEnrolledAt(e.getEnrolledAt());
            return ResponseDto;
        }

    }

    @Override
    @Transactional
    public void deleteEnrollments(int enrollmentId) {
        if(!enrollmentRepository.existsByEnrollmentId(enrollmentId))
        {
            throw new EnrollmentNotFoundException("This enrollment is not in the database");
        }else {
            enrollmentRepository.deleteByEnrollmentId(enrollmentId);
        }
    }

    @Override
    public int countCourseById(int courseId) {
        return enrollmentRepository.countByCourseId(courseId);
    }

}
