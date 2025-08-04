package com.offers.repository;

import com.offers.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfferRepository extends JpaRepository<Offer, Integer> {
    Offer findByCode(String code);
}
