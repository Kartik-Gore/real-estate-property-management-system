package com.capgemini.realestate.repository;

import com.capgemini.realestate.entity.Payment;
import com.capgemini.realestate.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBookingUserIdOrderByPaymentDateDesc(Long userId);
    List<Payment> findByBookingPropertyOwnerIdOrderByPaymentDateDesc(Long ownerId);
    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByTransactionId(String transactionId);
    long countByStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS' AND p.booking.property.owner.id = :ownerId")
    BigDecimal calculateOwnerRevenue(@Param("ownerId") Long ownerId);
}
