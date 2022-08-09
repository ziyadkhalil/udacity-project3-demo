CREATE TABLE course_student (
     student_id INT REFERENCES student,
     course_id INT REFERENCES course,
     grade CHAR(1) DEFAULT 'A',
     PRIMARY KEY (student_id, course_id)
);