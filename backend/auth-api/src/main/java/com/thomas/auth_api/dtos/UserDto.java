package com.thomas.auth_api.dtos;

public class UserDto {
    private Integer id;
    private String fullName;
    private String email;
    private String roleName;

    public UserDto(Integer id, String fullName, String email, String roleName) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.roleName = roleName;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRoleName() {
        return roleName;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

}
