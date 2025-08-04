package com.wallet.service;

import com.wallet.dto.RequestDto.WalletPayRequest;
import com.wallet.dto.RequestDto.WalletRequestDto;
import com.wallet.dto.ResponseDto.WalletResponseDto;

public interface WalletService {

    WalletResponseDto addMoney(int userId, WalletRequestDto requestDto);

    boolean payFromWallet(int userId, WalletPayRequest requestDto);

    WalletResponseDto getBalance(int userId);
}
