package com.course.CourseService.controller;

import com.course.CourseService.dto.Request.ModuleRequestDto;
import com.course.CourseService.dto.Response.ModuleResponseDto;
import com.course.CourseService.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @PostMapping("/courses/{courseId}/modules")
    public ResponseEntity<ModuleResponseDto> createModule(@PathVariable("courseId") int courseId, @RequestBody ModuleRequestDto moduleRequestDto)
    {
        ModuleResponseDto moduleResponseDto = moduleService.creatModule(courseId,moduleRequestDto);
        return new ResponseEntity<>(moduleResponseDto, HttpStatus.OK);
    }

    @GetMapping("/courses/{courseId}/modules")
    public ResponseEntity<List<ModuleResponseDto>> getModule(@PathVariable("courseId") int courseId)
    {
        List<ModuleResponseDto> moduleResponseDto = moduleService.getModule(courseId);
        return new ResponseEntity<>(moduleResponseDto,HttpStatus.OK);
    }

    @GetMapping("/{moduleId}")
    public ResponseEntity<ModuleResponseDto> getModuleById(@PathVariable("moduleId") int moduleId)
    {
        ModuleResponseDto moduleResponseDto = moduleService.getModuleById(moduleId);
        return new ResponseEntity<>(moduleResponseDto,HttpStatus.OK);
    }

    @PutMapping("/{moduleId}")
    public ResponseEntity<ModuleResponseDto> updateModuleById(@PathVariable("moduleId") int moduleId, @RequestBody ModuleRequestDto moduleRequestDto)
    {
        ModuleResponseDto moduleResponseDto = moduleService.updateModuleById(moduleId,moduleRequestDto);
        return new ResponseEntity<>(moduleResponseDto,HttpStatus.OK);
    }

    @DeleteMapping("/{moduleId}")
    public ResponseEntity<String> deleteModuleById(@PathVariable("moduleId") int moduleId)
    {
        moduleService.deleteModuleById(moduleId);
        return new ResponseEntity<>("Module deleted successfully",HttpStatus.OK);
    }
}
