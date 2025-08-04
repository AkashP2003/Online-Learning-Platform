package com.vedio.VideoStreamingService.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(VideoNotFoundException.class)
    public ResponseEntity<String> handelVideoNotFoundException(VideoNotFoundException ex)
    {
        return new ResponseEntity<>("Video Not found", HttpStatus.NOT_FOUND);
    }

}
