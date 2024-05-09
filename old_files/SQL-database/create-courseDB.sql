CREATE DATABASE IF NOT EXISTS courseDB;
USE courseDB;


CREATE TABLE Departments (
    DepartmentID INT AUTO_INCREMENT,
    DepartmentName VARCHAR(255) NOT NULL,
    BuildingLocation VARCHAR(255),
    PRIMARY KEY (DepartmentID)
);


CREATE TABLE Professors (
    ProfessorID INT AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    DepartmentID INT,
    Email VARCHAR(255),
    OfficeLocation VARCHAR(255),
    OfficeHours VARCHAR(255),
    PRIMARY KEY (ProfessorID),
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


CREATE TABLE Courses (
    CourseID INT AUTO_INCREMENT,
    CourseCode VARCHAR(50) NOT NULL,
    CourseName VARCHAR(255) NOT NULL,
    CreditHours INT,
    Description TEXT,
    ScheduleType VARCHAR(50),
    ContactHours INT,
    GradeMode VARCHAR(50),
    CourseAttributes VARCHAR(255),
    PRIMARY KEY (CourseID)
);


CREATE TABLE Prerequisites (
    CourseID INT,
    PrerequisiteCourseID INT,
    PRIMARY KEY (CourseID, PrerequisiteCourseID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (PrerequisiteCourseID) REFERENCES Courses(CourseID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
