package com.notarylink.services.authentication;

import java.util.Random;

public class TwoFactorService {

    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void sendOtp(String email, String otp) {
        // Spring Mail → Brevo ou SendGrid
        // OTP valide 10 minutes, stocké en cache Redis ou en base
    }
}