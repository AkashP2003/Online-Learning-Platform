package com.course.CourseService.service.serviceImp;

import com.course.CourseService.dto.Request.CourseRequestDto;
import com.course.CourseService.dto.Response.CourseResponseDto;
import com.course.CourseService.dto.Response.ModuleResponseDto;
import com.course.CourseService.entity.Course;
import com.course.CourseService.exception.CourseNotFoundException;
import com.course.CourseService.repository.CourseRepository;
import com.course.CourseService.service.CourseService;
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
import java.util.stream.Collectors;

@Service
public class CourseServiceImp implements CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public CourseResponseDto createCourse(CourseRequestDto courseRequestDto) {
        Course c = new Course();
        c.setTitle(courseRequestDto.getTitle());
        c.setDescription(courseRequestDto.getDescription());
        c.setPrice(courseRequestDto.getPrice());
        c.setInstructorId(courseRequestDto.getInstructorId());
        c.setCategory(courseRequestDto.getCategory());
        c.setPublished(true);
        Course savedCourse =  courseRepository.save(c);

        CourseResponseDto course = new CourseResponseDto();
        course.setCourseId(savedCourse.getCourseId());
        course.setTitle(savedCourse.getTitle());
        course.setDescription(savedCourse.getDescription());
        course.setPrice(savedCourse.getPrice());
        course.setInstructorId(savedCourse.getInstructorId());
        course.setCategory(savedCourse.getCategory());
        course.setCreatedAt(savedCourse.getCreatedAt());
        course.setPublished(savedCourse.isPublished());
        return course;
    }

    @Override
    public List<CourseResponseDto> getCourse() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(course ->
        {
            CourseResponseDto courseResponseDto = new CourseResponseDto();
            courseResponseDto.setCourseId(course.getCourseId());
            courseResponseDto.setTitle(course.getTitle());
            courseResponseDto.setDescription(course.getDescription());
            courseResponseDto.setInstructorId(course.getInstructorId());
            courseResponseDto.setPrice(course.getPrice());
            courseResponseDto.setCategory(course.getCategory());
            courseResponseDto.setCreatedAt(course.getCreatedAt());
            courseResponseDto.setPublished(course.isPublished());
            return courseResponseDto;
        }).collect(Collectors.toList());

    }

    @Override
    public CourseResponseDto getCourseById(int id) {
        if (!courseRepository.existsByCourseId(id)) {
            throw new CourseNotFoundException("Course with id " + id + " is not found");
        }
        Course course = courseRepository.findByCourseId(id);
        int enrollmentCount = 0;
        List<ModuleResponseDto> moduleResponse = new ArrayList<>();
        try {
            String moduleServiceUrl = "http://COURSESERVICE/api/modules/courses/" + id + "/modules";

            ResponseEntity<List<ModuleResponseDto>> moduleResponseDto = restTemplate.exchange(
                    moduleServiceUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );
            moduleResponse = moduleResponseDto.getBody();
        } catch (ResourceAccessException e) {
            System.out.println("Module service is down or unreachable: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error fetching modules for courseId " + id + ": " + e.getMessage());
        }

        try {
            String enrollmentServiceUrl = "http://ENROLLMENTSERVICE/api/enrollment/course/" + id + "/count";
            ResponseEntity<Integer> enrollmentResponse = restTemplate.getForEntity(enrollmentServiceUrl, Integer.class);
            if (enrollmentResponse.getBody() != null) {
                enrollmentCount = enrollmentResponse.getBody();
            }
        } catch (ResourceAccessException e) {
            System.out.println("Enrollment service is down or unreachable: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error fetching enrollment count for courseId " + id + ": " + e.getMessage());
        }

        CourseResponseDto courseDto = new CourseResponseDto();
        courseDto.setCourseId(course.getCourseId());
        courseDto.setTitle(course.getTitle());
        courseDto.setDescription(course.getDescription());
        courseDto.setPrice(course.getPrice());
        courseDto.setInstructorId(course.getInstructorId());
        courseDto.setCategory(course.getCategory());
        courseDto.setCreatedAt(course.getCreatedAt());
        courseDto.setPublished(course.isPublished());
        courseDto.setEnrollmentCount(enrollmentCount);
        courseDto.setModules(moduleResponse);
        return courseDto;
    }

    @Override
    public CourseResponseDto updateCourse(CourseRequestDto requestDto, int id) {
        if(!courseRepository.existsByCourseId(id))
        {
            throw new CourseNotFoundException("Course with id "+id+" is not found");
        }
        Course c = courseRepository.findByCourseId(id);
        c.setTitle(requestDto.getTitle());
        c.setDescription(requestDto.getDescription());
        c.setPrice(requestDto.getPrice());
        c.setCategory(requestDto.getCategory());
        c.setPublished(true);
        Course savedCourse =  courseRepository.save(c);

        CourseResponseDto course = new CourseResponseDto();
        course.setCourseId(savedCourse.getCourseId());
        course.setTitle(savedCourse.getTitle());
        course.setDescription(savedCourse.getDescription());
        course.setPrice(savedCourse.getPrice());
        course.setCategory(savedCourse.getCategory());
        course.setCreatedAt(savedCourse.getCreatedAt());
        course.setPublished(savedCourse.isPublished());
        return course;
    }

    @Override
    @Transactional
    public void deleteCourse(int id) {
        if(!courseRepository.existsByCourseId(id))
        {
            throw new CourseNotFoundException("Course with id "+id+" is not found");
        }
        courseRepository.deleteByCourseId(id);
    }

    @Override
    public List<CourseResponseDto> getCourseByInstructor(int instructorId) {
        if(!courseRepository.existsByInstructorId(instructorId))
        {
            throw new CourseNotFoundException("Course with Instructor Id "+instructorId+" is not found");
        }
        List<Course> courses = courseRepository.findByInstructorId(instructorId);

        List<CourseResponseDto> courseResponseDtos = new ArrayList<>();
        for (Course c : courses)
        {
            int enrollmentCount = 0;
            try {
                String enrollmentServiceUrl = "http://ENROLLMENTSERVICE/api/enrollment/course/" + c.getCourseId() + "/count";
                ResponseEntity<Integer> enrollmentResponse = restTemplate.getForEntity(enrollmentServiceUrl, Integer.class);
                if (enrollmentResponse.getBody() != null) {
                    enrollmentCount = enrollmentResponse.getBody();
                }
            } catch (ResourceAccessException e) {
                System.out.println("Enrollment service is down or unreachable: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error fetching enrollment count for courseId " + c.getCourseId() + ": " + e.getMessage());
            }
            CourseResponseDto course = new CourseResponseDto();
            course.setCourseId(c.getCourseId());
            course.setTitle(c.getTitle());
            course.setDescription(c.getDescription());
            course.setPrice(c.getPrice());
            course.setInstructorId(c.getInstructorId());
            course.setCategory(c.getCategory());
            course.setCreatedAt(c.getCreatedAt());
            course.setEnrollmentCount(enrollmentCount);
            course.setPublished(c.isPublished());
            courseResponseDtos.add(course);
        }
        return courseResponseDtos;
    }
}
