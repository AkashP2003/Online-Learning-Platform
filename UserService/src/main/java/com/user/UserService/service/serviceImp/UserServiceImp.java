package com.user.UserService.service.serviceImp;

import com.user.UserService.enums.Role;
import com.user.UserService.dto.EnrollmentDto;
import com.user.UserService.dto.PaymentDto;
import com.user.UserService.dto.Request.UserRequestDto;
import com.user.UserService.dto.Response.UserResponseDto;
import com.user.UserService.dto.WalletDto;
import com.user.UserService.entity.User;
import com.user.UserService.exception.UserNotFoundException;
import com.user.UserService.repository.UserRepository;
import com.user.UserService.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        User u = new User();
        u.setUsername(userRequestDto.getUsername());
        u.setEmail(userRequestDto.getEmail());
        u.setPassword(userRequestDto.getPassword());
        u.setRole(userRequestDto.getRole());
        u.setCreatedAt(LocalDateTime.now());
        u.setActive(true);
        try {
            User savedUser = userRepository.save(u);
            UserResponseDto userResponse = new UserResponseDto();
            userResponse.setUserId(savedUser.getUserId());
            userResponse.setUsername(savedUser.getUsername());
            userResponse.setEmail(savedUser.getEmail());
            userResponse.setPassword(savedUser.getPassword());
            userResponse.setRole(Role.fromCustomString(String.valueOf(savedUser.getRole())));
            userResponse.setCreatedAt(savedUser.getCreatedAt());
            userResponse.setActive(savedUser.isActive());

            WalletDto walletDto = new WalletDto();
//        walletDto.setUserId(savedUser.getUserId());
            walletDto.setBalance(0.0);
            restTemplate.postForObject("http://WALLETSERVICE/api/wallet/" + savedUser.getUserId() + "/add", walletDto, Void.class);
            return userResponse;
    } catch(
    DataIntegrityViolationException e)
    {
        throw new RuntimeException("Email already exists");
    }
}
    @Override
    public List<UserResponseDto> getUsers() {
       List<User> users =  userRepository.findAll();
       return users.stream().map(user -> {
            UserResponseDto dto = new UserResponseDto();
            dto.setUserId(user.getUserId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setPassword(user.getPassword());
            dto.setRole(Role.fromCustomString(String.valueOf(user.getRole())));
            dto.setCreatedAt(user.getCreatedAt());
            dto.setActive(user.isActive());
           return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public UserResponseDto getUserById(Integer id) {
        if (!userRepository.existsByUserId(id)) {
            throw new UserNotFoundException("User with id " + id + " Not found");
        }
        User u = userRepository.findByUserId(id);


        ResponseEntity<List<EnrollmentDto>> response = null;
        try {
            String enrollmentServiceUrl = "http://ENROLLMENTSERVICE/api/enrollment/users/" + u.getUserId() + "/enrollments";
            response = restTemplate.exchange(
                    enrollmentServiceUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    }
            );
        } catch (ResourceAccessException e) {
            System.out.println("Video service is unreachable for enrollment " + u.getUserId() + ": " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error fetching video for enrollment " + u.getUserId() + ": " + e.getMessage());
        }
        List<EnrollmentDto> enrollmentDtos = response.getBody();


        List<PaymentDto> paymentDtos = new ArrayList<>();
        try {
            String paymentServiceUrl = "http://PAYMENTSERVICE/api/payment/users/" + u.getUserId() + "/payments";
            ResponseEntity<List<PaymentDto>> paymentResponse = restTemplate.exchange(
                    paymentServiceUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<PaymentDto>>() {
                    }
            );
            paymentDtos = paymentResponse.getBody();
        } catch (ResourceAccessException e) {
            System.out.println("Payment service is down or unreachable: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error fetching video for payment " + u.getUserId() + ": " + e.getMessage());
        }


        WalletDto walletDto = null;
        try {
            String videoServiceUrl = "http://WALLETSERVICE/api/wallet/"+u.getUserId()+"/balance";
            ResponseEntity<WalletDto> responseWallet = restTemplate.getForEntity(videoServiceUrl, WalletDto.class);
            if (responseWallet.getStatusCode().is2xxSuccessful() && responseWallet.getBody() != null) {
                walletDto = responseWallet.getBody();
            }
        } catch (ResourceAccessException ex) {
            System.out.println("wallet is not exist for or is unreachable for userId " + u.getUserId() + ": " + ex.getMessage());
        } catch (Exception ex) {
            System.out.println("Error fetching wallet for UserId " + u.getUserId() + ": " + ex.getMessage());
        }

        UserResponseDto userResponse = new UserResponseDto();
        userResponse.setUserId(u.getUserId());
        userResponse.setUsername(u.getUsername());
        userResponse.setEmail(u.getEmail());
        userResponse.setWalletBalanace(walletDto);
//        userResponse.setPassword(u.getPassword());
        userResponse.setRole(Role.fromCustomString(String.valueOf(u.getRole())));
        userResponse.setCreatedAt(u.getCreatedAt());
        userResponse.setEnrollments(enrollmentDtos);
        userResponse.setActive(u.isActive());
        userResponse.setPayments(paymentDtos);
        return userResponse;
    }

    @Override
    public UserResponseDto updateUserProfile(Integer id, UserRequestDto userRequestDto) {
        if(!userRepository.existsByUserId(id))
        {
            throw new UserNotFoundException("User with id "+id+" Not found");
        }
        User existUser = userRepository.findByUserId(id);
        existUser.setUsername(userRequestDto.getUsername());
        existUser.setEmail(userRequestDto.getEmail());
        existUser.setPassword(userRequestDto.getPassword());
        userRepository.save(existUser);
        UserResponseDto userResponse = new UserResponseDto();
        userResponse.setUserId(existUser.getUserId());
        userResponse.setUsername(existUser.getUsername());
        userResponse.setEmail(existUser.getEmail());
//        userResponse.setPassword(existUser.getPassword());
        userResponse.setRole(Role.fromCustomString(String.valueOf(existUser.getRole())));
        userResponse.setCreatedAt(existUser.getCreatedAt());
        return userResponse;

    }

    @Override
    @Transactional
    public void deleteUserProfile(Integer id) {
        if(userRepository.existsByUserId(id))
        {
             userRepository.deleteByUserId(id);
        }
        else {
        throw new UserNotFoundException("User with id "+id+" Not found");
        }

    }

    @Override
    public List<UserResponseDto> getUserByRole(Role role) {
        List<User> users = userRepository.findByRole(role);
        return  users.stream().map(user -> {
            UserResponseDto dto = new UserResponseDto();
            dto.setUserId(user.getUserId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setRole(Role.fromCustomString(String.valueOf(user.getRole())));
            dto.setCreatedAt(user.getCreatedAt());
            dto.setActive(user.isActive());
            return dto;
        }).collect(Collectors.toList());
    }


}
