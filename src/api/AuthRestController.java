package api;

import model.User;
import controller.AuthController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    private AuthController authController = new AuthController();

    @PostMapping("/register")
    public ApiResponse register(@RequestBody RegisterRequest request) {
        try {
            boolean success = authController.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
            );
            if (success) {
                return new ApiResponse(true, "Registration successful", null);
            } else {
                return new ApiResponse(false, "Registration failed", null);
            }
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage(), null);
        }
    }

    @PostMapping("/login")
    public ApiResponse login(@RequestBody LoginRequest request) {
        try {
            User user = authController.loginUser(request.getEmail(), request.getPassword());
            if (user != null) {
                return new ApiResponse(true, "Login successful", user);
            } else {
                return new ApiResponse(false, "Invalid credentials", null);
            }
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage(), null);
        }
    }

    @GetMapping("/profile/{userId}")
    public ApiResponse getProfile(@PathVariable int userId) {
        try {
            User user = authController.getUserProfile(userId);
            if (user != null) {
                return new ApiResponse(true, "Profile retrieved", user);
            } else {
                return new ApiResponse(false, "User not found", null);
            }
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage(), null);
        }
    }
}

class RegisterRequest {
    public String name;
    public String email;
    public String password;
    public String role;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

class LoginRequest {
    public String email;
    public String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
