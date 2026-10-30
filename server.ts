import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini AI client for server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-memory mock database for Spring Boot simulation
let studentProfile = {
  id: "STU-2026-8942",
  name: "Alex Morgan",
  email: "alex.morgan@apexuniversity.edu",
  major: "Computer Science & Enterprise Java",
  year: "Junior (Class of 2027)",
  gpa: 3.88,
  advisor: "Dr. Eleanor Vance",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
};

let courses = [
  { id: "CS-401", name: "Advanced Java & Spring Boot Microservices", credits: 4, instructor: "Dr. Alan Turing", grade: "A", schedule: "Mon/Wed 10:00 AM" },
  { id: "CS-402", name: "Enterprise Cloud Architecture (AWS & GCP)", credits: 3, instructor: "Prof. Grace Hopper", grade: "A-", schedule: "Tue/Thu 2:00 PM" },
  { id: "CS-305", name: "Relational Database Systems & Hibernate ORM", credits: 4, instructor: "Dr. Edgar Codd", grade: "A+", schedule: "Mon/Wed 1:00 PM" },
  { id: "CS-310", name: "Data Structures & Asymptotic Analysis", credits: 3, instructor: "Prof. Donald Knuth", grade: "B+", schedule: "Fri 9:00 AM" }
];

let assignments = [
  { id: 1, course: "CS-401", title: "Build RESTful Spring Boot CRUD Microservice", dueDate: "2026-11-05", status: "Submitted", score: "98/100" },
  { id: 2, course: "CS-305", title: "JPA Hibernate Entity Relationships & Criteria API", dueDate: "2026-11-12", status: "Pending", score: "-" },
  { id: 3, course: "CS-402", title: "Docker Containerization & Kubernetes Deployment", dueDate: "2026-11-20", status: "Pending", score: "-" }
];

// Spring Boot Simulated REST Endpoints
app.get("/api/student", (req, res) => {
  res.json({ success: true, data: studentProfile, timestamp: new Date().toISOString() });
});

app.get("/api/courses", (req, res) => {
  res.json({ success: true, data: courses, count: courses.length });
});

app.get("/api/assignments", (req, res) => {
  res.json({ success: true, data: assignments });
});

app.post("/api/assignments/:id/submit", (req, res) => {
  const { id } = req.params;
  const assignment = assignments.find(a => a.id === Number(id));
  if (assignment) {
    assignment.status = "Submitted";
    assignment.score = "100/100 (Simulated Graded)";
    res.json({ success: true, message: "Assignment submitted successfully to Spring Boot DispatcherServlet!", assignment });
  } else {
    res.status(404).json({ success: false, message: "Assignment not found" });
  }
});

// Spring Boot Source Code Repository for Code Viewer
app.get("/api/springboot/source", (req, res) => {
  const sourceFiles = [
    {
      filename: "StudentPortalApplication.java",
      path: "src/main/java/com/apex/studentportal/StudentPortalApplication.java",
      language: "java",
      code: `package com.apex.studentportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class StudentPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentPortalApplication.class, args);
        System.out.println("🎓 Apex University Spring Boot Student Portal Started Successfully on Port 8080!");
    }
}`
    },
    {
      filename: "StudentController.java",
      path: "src/main/java/com/apex/studentportal/controller/StudentController.java",
      language: "java",
      code: `package com.apex.studentportal.controller;

import com.apex.studentportal.model.Student;
import com.apex.studentportal.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @PostMapping("/enroll")
    public ResponseEntity<String> enrollCourse(@RequestParam String studentId, @RequestParam String courseCode) {
        boolean success = studentService.enrollCourse(studentId, courseCode);
        if (success) {
            return ResponseEntity.ok("Successfully enrolled in course: " + courseCode);
        }
        return ResponseEntity.badRequest().body("Enrollment failed.");
    }
}`
    },
    {
      filename: "StudentService.java",
      path: "src/main/java/com/apex/studentportal/service/StudentService.java",
      language: "java",
      code: `package com.apex.studentportal.service;

import com.apex.studentportal.model.Student;
import com.apex.studentportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional
    public boolean enrollCourse(String studentId, String courseCode) {
        Student student = getStudentById(studentId);
        if (!student.getEnrolledCourses().contains(courseCode)) {
            student.getEnrolledCourses().add(courseCode);
            studentRepository.save(student);
            return true;
        }
        return false;
    }
}`
    },
    {
      filename: "Student.java",
      path: "src/main/java/com/apex/studentportal/model/Student.java",
      language: "java",
      code: `package com.apex.studentportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    private String email;
    private String major;
    private Double gpa;

    @ElementCollection
    private List<String> enrolledCourses;
}`
    },
    {
      filename: "application.properties",
      path: "src/main/resources/application.properties",
      language: "properties",
      code: `# Spring Boot Enterprise Configuration
spring.application.name=student-portal-service
server.port=8080

# H2 In-Memory Database Configuration for Development
spring.datasource.url=jdbc:h2:mem:studentdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA / Hibernate Settings
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Actuator Health Endpoints
management.endpoints.web.exposure.include=health,info,metrics`
    },
    {
      filename: "pom.xml",
      path: "pom.xml",
      language: "xml",
      code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.2</version>
        <relativePath/>
    </parent>
    <groupId>com.apex</groupId>
    <artifactId>student-portal</artifactId>
    <version>1.0.0</version>
    <name>student-portal</name>
    <description>Apex University Student Portal Spring Boot Application</description>
    <properties>
        <java.version>21</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
    }
  ];

  res.json({ success: true, files: sourceFiles });
});

// Gemini AI Study Assistant Endpoint
app.post("/api/ai/study-assistant", async (req, res) => {
  try {
    const { prompt, studentContext } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const systemInstruction = `You are Professor AI, an expert academic advisor and Java Spring Boot tutor at Apex University. 
You help student Alex Morgan (Computer Science major, GPA 3.88) with Java programming, Spring Boot microservices, algorithms, career guidance, and coursework.
Be encouraging, professional, knowledgeable, and provide clear code snippets or academic advice when relevant.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Student Question: ${prompt}\n\nStudent Context: ${JSON.stringify(studentContext || {})}`,
      config: {
        systemInstruction,
      }
    });

    res.json({ success: true, text: response.text || "I am here to help you excel in your studies!" });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate AI study advice" });
  }
});

// Vite middleware integration in development
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false }
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
