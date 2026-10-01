package com.capgemini.realestate.config;

import com.capgemini.realestate.entity.*;
import com.capgemini.realestate.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with demo data.");
            return;
        }

        logger.info("Seeding database with sample users, properties, rental booking requests, inquiries, and payments...");

        String defaultPassword = passwordEncoder.encode("Password@123");

        // 1. Seed Users (Admin, Owners, and Multiple Customers)
        User admin = new User(null, "System Administrator", "admin@realestate.com", defaultPassword,
                Role.ROLE_ADMIN, "+91 98765 43210", "100 MG Road, Bangalore", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        userRepository.save(admin);

        User owner1 = new User(null, "Sarah Jenkins (Premier Homes)", "owner@realestate.com", defaultPassword,
                Role.ROLE_OWNER, "+91 98123 45678", "42 Residency Road, Bangalore", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150");
        userRepository.save(owner1);

        User owner2 = new User(null, "Rajesh Kumar (Apex Realty)", "rajesh.broker@realestate.com", defaultPassword,
                Role.ROLE_OWNER, "+91 99887 76655", "12 Bandra Kurla Complex, Mumbai", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        userRepository.save(owner2);

        User customer1 = new User(null, "Alex Morgan", "customer@realestate.com", defaultPassword,
                Role.ROLE_CUSTOMER, "+91 91234 56780", "15 Koramangala, Bangalore", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150");
        userRepository.save(customer1);

        User customer2 = new User(null, "Priya Sharma", "priya.tenant@realestate.com", defaultPassword,
                Role.ROLE_CUSTOMER, "+91 93456 78901", "88 Hitec City, Hyderabad", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
        userRepository.save(customer2);

        User customer3 = new User(null, "Rahul Varma", "rahul.techie@realestate.com", defaultPassword,
                Role.ROLE_CUSTOMER, "+91 97788 11223", "45 Powell Street, Pune", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150");
        userRepository.save(customer3);

        User customer4 = new User(null, "Ananya Sen", "ananya.design@realestate.com", defaultPassword,
                Role.ROLE_CUSTOMER, "+91 98451 22334", "7 Salt Lake Sector V, Kolkata", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        userRepository.save(customer4);

        // 2. Seed Rich Property Catalog
        Property p1 = new Property(null,
                "The Grand Azure Luxury Penthouse",
                "Spectacular 4-bedroom panoramic sky penthouse overlooking the city skyline. Features floor-to-ceiling glass windows, private infinity pool, Italian marble flooring, and smart automation system.",
                BigDecimal.valueOf(85000.00),
                PropertyType.PENTHOUSE,
                PropertyStatus.AVAILABLE,
                "77 Indiranagar 100ft Road",
                "Bangalore",
                "Karnataka",
                "560038",
                "India",
                4, 4, 3800.0,
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
                true, owner1);
        propertyRepository.save(p1);

        Property p2 = new Property(null,
                "Modern Seafront Villa with Garden",
                "Exquisite 5-bedroom waterfront villa with landscaped zen gardens, private beach access, chef's gourmet kitchen, and double car garage in prime coastal location.",
                BigDecimal.valueOf(145000.00),
                PropertyType.VILLA,
                PropertyStatus.AVAILABLE,
                "104 Marine Drive Promenade",
                "Mumbai",
                "Maharashtra",
                "400020",
                "India",
                5, 5, 5200.0,
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
                true, owner2);
        propertyRepository.save(p2);

        Property p3 = new Property(null,
                "Urban Loft in Tech Corridor",
                "Sleek and contemporary 2-bedroom loft apartment. High exposed concrete ceilings, hardwood floors, high-speed fiber internet, and access to modern gym and co-working lounge.",
                BigDecimal.valueOf(32000.00),
                PropertyType.APARTMENT,
                PropertyStatus.AVAILABLE,
                "18 Outer Ring Road, Bellandur",
                "Bangalore",
                "Karnataka",
                "560103",
                "India",
                2, 2, 1450.0,
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
                false, owner1);
        propertyRepository.save(p3);

        Property p4 = new Property(null,
                "Silicon Heights Premium Commercial Office",
                "Grade-A modern commercial office space ready for tech enterprise or startup. Features central HVAC, biometric security, 4 conference rooms, and 24/7 power backup.",
                BigDecimal.valueOf(210000.00),
                PropertyType.COMMERCIAL,
                PropertyStatus.AVAILABLE,
                "9th Floor, Cyber Gateway, Hitec City",
                "Hyderabad",
                "Telangana",
                "500081",
                "India",
                0, 4, 6500.0,
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
                true, owner2);
        propertyRepository.save(p4);

        Property p5 = new Property(null,
                "Serene Green Valley Garden House",
                "Charming 3-bedroom family bungalow surrounded by lush greenery and fruit orchards. Features quiet neighborhood, solar heating, and spacious backyard patio.",
                BigDecimal.valueOf(45000.00),
                PropertyType.HOUSE,
                PropertyStatus.RENTED,
                "29 Koregaon Park Lane 4",
                "Pune",
                "Maharashtra",
                "411001",
                "India",
                3, 3, 2600.0,
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200",
                false, owner1);
        propertyRepository.save(p5);

        Property p6 = new Property(null,
                "Minimalist Studio Suite near Central Mall",
                "Bright, fully furnished modern studio with high-end appliances, modular wardrobe, Queen plush bed, and 50-inch 4K TV. Ideal for solo professionals.",
                BigDecimal.valueOf(18500.00),
                PropertyType.STUDIO,
                PropertyStatus.AVAILABLE,
                "502 Connaught Place Outer Circle",
                "Delhi",
                "Delhi",
                "110001",
                "India",
                1, 1, 620.0,
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
                false, owner2);
        propertyRepository.save(p6);

        Property p7 = new Property(null,
                "The Palms Royal 4BHK Villa with Private Pool",
                "Tropical sanctuary offering 4 master ensuite bedrooms, heated infinity swimming pool, outdoor barbecue gazebo, and 24/7 private concierge service.",
                BigDecimal.valueOf(95000.00),
                PropertyType.VILLA,
                PropertyStatus.AVAILABLE,
                "14 Candolim Beach Road",
                "Goa",
                "Goa",
                "403515",
                "India",
                4, 4, 4500.0,
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
                true, owner1);
        propertyRepository.save(p7);

        Property p8 = new Property(null,
                "Signature Tower Luxury High-Rise Condo",
                "Opulent 3-bedroom condominium with Arabian sea vistas, Italian designer modular kitchen, high-speed elevators, and Olympic-sized clubhouse pool.",
                BigDecimal.valueOf(65000.00),
                PropertyType.CONDO,
                PropertyStatus.AVAILABLE,
                "88 Worli Sea Face",
                "Mumbai",
                "Maharashtra",
                "400018",
                "India",
                3, 3, 2100.0,
                "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200",
                true, owner2);
        propertyRepository.save(p8);

        Property p9 = new Property(null,
                "CyberCity Tech Park Executive Office Suite",
                "Prestigious commercial office suite in the heart of the IT corridor. High capacity fiber backbones, executive boardroom, cafeteria, and basement parking for 20 vehicles.",
                BigDecimal.valueOf(180000.00),
                PropertyType.COMMERCIAL,
                PropertyStatus.AVAILABLE,
                "Block C, EPIP Zone, Whitefield",
                "Bangalore",
                "Karnataka",
                "560066",
                "India",
                0, 6, 5800.0,
                "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200",
                false, owner1);
        propertyRepository.save(p9);

        Property p10 = new Property(null,
                "Eco-Living 3BHK Duplex in Jubilee Hills",
                "Sustainable luxury home featuring rooftop solar power, rainwater harvesting, double-height living room, private garden, and electric vehicle charging station.",
                BigDecimal.valueOf(52000.00),
                PropertyType.HOUSE,
                PropertyStatus.AVAILABLE,
                "Road No. 36, Jubilee Hills",
                "Hyderabad",
                "Telangana",
                "500033",
                "India",
                3, 3, 2900.0,
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
                true, owner2);
        propertyRepository.save(p10);

        Property p11 = new Property(null,
                "Seaside Serenity Luxury 2BHK Apartment",
                "Breathtaking Bay of Bengal views from your private balcony. Fully air-conditioned, teakwood wardrobes, designer lighting, and secure gated community.",
                BigDecimal.valueOf(38000.00),
                PropertyType.APARTMENT,
                PropertyStatus.AVAILABLE,
                "22 East Coast Road, Neelankarai",
                "Chennai",
                "Tamil Nadu",
                "600115",
                "India",
                2, 2, 1600.0,
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
                false, owner1);
        propertyRepository.save(p11);

        Property p12 = new Property(null,
                "Heritage Victorian Garden Townhouse",
                "Colonial charm meets contemporary comfort. High ceilings, polished Burma teak woodwork, sprawling front lawn, and serene residential ambiance.",
                BigDecimal.valueOf(42000.00),
                PropertyType.HOUSE,
                PropertyStatus.AVAILABLE,
                "15 Ballygunge Circular Road",
                "Kolkata",
                "West Bengal",
                "700019",
                "India",
                4, 3, 3100.0,
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
                false, owner2);
        propertyRepository.save(p12);

        // 3. Seed Rental Bookings / Lease Requests
        // Request 1: Confirmed with payment
        Booking b1 = new Booking(null, p1, customer1,
                LocalDate.now().plusDays(3), LocalDate.now().plusDays(33),
                BigDecimal.valueOf(85000.00),
                BookingStatus.CONFIRMED,
                "Request early key handover on arrival day.");
        bookingRepository.save(b1);

        // Request 2: Pending owner review
        Booking b2 = new Booking(null, p3, customer2,
                LocalDate.now().plusDays(7), LocalDate.now().plusDays(37),
                BigDecimal.valueOf(32000.00),
                BookingStatus.PENDING,
                "Would love to check if covered car parking is included.");
        bookingRepository.save(b2);

        // Request 3: Pending rental request for Luxury Villa in Mumbai
        Booking b3 = new Booking(null, p2, customer1,
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(100),
                BigDecimal.valueOf(435000.00),
                BookingStatus.PENDING,
                "Corporate relocation lease request. Need copy of company rental lease agreement.");
        bookingRepository.save(b3);

        // Request 4: Confirmed rental lease for Goa Villa with Payment
        Booking b4 = new Booking(null, p7, customer2,
                LocalDate.now().plusDays(5), LocalDate.now().plusDays(35),
                BigDecimal.valueOf(95000.00),
                BookingStatus.CONFIRMED,
                "Family vacation retreat. Please arrange airport transfer if possible.");
        bookingRepository.save(b4);

        // Request 5: Pending rental request for Mumbai Luxury High-Rise Condo
        Booking b5 = new Booking(null, p8, customer3,
                LocalDate.now().plusDays(14), LocalDate.now().plusDays(379),
                BigDecimal.valueOf(780000.00),
                BookingStatus.PENDING,
                "1-year lease agreement requested. Ready for immediate security deposit transfer.");
        bookingRepository.save(b5);

        // Request 6: Confirmed Commercial Office Lease with Payment
        Booking b6 = new Booking(null, p4, customer4,
                LocalDate.now().plusDays(1), LocalDate.now().plusDays(181),
                BigDecimal.valueOf(1260000.00),
                BookingStatus.CONFIRMED,
                "Commercial lease for AI startup headquarters. Requires 24/7 building access card.");
        bookingRepository.save(b6);

        // Request 7: Completed Studio Rental
        Booking b7 = new Booking(null, p6, customer3,
                LocalDate.now().minusDays(60), LocalDate.now().minusDays(1),
                BigDecimal.valueOf(37000.00),
                BookingStatus.COMPLETED,
                "Solo tech professional short-term lease.");
        bookingRepository.save(b7);

        // 4. Seed Payments
        Payment pay1 = new Payment(null, b1, BigDecimal.valueOf(85000.00),
                LocalDateTime.now().minusHours(4),
                PaymentMethod.CREDIT_CARD,
                PaymentStatus.SUCCESS,
                "TXN-8F92A14E");
        paymentRepository.save(pay1);

        Payment pay2 = new Payment(null, b4, BigDecimal.valueOf(95000.00),
                LocalDateTime.now().minusDays(1),
                PaymentMethod.UPI,
                PaymentStatus.SUCCESS,
                "TXN-4B889C21");
        paymentRepository.save(pay2);

        Payment pay3 = new Payment(null, b6, BigDecimal.valueOf(1260000.00),
                LocalDateTime.now().minusDays(2),
                PaymentMethod.NET_BANKING,
                PaymentStatus.SUCCESS,
                "TXN-91E550DF");
        paymentRepository.save(pay3);

        Payment pay4 = new Payment(null, b7, BigDecimal.valueOf(37000.00),
                LocalDateTime.now().minusDays(60),
                PaymentMethod.DEBIT_CARD,
                PaymentStatus.SUCCESS,
                "TXN-1A099FE8");
        paymentRepository.save(pay4);

        // 5. Seed Inquiries & Discussions
        Inquiry inq1 = new Inquiry(null, p1, customer1,
                "Penthouse Maintenance Charges and Club Membership",
                "Hi Sarah, does the monthly rent include maintenance charges and clubhouse access?",
                "Hello Alex! Yes, all monthly maintenance fees, pool upkeep, and 2 clubhouse membership cards are included.",
                InquiryStatus.REPLIED);
        inq1.setRepliedAt(LocalDateTime.now().minusDays(1));
        inquiryRepository.save(inq1);

        Inquiry inq2 = new Inquiry(null, p2, customer2,
                "Pet Policy and Security Deposit for Waterfront Villa",
                "Hello Rajesh, we have a golden retriever. Is this property pet-friendly?",
                null,
                InquiryStatus.OPEN);
        inquiryRepository.save(inq2);

        Inquiry inq3 = new Inquiry(null, p7, customer3,
                "Power Generator and Solar Backup in Goa Villa",
                "Hi Sarah, does the Candolim villa have full generator backup during monsoons?",
                "Hello Rahul! Yes, we have a heavy-duty 30kVA automatic generator backup system.",
                InquiryStatus.REPLIED);
        inq3.setRepliedAt(LocalDateTime.now().minusHours(8));
        inquiryRepository.save(inq3);

        Inquiry inq4 = new Inquiry(null, p4, customer4,
                "Dual Internet ISP Terminations and Server Room Specs",
                "Hello Rajesh, does the commercial office space have dual ISP redundancy?",
                "Hi Ananya, yes, Tata Teleservices and Airtel Enterprise fiber are both pre-connected.",
                InquiryStatus.REPLIED);
        inq4.setRepliedAt(LocalDateTime.now().minusHours(18));
        inquiryRepository.save(inq4);

        Inquiry inq5 = new Inquiry(null, p8, customer1,
                "Covered Parking Slots for 2 Vehicles",
                "Is there an option for two dedicated covered car parking slots in Worli Tower?",
                null,
                InquiryStatus.OPEN);
        inquiryRepository.save(inq5);

        logger.info("Successfully seeded expanded demo data! Real Estate Management System is ready with 12 properties and rich rental requests.");
    }
}
