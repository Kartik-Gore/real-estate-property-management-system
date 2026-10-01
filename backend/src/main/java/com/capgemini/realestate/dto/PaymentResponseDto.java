package com.capgemini.realestate.dto;

import com.capgemini.realestate.entity.Payment;
import com.capgemini.realestate.entity.PaymentMethod;
import com.capgemini.realestate.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponseDto {
    private Long id;
    private Long bookingId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private String propertyTitle;
    private String customerName;
    private String customerEmail;
    private String ownerName;

    public PaymentResponseDto() {
    }

    public static PaymentResponseDto fromEntity(Payment payment) {
        if (payment == null) return null;
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setId(payment.getId());
        if (payment.getBooking() != null) {
            dto.setBookingId(payment.getBooking().getId());
            if (payment.getBooking().getProperty() != null) {
                dto.setPropertyTitle(payment.getBooking().getProperty().getTitle());
                if (payment.getBooking().getProperty().getOwner() != null) {
                    dto.setOwnerName(payment.getBooking().getProperty().getOwner().getName());
                }
            }
            if (payment.getBooking().getUser() != null) {
                dto.setCustomerName(payment.getBooking().getUser().getName());
                dto.setCustomerEmail(payment.getBooking().getUser().getEmail());
            }
        }
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setStatus(payment.getStatus());
        dto.setTransactionId(payment.getTransactionId());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
}
