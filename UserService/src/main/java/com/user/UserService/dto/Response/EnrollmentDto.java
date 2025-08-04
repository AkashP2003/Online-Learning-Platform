package com.user.UserService.dto.Response;

import com.user.UserService.dto.CourseDto;
import com.user.UserService.dto.ProgressDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentDto {
    private int userId;
    private int courseId;
    private List<CourseDto> courseDto = new ArrayList<>();
    private LocalDateTime enrolledAt;
    private boolean completed;
    private List<ProgressDto> progress = new ArrayList<>();
}
