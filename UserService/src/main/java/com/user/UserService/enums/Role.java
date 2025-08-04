package com.user.UserService.enums;

public enum Role {
    STUDENT, INSTRUCTOR, ADMIN;

    public static Role fromCustomString(String status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        return switch (status.toLowerCase()) {
            case "student" -> STUDENT;
            case "instructor" -> INSTRUCTOR;
            case "admin" -> ADMIN;
            default -> throw new IllegalArgumentException("Invalid status: " + status);
        };
    }
}
