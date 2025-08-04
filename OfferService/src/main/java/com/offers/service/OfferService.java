package com.offers.service;

import com.offers.dto.RequestDto.OfferRequestDto;
import com.offers.dto.ResponseDto.OfferResponseDto;
import com.offers.entity.Offer;

import java.util.List;

public interface OfferService {

    OfferResponseDto createOffer(OfferRequestDto requestDto);

    OfferResponseDto getOfferByCode(String code);

    List<OfferResponseDto> getAllOffers();

    List<OfferResponseDto> getActiveOffers();

    void deleteOffer(int id);

    OfferResponseDto toggleOfferStatus(int offerId, boolean active);
}
