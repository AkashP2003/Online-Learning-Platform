package com.vedio.VideoStreamingService.service.serviceImp;

import com.vedio.VideoStreamingService.dto.Request.VideoRequestDto;
import com.vedio.VideoStreamingService.dto.Response.VideoResponseDto;
import com.vedio.VideoStreamingService.entity.Video;
import com.vedio.VideoStreamingService.exception.VideoNotFoundException;
import com.vedio.VideoStreamingService.repository.VideoRepository;
import com.vedio.VideoStreamingService.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class VideoServiceImp implements VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Override
    public VideoResponseDto addVideo(VideoRequestDto requestDto) {
        Video video = new Video();
        video.setLessonId(requestDto.getLessonId());
        video.setVideoUrl(requestDto.getVideoUrl());
        video.setUploadedAt(LocalDateTime.now());
        Video v = videoRepository.save(video);

        VideoResponseDto responseDto = new VideoResponseDto();
        responseDto.setVideoId(v.getVideoId());
        responseDto.setLessonId(v.getLessonId());
        responseDto.setVideoUrl(v.getVideoUrl());
        responseDto.setUploadedAt(v.getUploadedAt());
        return responseDto;
    }

    @Override
    public VideoResponseDto getVideo(int lessonId) {
        if (!videoRepository.existsByLessonId(lessonId))
        {
            throw new VideoNotFoundException("Video not found for this lesson Id");
        }
        else
        {
            Video v = videoRepository.findByLessonId(lessonId);
            VideoResponseDto responseDto = new VideoResponseDto();
            responseDto.setVideoId(v.getVideoId());
            responseDto.setLessonId(v.getLessonId());
            responseDto.setVideoUrl(v.getVideoUrl());
            responseDto.setUploadedAt(v.getUploadedAt());
            return responseDto;
        }
    }

    @Override
    public VideoResponseDto updateVideo(VideoRequestDto requestDto, String videoId) {
        if (!videoRepository.existsByVideoId(videoId))
        {
            throw new VideoNotFoundException("Video not found for this Id");
        }
        else
        {
            Video video = videoRepository.findByVideoId(videoId);
            video.setLessonId(requestDto.getLessonId());
            video.setVideoUrl(requestDto.getVideoUrl());
            Video v = videoRepository.save(video);
            VideoResponseDto responseDto = new VideoResponseDto();
            responseDto.setVideoId(v.getVideoId());
            responseDto.setLessonId(v.getLessonId());
            responseDto.setVideoUrl(v.getVideoUrl());
            responseDto.setUploadedAt(v.getUploadedAt());
            return responseDto;
        }
    }

    @Override
    @Transactional
    public void deleteVideo(String videoId) {
        if (!videoRepository.existsByVideoId(videoId))
        {
            throw new VideoNotFoundException("Video not found for this Id");
        }else
        {
            videoRepository.deleteByVideoId(videoId);
        }
    }

}
