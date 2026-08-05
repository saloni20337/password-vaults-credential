package com.passwordvault.security;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import org.springframework.stereotype.Component;

@Component
public class EncryptionUtil {

    private final String SECRET_KEY = "1234567890123456";
    
    private final String ALGORITHM = "AES";


    // Encrypt Password before saving in DB
    public String encrypt(String password){

        try {

            SecretKeySpec key = new SecretKeySpec(
                    SECRET_KEY.getBytes(),
                    ALGORITHM
            );


            Cipher cipher = Cipher.getInstance(ALGORITHM);

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    key
            );


            byte[] encrypted =
                    cipher.doFinal(password.getBytes());


            return Base64.getEncoder()
                    .encodeToString(encrypted);


        } catch(Exception e){

            throw new RuntimeException(e);
        }
    }



    // Decrypt password when user clicks View
    public String decrypt(String encryptedPassword){

        try {

            SecretKeySpec key = new SecretKeySpec(
                    SECRET_KEY.getBytes(),
                    ALGORITHM
            );


            Cipher cipher = Cipher.getInstance(ALGORITHM);


            cipher.init(
                    Cipher.DECRYPT_MODE,
                    key
            );


            byte[] decrypted =
                    cipher.doFinal(
                       Base64.getDecoder()
                       .decode(encryptedPassword)
                    );


            return new String(decrypted);


        } catch(Exception e){

            throw new RuntimeException(e);
        }
    }
}