package com.vedio.VideoStreamingService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoDto {
    private String videoId;
    private int lessonId;
    private String videoUrl;
    private LocalDateTime uploadedAt;
}
