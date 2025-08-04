package com.wallet.controller;

import com.wallet.dto.RequestDto.WalletPayRequest;
import com.wallet.dto.RequestDto.WalletRequestDto;
import com.wallet.dto.ResponseDto.WalletResponseDto;
import com.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @PostMapping("/{userId}/add")
    public ResponseEntity<WalletResponseDto> addMoney(@PathVariable int userId, @RequestBody WalletRequestDto requestDto) {
        WalletResponseDto response = walletService.addMoney(userId, requestDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{userId}/pay")
    public ResponseEntity<String> pay(@PathVariable int userId, @RequestBody WalletPayRequest requestDto) {
        boolean success = walletService.payFromWallet(userId, requestDto);
        return success ?
                ResponseEntity.ok("Payment successful from wallet.") :
                ResponseEntity.badRequest().body("Insufficient balance.");
    }

    @GetMapping("/{userId}/balance")
    public ResponseEntity<WalletResponseDto> balance(@PathVariable int userId) {
        WalletResponseDto response = walletService.getBalance(userId);
        return ResponseEntity.ok(response);
    }
}

