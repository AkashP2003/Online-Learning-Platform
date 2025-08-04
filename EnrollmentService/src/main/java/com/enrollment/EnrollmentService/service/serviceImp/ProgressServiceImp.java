package com.enrollment.EnrollmentService.service.serviceImp;

import com.enrollment.EnrollmentService.dto.Request.ProgressRequestDto;
import com.enrollment.EnrollmentService.dto.Response.ProgressResponseDto;
import com.enrollment.EnrollmentService.entity.Progress;
import com.enrollment.EnrollmentService.exception.ProgressNotFoundException;
import com.enrollment.EnrollmentService.repository.ProgressRepository;
import com.enrollment.EnrollmentService.service.ProgressService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.ArrayList;
import java.util.List;
@Service
public class ProgressServiceImp implements ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Override
    public List<ProgressResponseDto> getProgressOfEnrollment(int enrollmentId) {
        List<Progress> progresses = progressRepository.findAllByEnrollmentId(enrollmentId);
        List<ProgressResponseDto> responseDtos = new ArrayList<>();
        for(Progress p : progresses)
        {
            ProgressResponseDto responseDto = new ProgressResponseDto();
            responseDto.setProgressId(p.getProgressId());
            responseDto.setEnrollmentId(p.getEnrollmentId());
            responseDto.setLessonId(p.getLessonId());
            responseDto.setWatched(p.isWatched());
            responseDtos.add(responseDto);
        }
        return responseDtos;
    }

    @Override
    public ProgressResponseDto addProgress(ProgressRequestDto request) {
        Progress progress = new Progress();
        progress.setEnrollmentId(request.getEnrollmentId());
        progress.setLessonId(request.getLessonId());
        progress.setWatched(request.isWatched());
        Progress p = progressRepository.save(progress);

        ProgressResponseDto responseDto = new ProgressResponseDto();
        responseDto.setProgressId(p.getProgressId());
        responseDto.setEnrollmentId(p.getEnrollmentId());
        responseDto.setLessonId(p.getLessonId());
        responseDto.setWatched(p.isWatched());
        return responseDto;
    }

    @Override
    public ProgressResponseDto updateProgress(ProgressRequestDto request, int progressId) {
        if(!progressRepository.existsByProgressId(progressId))
        {
            throw new ProgressNotFoundException("Progress with this id is not in database");
        }
        else{
            Progress progress = progressRepository.findByProgressId(progressId);
            progress.setEnrollmentId(request.getEnrollmentId());
            progress.setLessonId(request.getLessonId());
            progress.setWatched(request.isWatched());
            Progress p = progressRepository.save(progress);

            ProgressResponseDto responseDto = new ProgressResponseDto();
            responseDto.setProgressId(p.getProgressId());
            responseDto.setEnrollmentId(p.getEnrollmentId());
            responseDto.setLessonId(p.getLessonId());
            responseDto.setWatched(p.isWatched());
            return responseDto;
        }

    }

    @Override
    @Transactional
    public void deleteProgress(int progressId) {
        if(!progressRepository.existsByProgressId(progressId))
        {
            throw new ProgressNotFoundException("Progress with this id is not in database");
        }
        progressRepository.deleteByProgressId(progressId);
    }
}
