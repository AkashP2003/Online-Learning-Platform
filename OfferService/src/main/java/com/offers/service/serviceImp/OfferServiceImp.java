package com.offers.service.serviceImp;

import com.offers.dto.OfferDto;
import com.offers.dto.RequestDto.OfferRequestDto;
import com.offers.dto.ResponseDto.OfferResponseDto;
import com.offers.entity.Offer;
import com.offers.exception.OfferNotFoundException;
import com.offers.repository.OfferRepository;
import com.offers.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OfferServiceImp implements OfferService {

    @Autowired
    OfferRepository offerRepository;

    @Override
    public OfferResponseDto createOffer(OfferRequestDto requestDto) {
        Offer offer = new Offer();
        offer.setCode(requestDto.getCode());
        offer.setDiscountPercentage(requestDto.getDiscountPercentage());
        offer.setActive(requestDto.isActive());
        offer.setExpiryDate(requestDto.getExpiryDate());
        Offer o = offerRepository.save(offer);

        OfferResponseDto responseDto = new OfferResponseDto();
        responseDto.setId(o.getId());
        responseDto.setCode(o.getCode());
        responseDto.setDiscountPercentage(o.getDiscountPercentage());
        responseDto.setActive(o.isActive());
        responseDto.setExpiryDate(o.getExpiryDate());
        return responseDto;
    }

    @Override
    public OfferResponseDto getOfferByCode(String code) {
        Offer offer = offerRepository.findByCode(code);
        if(offer==null)
        {
            throw new OfferNotFoundException("Offer not found with this code "+code);
        }
        else {
            OfferResponseDto responseDto = new OfferResponseDto();
            responseDto.setId(offer.getId());
            responseDto.setCode(offer.getCode());
            responseDto.setDiscountPercentage(offer.getDiscountPercentage());
            responseDto.setActive(offer.isActive());
            responseDto.setExpiryDate(offer.getExpiryDate());
            return responseDto;
        }
    }

    @Override
    public List<OfferResponseDto> getAllOffers() {
        List<Offer> offers = offerRepository.findAll();
        List<OfferResponseDto> responseDtos = new ArrayList<>();
        for (Offer offer : offers)
        {
            OfferResponseDto responseDto = new OfferResponseDto();
            responseDto.setId(offer.getId());
            responseDto.setCode(offer.getCode());
            responseDto.setDiscountPercentage(offer.getDiscountPercentage());
            responseDto.setActive(offer.isActive());
            responseDto.setExpiryDate(offer.getExpiryDate());
            responseDtos.add(responseDto);
        }
        return responseDtos;
    }

    @Override
    public List<OfferResponseDto> getActiveOffers() {
        List<Offer> offers = offerRepository.findAll();
        List<OfferResponseDto> responseDtos = new ArrayList<>();
        for (Offer offer : offers)
        {
            if(offer.isActive()) {
                OfferResponseDto responseDto = new OfferResponseDto();
                responseDto.setId(offer.getId());
                responseDto.setCode(offer.getCode());
                responseDto.setDiscountPercentage(offer.getDiscountPercentage());
                responseDto.setActive(offer.isActive());
                responseDto.setExpiryDate(offer.getExpiryDate());
                responseDtos.add(responseDto);
            }
        }
        return responseDtos;
    }

    @Override
    public void deleteOffer(int id) {
        if(!offerRepository.existsById(id))
        {
            throw new OfferNotFoundException("Offer not found");
        }
        offerRepository.deleteById(id);
    }

    @Override
    public OfferResponseDto toggleOfferStatus(int offerId, boolean active) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new OfferNotFoundException("Offer not found with id: " + offerId));
        offer.setActive(active);
        Offer o = offerRepository.save(offer);
        OfferResponseDto response = new OfferResponseDto();
        response.setActive(o.isActive());
        return response;
    }
}
