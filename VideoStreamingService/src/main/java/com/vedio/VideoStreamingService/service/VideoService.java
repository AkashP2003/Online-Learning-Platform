package com.vedio.VideoStreamingService.service;

import com.vedio.VideoStreamingService.dto.Request.VideoRequestDto;
import com.vedio.VideoStreamingService.dto.Response.VideoResponseDto;

public interface VideoService {

    VideoResponseDto getVideo(int lessonId);

    VideoResponseDto addVideo(VideoRequestDto requestDto);

    VideoResponseDto updateVideo(VideoRequestDto requestDto, String videoId);

    void deleteVideo(String videoId);
}
