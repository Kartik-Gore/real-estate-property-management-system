package com.capgemini.realestate.controller;

import com.capgemini.realestate.dto.PaymentRequestDto;
import com.capgemini.realestate.dto.PaymentResponseDto;
import com.capgemini.realestate.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDto> processPayment(
            @Valid @RequestBody PaymentRequestDto dto,
            Authentication authentication
    ) {
        PaymentResponseDto payment = paymentService.processPayment(dto, authentication.getName());
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentResponseDto>> getMyPayments(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getMyPayments(authentication.getName()));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<List<PaymentResponseDto>> getOwnerPayments(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getOwnerPayments(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponseDto>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponseDto> getPaymentByBooking(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(paymentService.getPaymentByBooking(bookingId, authentication.getName()));
    }
}
