package com.wallet.service.serviceImp;

import com.wallet.dto.PaymentRequestDto;
import com.wallet.dto.RequestDto.WalletPayRequest;
import com.wallet.dto.RequestDto.WalletRequestDto;
import com.wallet.dto.ResponseDto.WalletResponseDto;
import com.wallet.entity.Wallet;
import com.wallet.repository.WalletRepository;
import com.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
public class WalletServiceImp implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public WalletResponseDto addMoney(int userId, WalletRequestDto requestDto) {
            Wallet wallet = walletRepository.findByUserId(userId)
                    .orElseGet(() -> new Wallet(0, userId, 0.0, LocalDateTime.now()));
            wallet.setBalance(wallet.getBalance() + requestDto.getAmount());
            wallet.setUpdatedAt(LocalDateTime.now());
            Wallet w = walletRepository.save(wallet);

        WalletResponseDto Response = new WalletResponseDto();
        Response.setUserId(w.getUserId());
        Response.setBalance(w.getBalance());
        return Response;
    }

    @Override
    public boolean payFromWallet(int userId, WalletPayRequest requestDto) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        if (wallet.getBalance() < requestDto.getAmount()) return false;
        wallet.setBalance(wallet.getBalance() - requestDto.getAmount());
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
        PaymentRequestDto paymentDto = new PaymentRequestDto();
        paymentDto.setUserId(userId);
        paymentDto.setCourseId(requestDto.getCourseId());
        paymentDto.setAmount(requestDto.getAmount());
        paymentDto.setPaymentGateway("WALLET");
        paymentDto.setStatus("SUCCESS");
        paymentDto.setCouponCode(requestDto.getCouponCode());
        restTemplate.postForObject("http://PAYMENTSERVICE/api/payment/", paymentDto, Void.class);

        wallet.setUpdatedAt(LocalDateTime.now());
        return true;
    }

    @Override
    public WalletResponseDto getBalance(int userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        WalletResponseDto responseDto = new WalletResponseDto();
        responseDto.setBalance(wallet.getBalance());
        responseDto.setUserId(wallet.getUserId());
        return responseDto;
    }
}
