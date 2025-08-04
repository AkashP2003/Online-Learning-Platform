package com.course.CourseService.service.serviceImp;

import com.course.CourseService.dto.Request.ModuleRequestDto;
import com.course.CourseService.dto.Response.LessonResponseDto;
import com.course.CourseService.dto.Response.ModuleResponseDto;
import com.course.CourseService.entity.Module;
import com.course.CourseService.exception.ModuleNotFoundException;
import com.course.CourseService.repository.ModuleRepository;
import com.course.CourseService.service.ModuleService;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ModuleServiceImp implements ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public ModuleResponseDto creatModule(int courseId, ModuleRequestDto moduleRequestDto) {
        Module module = new Module();
        module.setCourseId(courseId);
        module.setTitle(moduleRequestDto.getTitle());
        Module m =  moduleRepository.save(module);

        ModuleResponseDto dto = new ModuleResponseDto();
        dto.setModuleId(m.getModuleId());
        dto.setCourseId(m.getCourseId());
        dto.setTitle(m.getTitle());
        return dto;
    }

    @Override
    public List<ModuleResponseDto> getModule(int courseId) {
        List<Module> modules = moduleRepository.findByCourseId(courseId);
        List<ModuleResponseDto> moduleDtos = new ArrayList<>();
        for (Module module : modules) {
            List<LessonResponseDto> lessonResponseDtos = new ArrayList<>();
            try {
                String lessonServiceUrl = "http://COURSESERVICE/api/lesson/modules/" + module.getModuleId() + "/lessons";
                ResponseEntity<List<LessonResponseDto>> lessonResponseDto = restTemplate.exchange(
                        lessonServiceUrl,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {}
                );
                lessonResponseDtos = lessonResponseDto.getBody();
            } catch (ResourceAccessException e) {
                System.out.println("Lesson service is unreachable for moduleId " + module.getModuleId() + ": " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error fetching lessons for moduleId " + module.getModuleId() + ": " + e.getMessage());
            }
            ModuleResponseDto m = new ModuleResponseDto();
            m.setModuleId(module.getModuleId());
            m.setTitle(module.getTitle());
            m.setCourseId(module.getCourseId());
            m.setLessons(lessonResponseDtos);
            moduleDtos.add(m);
        }

        return moduleDtos;
    }


    @Override
    public ModuleResponseDto getModuleById(int moduleId) {
        if(!moduleRepository.existsByModuleId(moduleId))
        {
            throw new ModuleNotFoundException("Module not found for this moduleId");
        }
        Module module = moduleRepository.findByModuleId(moduleId);

        ModuleResponseDto m = new ModuleResponseDto();
        m.setModuleId(module.getModuleId());
        m.setTitle(module.getTitle());
        m.setCourseId(module.getCourseId());
        return m;
    }

    @Override
    public ModuleResponseDto updateModuleById(int moduleId,ModuleRequestDto moduleRequestDto) {
        if(!moduleRepository.existsByModuleId(moduleId))
        {
            throw new ModuleNotFoundException("Module not found for this moduleId");
        }
        Module m = moduleRepository.findByModuleId(moduleId);
        m.setTitle(moduleRequestDto.getTitle());
        Module module = moduleRepository.save(m);
        ModuleResponseDto dto = new ModuleResponseDto();
        dto.setModuleId(module.getModuleId());
        dto.setCourseId(module.getCourseId());
        dto.setTitle(module.getTitle());
        return dto;
    }

    @Override
    @Transactional
    public void deleteModuleById(int moduleId) {
        if(!moduleRepository.existsByModuleId(moduleId))
        {
            throw new ModuleNotFoundException("Module not found for this moduleId");
        }
        moduleRepository.deleteByModuleId(moduleId);
    }
}
