package com.vedio.VideoStreamingService.repository;

import com.vedio.VideoStreamingService.entity.Video;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepository extends MongoRepository<Video, String> {
    boolean existsByLessonId(int id);
    Video findByLessonId(int id);
    Video findByVideoId(String id);
    boolean existsByVideoId(String id);
    void deleteByVideoId(String id);
}

