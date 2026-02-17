package controller;

import dao.UserDAO;
import model.User;

public class AuthController {
    private UserDAO userDAO;

    public AuthController() {
        this.userDAO = new UserDAO();
    }

    public boolean registerUser(String name, String email, String password, String role) {
        if (name == null || name.isEmpty() || email == null || email.isEmpty() || 
            password == null || password.isEmpty() || role == null || role.isEmpty()) {
            System.out.println("Invalid input: All fields are required.");
            return false;
        }

        User user = new User(name, email, password, role);
        return userDAO.registerUser(user);
    }

    public User loginUser(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            System.out.println("Invalid input: Email and password are required.");
            return null;
        }

        return userDAO.loginUser(email, password);
    }

    public User getUserProfile(int userId) {
        return userDAO.getUserById(userId);
    }
}
