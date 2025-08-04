package com.course.CourseService.service;

import com.course.CourseService.dto.Request.ModuleRequestDto;
import com.course.CourseService.dto.Response.ModuleResponseDto;

import java.util.List;

public interface ModuleService {
    ModuleResponseDto creatModule(int courseId, ModuleRequestDto moduleRequestDto);
    List<ModuleResponseDto> getModule(int courseId);
    ModuleResponseDto getModuleById(int moduleId);


    ModuleResponseDto updateModuleById(int moduleId, ModuleRequestDto moduleRequestDto);

    void deleteModuleById(int moduleId);
}
