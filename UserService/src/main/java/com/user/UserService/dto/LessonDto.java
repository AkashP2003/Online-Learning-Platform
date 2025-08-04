package com.user.UserService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonDto {
//    private int lessonId;
//    private int moduleId;
    private String title;
    private String videoUrl;
    private int durationInSeconds;
    private List<VideoDto> video = new ArrayList<>();
}
