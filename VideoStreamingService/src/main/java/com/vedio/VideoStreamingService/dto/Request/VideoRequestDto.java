package com.vedio.VideoStreamingService.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoRequestDto {
    private int lessonId;
    private String videoUrl;
}
