package com.notarylink.services.authentication;

import com.notarylink.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@AllArgsConstructor
public class TwoFactorService {

    private final UserRepository userRepository;
    private final MailSender mailSender;

    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void sendOtp(String email, String otp) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom("axeldung2004@gmail.com");
        mail.setTo(email);
        mail.setSubject("Code de vérification NotaryLink");
        mail.setText("Votre code de vérification est : " + otp + "\n\nCe code expire dans 15 minutes.");
        mailSender.send(mail);
    }

    public void verifyCode(String email, String code) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Utilisateur introuvable");
        }

        var user = userOpt.get();
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            throw new IllegalArgumentException("Aucun code OTP généré");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Le code OTP a expiré");
        }

        if (!user.getOtpCode().equals(code)) {
            throw new IllegalArgumentException("Code OTP invalide");
        }

        user.setOtpVerified(true);
        userRepository.save(user);
    }

    public void resendOtp(String email) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Utilisateur introuvable");
        }

        var user = userOpt.get();
        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        sendOtp(email, otp);
    }
}