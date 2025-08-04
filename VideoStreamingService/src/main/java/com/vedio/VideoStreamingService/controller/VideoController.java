package com.vedio.VideoStreamingService.controller;

import com.vedio.VideoStreamingService.dto.Request.VideoRequestDto;
import com.vedio.VideoStreamingService.dto.Response.VideoResponseDto;
//import com.vedio.VideoStreamingService.entity.Video
import com.vedio.VideoStreamingService.service.VideoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/video")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @Operation(summary = "Get video by lesson ID")
    @PostMapping("/")
    public ResponseEntity<VideoResponseDto> addVideo(@RequestBody VideoRequestDto requestDto)
    {
        VideoResponseDto responseDto = videoService.addVideo(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "Get video by lessonID")
    @GetMapping("/lessons/{lessonId}/video")
    public ResponseEntity<VideoResponseDto> getVideo(@PathVariable("lessonId") int lessonId)
    {
        VideoResponseDto responseDto = videoService.getVideo(lessonId);
        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }


    @Operation(summary = "Update video by video ID")
    @PutMapping("/{videoId}")
    public ResponseEntity<VideoResponseDto> updateVideo(@RequestBody VideoRequestDto requestDto, @PathVariable("videoId") String videoId)
    {
        VideoResponseDto responseDto = videoService.updateVideo(requestDto,videoId);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "Delete video by video ID")
    @DeleteMapping("/{videoId}")
    public ResponseEntity<String> updateVideo(@PathVariable("videoId") String videoId)
    {
        videoService.deleteVideo(videoId);
        return new ResponseEntity<>("Video deleted Successfully", HttpStatus.OK);
    }
}
