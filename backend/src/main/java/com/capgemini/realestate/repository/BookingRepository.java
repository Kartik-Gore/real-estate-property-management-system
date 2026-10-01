package com.capgemini.realestate.repository;

import com.capgemini.realestate.entity.Booking;
import com.capgemini.realestate.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByPropertyOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Booking> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    long countByStatus(BookingStatus status);
}
