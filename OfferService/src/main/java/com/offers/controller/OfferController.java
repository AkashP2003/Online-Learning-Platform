package com.offers.controller;

import com.offers.dto.RequestDto.OfferRequestDto;
import com.offers.dto.RequestDto.ToggleRequest;
import com.offers.dto.ResponseDto.OfferResponseDto;
import com.offers.entity.Offer;
import com.offers.exception.OfferNotFoundException;
import com.offers.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/offers")
public class OfferController {


        @Autowired
        private OfferService offerService;

        @PostMapping
        public ResponseEntity<OfferResponseDto> createOffer(@RequestBody OfferRequestDto requestDto) {
            OfferResponseDto savedOffer = offerService.createOffer(requestDto);
            return new ResponseEntity<>(savedOffer, HttpStatus.OK);
        }

        @GetMapping("/{code}")
        public ResponseEntity<OfferResponseDto> getOfferByCode(@PathVariable String code) {
            OfferResponseDto offer = offerService.getOfferByCode(code);
            return new ResponseEntity<>(offer,HttpStatus.OK);
        }

        @GetMapping
        public ResponseEntity<List<OfferResponseDto>> getAllOffers() {
            List<OfferResponseDto> offers = offerService.getAllOffers();
            return new ResponseEntity<>(offers,HttpStatus.OK);
        }

        @GetMapping("/active")
        public ResponseEntity<List<OfferResponseDto>> getActiveOffers() {
            List<OfferResponseDto> offers = offerService.getActiveOffers();
            return new ResponseEntity<>(offers,HttpStatus.OK);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteOffer(@PathVariable int id) {
            offerService.deleteOffer(id);
            return ResponseEntity.ok("Offer deleted successfully.");
        }

    @PatchMapping("/{offerId}/toggle")
    public ResponseEntity<OfferResponseDto> toggleOfferStatus(
            @PathVariable int offerId,
            @RequestBody ToggleRequest toggleRequest) {

        OfferResponseDto updatedOffer = offerService.toggleOfferStatus(offerId, toggleRequest.isActive());
        return new ResponseEntity<>(updatedOffer, HttpStatus.OK);
    }
    }

