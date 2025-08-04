package com.course.CourseService.service.serviceImp;

import com.course.CourseService.dto.Request.LessonRequestDto;
import com.course.CourseService.dto.Response.LessonResponseDto;
import com.course.CourseService.dto.VideoDto;
import com.course.CourseService.entity.Lesson;
import com.course.CourseService.exception.LessonNotFoundException;
import com.course.CourseService.repository.LessonRepository;
import com.course.CourseService.service.LessonService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class LessonServiceImp implements LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public LessonResponseDto createLesson(LessonRequestDto lessonRequestDto, int moduleId) {
        Lesson lesson = new Lesson();
        lesson.setTitle(lessonRequestDto.getTitle());
        lesson.setVideoUrl(lessonRequestDto.getVideoUrl());
        lesson.setDurationInSeconds(lessonRequestDto.getDurationInSeconds());
        lesson.setModuleId(moduleId);
        Lesson l = lessonRepository.save(lesson);

        LessonResponseDto lessonResponse = new LessonResponseDto();
        lessonResponse.setLessonId(l.getLessonId());
        lessonResponse.setTitle(l.getTitle());
        lessonResponse.setVideoUrl(l.getVideoUrl());
        lessonResponse.setModuleId(l.getModuleId());
        lessonResponse.setDurationInSeconds(l.getDurationInSeconds());
        return lessonResponse;
    }

    @Override
    public List<LessonResponseDto> getLesson(int moduleId) {
        List<Lesson> lessons = lessonRepository.findByModuleId(moduleId);
        List<LessonResponseDto> lessonResponseDtos = new ArrayList<>();

        for (Lesson lesson : lessons) {
            List<VideoDto> videoResponseDtos = new ArrayList<>();
            try {
                String videoServiceUrl = "http://VIDEOSTREAMINGSERVICE/api/video/lessons/" + lesson.getLessonId() + "/video";
                ResponseEntity<VideoDto> response = restTemplate.getForEntity(videoServiceUrl, VideoDto.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    videoResponseDtos.add(response.getBody());
                }

            } catch (ResourceAccessException e) {
                System.out.println("Video service is unreachable for lessonId " + lesson.getLessonId() + ": " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error fetching video for lessonId " + lesson.getLessonId() + ": " + e.getMessage());
            }

            LessonResponseDto dto = new LessonResponseDto();
            dto.setLessonId(lesson.getLessonId());
            dto.setModuleId(lesson.getModuleId());
            dto.setTitle(lesson.getTitle());
            dto.setVideoUrl(lesson.getVideoUrl());
            dto.setDurationInSeconds(lesson.getDurationInSeconds());
            dto.setVideo(videoResponseDtos);  // set list
            lessonResponseDtos.add(dto);
        }

        return lessonResponseDtos;
    }


    @Override
    public LessonResponseDto getLessonById(int lessonId) {
        if(!lessonRepository.existsByLessonId(lessonId))
        {
            throw new LessonNotFoundException("Lesson Not fount for this lesson id "+lessonId);
        }
        else {
            Lesson lesson = lessonRepository.findByLessonId(lessonId);
            LessonResponseDto l = new LessonResponseDto();
            l.setLessonId(lesson.getLessonId());
            l.setModuleId(lesson.getModuleId());
            l.setTitle(lesson.getTitle());
            l.setVideoUrl(lesson.getVideoUrl());
            l.setDurationInSeconds(lesson.getDurationInSeconds());
            return l;
        }
    }

    @Override
    public LessonResponseDto updateLesson(LessonRequestDto lessonRequestDto, int lessonId) {
        if(!lessonRepository.existsByLessonId(lessonId))
        {
            throw new LessonNotFoundException("Lesson Not fount for this lesson id "+lessonId);
        } else {
            Lesson lessons = lessonRepository.findByLessonId(lessonId);
            lessons.setTitle(lessonRequestDto.getTitle());
            lessons.setVideoUrl(lessonRequestDto.getVideoUrl());
            lessons.setDurationInSeconds(lessonRequestDto.getDurationInSeconds());
            Lesson lesson = lessonRepository.save(lessons);
            LessonResponseDto l = new LessonResponseDto();
            l.setLessonId(lesson.getLessonId());
            l.setModuleId(lesson.getModuleId());
            l.setTitle(lesson.getTitle());
            l.setVideoUrl(lesson.getVideoUrl());
            l.setDurationInSeconds(lesson.getDurationInSeconds());
            return l;
        }
    }

    @Override
    @Transactional
    public void deleteLesson(int lessonId) {
        if(!lessonRepository.existsByLessonId(lessonId))
        {
            throw new LessonNotFoundException("Lesson with this id not found in database");
        }
        lessonRepository.deleteByLessonId(lessonId);
    }
}
