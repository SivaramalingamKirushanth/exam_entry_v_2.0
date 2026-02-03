DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AcceptMedicalResitStudents`(IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_s_id` INT, IN `p_exam_type` VARCHAR(50))
BEGIN
    DECLARE table_name VARCHAR(255);
    DECLARE record_count INT;
    DECLARE v_academic_year VARCHAR(50);
    DECLARE v_level INT;
    DECLARE v_sem INT;
    DECLARE existing_entry_count INT;
    DECLARE existing_subs TEXT;
    DECLARE new_subs TEXT;
    SELECT academic_year, level, sem 
    INTO v_academic_year, v_level, v_sem
    FROM batch 
    WHERE batch_id = p_batch_id;
    SET table_name = CONCAT('batch_', p_batch_id, '_sub_', p_sub_id);
    SET @check_table_query = CONCAT('SHOW TABLES LIKE "', table_name, '"');
    PREPARE stmt FROM @check_table_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    IF FOUND_ROWS() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The specified table does not exist.';
    END IF;
    SET @check_record_query = CONCAT(
        'SELECT COUNT(*) INTO @record_count 
         FROM ', table_name, ' 
         WHERE s_id = ', p_s_id
    );
    PREPARE stmt FROM @check_record_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    IF @record_count = 0 THEN
        SET @insert_query = CONCAT(
            'INSERT INTO ', table_name, ' (s_id, eligibility, exam_type) 
             VALUES (', p_s_id, ', "true", "', p_exam_type, '")'
        );
        PREPARE stmt FROM @insert_query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    SELECT COUNT(*) INTO existing_entry_count
    FROM entry_summary
    WHERE s_id = p_s_id 
      AND academic_year = v_academic_year 
      AND level = v_level 
      AND sem = v_sem;
    IF existing_entry_count > 0 THEN
        IF p_exam_type = 'R' THEN
            SELECT COALESCE(resit_subs, '') INTO existing_subs
            FROM entry_summary
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;
            IF existing_subs = '' THEN
                SET new_subs = CAST(p_sub_id AS CHAR);
            ELSE
                SET new_subs = CONCAT(existing_subs, ',', CAST(p_sub_id AS CHAR));
            END IF;
            UPDATE entry_summary 
            SET resit_subs = new_subs
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;
        ELSEIF p_exam_type = 'M' THEN
            SELECT COALESCE(medical_subs, '') INTO existing_subs
            FROM entry_summary
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;
            IF existing_subs = '' THEN
                SET new_subs = CAST(p_sub_id AS CHAR);
            ELSE
                SET new_subs = CONCAT(existing_subs, ',', CAST(p_sub_id AS CHAR));
            END IF;
            UPDATE entry_summary 
            SET medical_subs = new_subs
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;
        END IF;
    ELSE
        IF p_exam_type = 'R' THEN
            INSERT INTO entry_summary (
                s_id, 
                academic_year, 
                level, 
                sem, 
                proper_subs, 
                medical_subs, 
                resit_subs
            ) VALUES (
                p_s_id,
                v_academic_year,
                v_level,
                v_sem,
                NULL,
                NULL,
                CAST(p_sub_id AS CHAR)
            );
        ELSEIF p_exam_type = 'M' THEN
            INSERT INTO entry_summary (
                s_id, 
                academic_year, 
                level, 
                sem, 
                proper_subs, 
                medical_subs, 
                resit_subs
            ) VALUES (
                p_s_id,
                v_academic_year,
                v_level,
                v_sem,
                NULL,
                CAST(p_sub_id AS CHAR),
                NULL
            );
        END IF;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddNewBatchStudentColumns`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE add_column_sql TEXT;
    SET add_column_sql = CONCAT('ALTER TABLE batch_', p_batch_id, '_students ');
    WHILE i < JSON_LENGTH(p_subjects) DO
        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', i, '].sub_id')));
        IF i > 0 THEN
            SET add_column_sql = CONCAT(add_column_sql, ',');
        END IF;
        SET add_column_sql = CONCAT(add_column_sql, ' ADD COLUMN sub_', sub_id, ' VARCHAR(50) NOT NULL');
        SET i = i + 1;
    END WHILE;
    SET @stmt = add_column_sql;
    PREPARE stmt FROM @stmt;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddStudentsToBatch`(IN `p_batch_id` INT, IN `p_new_students` TEXT)
BEGIN
    DECLARE student_id VARCHAR(255);
    DECLARE temp_students TEXT;
    DECLARE insert_query TEXT;
    SET temp_students = p_new_students;
    WHILE LOCATE(',', temp_students) > 0 DO
        SET student_id = SUBSTRING_INDEX(temp_students, ',', 1);
        SET temp_students = SUBSTRING(temp_students, LOCATE(',', temp_students) + 1);
        UPDATE student_detail
        SET batch_ids = 
            CASE
                WHEN batch_ids IS NULL OR batch_ids = '' THEN p_batch_id
                ELSE CONCAT(batch_ids, ',', p_batch_id)
            END
        WHERE s_id = student_id;
    END WHILE;
    SET student_id = temp_students;
    UPDATE student_detail
    SET batch_ids = 
        CASE
            WHEN batch_ids IS NULL OR batch_ids = '' THEN p_batch_id
            ELSE CONCAT(batch_ids, ',', p_batch_id)
        END
    WHERE s_id = student_id;
    SET insert_query = CONCAT(
        'INSERT INTO batch_', 
        p_batch_id, 
        '_students (s_id, applied_to_exam) VALUES '
    );
    SET temp_students = p_new_students;
    WHILE LOCATE(',', temp_students) > 0 DO
        SET student_id = SUBSTRING_INDEX(temp_students, ',', 1);
        SET temp_students = SUBSTRING(temp_students, LOCATE(',', temp_students) + 1);
        SET insert_query = CONCAT(insert_query, '(', student_id, ', "false"), ');
    END WHILE;
    SET student_id = temp_students;
    SET insert_query = CONCAT(insert_query, '(', student_id, ', "false")');
SET @stmt = insert_query;
    PREPARE stmt FROM @stmt;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ApplyExam`(IN `p_user_id` INT, IN `p_removed_subjects` VARCHAR(255), OUT `out_batch_id` INT)
ae:BEGIN
 DECLARE p_s_id INT;
 DECLARE p_batch_id INT;
 DECLARE p_applied_to_exam VARCHAR(50) DEFAULT NULL;
 DECLARE done INT DEFAULT FALSE;
 DECLARE sub_col_name VARCHAR(255);
 DECLARE current_sub_id VARCHAR(10);
 DECLARE attendance_value INT;
 DECLARE eligibility_value VARCHAR(50);
 DECLARE student_deadline TIMESTAMP;
 DECLARE open_date TIMESTAMP;
 DECLARE student_exists INT DEFAULT 0;
 DECLARE v_batch_code VARCHAR(100);
 DECLARE v_academic_year VARCHAR(50);
 DECLARE v_level INT;
 DECLARE v_sem INT;
 DECLARE v_proper_subs TEXT DEFAULT '';
 DECLARE existing_entry_count INT;
 DECLARE sub_cursor CURSOR FOR 
 SELECT COLUMN_NAME 
 FROM INFORMATION_SCHEMA.COLUMNS
 WHERE TABLE_NAME = CONCAT('batch_', p_batch_id, '_students') 
 AND COLUMN_NAME LIKE 'sub_%';
 DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
 SELECT s_id INTO p_s_id
 FROM student
 WHERE user_id = p_user_id;
 IF p_s_id IS NULL THEN
 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student ID not found for the given user_id.';
 END IF;
 SELECT CAST(SUBSTRING_INDEX(batch_ids, ',', -1) AS UNSIGNED) INTO p_batch_id
 FROM student_detail
 WHERE s_id = p_s_id;
 IF p_batch_id IS NULL THEN
 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch ID not found for the student.';
 END IF;
 SET out_batch_id = p_batch_id;
 SELECT batch_code, level, sem, academic_year 
 INTO v_batch_code, v_level, v_sem, v_academic_year
 FROM batch 
 WHERE batch_id = p_batch_id;
 SELECT end_date INTO student_deadline
 FROM batch_time_periods
 WHERE batch_id = p_batch_id AND user_type = '5'; 
 IF NOW() > student_deadline THEN
 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The application deadline for this batch has passed.';
 END IF;
 SELECT application_open INTO open_date
 FROM batch
 WHERE batch_id = p_batch_id; 
 IF NOW() < open_date THEN
 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The application not opened yet.';
 END IF;
 SET @table_name = CONCAT('batch_', p_batch_id, '_students');
 SET @check_table_query = CONCAT('SHOW TABLES LIKE "', @table_name, '"');
 PREPARE stmt FROM @check_table_query;
 EXECUTE stmt;
 DEALLOCATE PREPARE stmt;
 IF FOUND_ROWS() = 0 THEN
 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The batch table does not exist.';
 END IF;
 SET @p_applied_to_exam = NULL;
 SET @student_count = 0;
 SET @check_student_query = CONCAT(
 'SELECT COUNT(*) INTO @student_count FROM ', @table_name, ' WHERE s_id = ', p_s_id
 );
 PREPARE stmt FROM @check_student_query;
 EXECUTE stmt;
 DEALLOCATE PREPARE stmt;
 IF @student_count > 0 THEN
     SET @check_applied_query = CONCAT(
     'SELECT COALESCE(applied_to_exam, "false") INTO @p_applied_to_exam FROM ', @table_name, ' WHERE s_id = ', p_s_id
     );
     PREPARE stmt FROM @check_applied_query;
     EXECUTE stmt;
     DEALLOCATE PREPARE stmt;
     IF @p_applied_to_exam = 'true' THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student already applied.';
         LEAVE ae;
     END IF;
 END IF;
 OPEN sub_cursor;
 subject_loop: LOOP
 FETCH sub_cursor INTO sub_col_name;
 IF done THEN
 LEAVE subject_loop;
 END IF;
 SET current_sub_id = SUBSTRING(sub_col_name, 5);
 IF p_removed_subjects IS NOT NULL AND FIND_IN_SET(current_sub_id, p_removed_subjects) > 0 THEN
 ITERATE subject_loop;
 END IF;
 SET @attendance_query = CONCAT(
 'SELECT COALESCE(', sub_col_name, ', 0) INTO @attendance_value 
 FROM ', @table_name, ' 
 WHERE s_id = ', p_s_id
 );
 PREPARE stmt FROM @attendance_query;
 EXECUTE stmt;
 DEALLOCATE PREPARE stmt;
 IF @attendance_value >= 80 THEN
 SET eligibility_value = 'true';
 ELSE
 SET eligibility_value = 'false';
 END IF;
 SET @insert_query = CONCAT(
 'INSERT IGNORE INTO batch_', p_batch_id, '_sub_', current_sub_id, 
 ' (s_id, eligibility, exam_type) VALUES (', p_s_id, ', "', eligibility_value, '", "P")'
 );
 PREPARE stmt FROM @insert_query;
 EXECUTE stmt;
 DEALLOCATE PREPARE stmt;
 IF v_proper_subs = '' THEN
 SET v_proper_subs = current_sub_id;
 ELSE
 SET v_proper_subs = CONCAT(v_proper_subs, ',', current_sub_id);
 END IF;
 END LOOP;
 CLOSE sub_cursor;
 SET @update_query = CONCAT(
 'UPDATE ', @table_name, ' 
 SET applied_to_exam = "true" 
 WHERE s_id = ', p_s_id
 );
 PREPARE stmt FROM @update_query;
 EXECUTE stmt;
 DEALLOCATE PREPARE stmt;
 SELECT COUNT(*) INTO existing_entry_count
 FROM entry_summary
 WHERE s_id = p_s_id 
 AND academic_year = v_academic_year 
 AND level = v_level 
 AND sem = v_sem;
 IF existing_entry_count > 0 THEN
 UPDATE entry_summary 
 SET proper_subs = v_proper_subs
 WHERE s_id = p_s_id 
 AND academic_year = v_academic_year 
 AND level = v_level 
 AND sem = v_sem;
 ELSE
 INSERT INTO entry_summary (
 s_id, 
 academic_year, 
 level, 
 sem, 
 proper_subs, 
 medical_subs, 
 resit_subs
 ) VALUES (
 p_s_id,
 v_academic_year,
 v_level,
 v_sem,
 v_proper_subs,
 NULL,
 NULL
 );
 END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckForDuplicateDegree`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_deg_id` INT, OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM degree
    WHERE (deg_name = p_deg_name OR short = p_short) AND deg_id != p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckForDuplicateGroup`(IN `p_grp_code` VARCHAR(255), IN `p_grp_id` INT, OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM grp
    WHERE grp_code = p_grp_code AND grp_id != p_grp_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckGroupExist`(IN `p_grp_id` VARCHAR(100), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM grp g 
    WHERE g.grp_id = p_grp_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIfDegreeExists`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM degree
    WHERE deg_name = p_deg_name OR short = p_short;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIfDepartmentExists`(IN `p_d_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM department d
    LEFT JOIN user u ON d.user_id = u.user_id
    WHERE d.d_name = p_d_name OR u.user_name = p_email OR u.email = p_email;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIfFacultyExists`(IN `p_f_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM faculty f
    LEFT JOIN user u ON f.user_id = u.user_id
    WHERE f.f_name = p_f_name OR u.user_name = p_email;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIndexNoExists`(IN `p_index_no` VARCHAR(255), OUT `p_exists` BOOLEAN)
BEGIN
    IF p_index_no = '' THEN
        SELECT FALSE INTO p_exists; 
    ELSE
        SELECT EXISTS (SELECT 1 FROM student_detail WHERE index_num = p_index_no) INTO p_exists;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckPendingMedicalResitRequests`()
BEGIN
    SELECT 
        EXISTS (
            SELECT 1 
            FROM medical_request mr
            JOIN medical_subject ms ON mr.medical_id=ms.medical_id
            WHERE mr.status = '' AND ms.eligibility='true'
        ) AS medical_pending,
        EXISTS (
            SELECT 1 
            FROM resit_request rr
            JOIN resit_subject rs ON rr.resit_id=rs.resit_id
            WHERE rr.status = '' AND rs.eligibility='true'
        ) AS resit_pending;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckSubjectExist`(IN `p_sub_code` VARCHAR(100), IN `p_syl_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM subject s 
    WHERE s.sub_code = p_sub_code AND s.syl_id = p_syl_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckSubjectExistOnBSL`(IN `p_batch_id` INT(11), IN `p_sub_id` INT(11), IN `p_user_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM batch_subject_lecturer bsl 
    JOIN lecturer l
    ON bsl.l_id=l.l_id
    WHERE bsl.batch_id = p_batch_id AND bsl.sub_id = p_sub_id AND l.user_id=p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckSubjectExistOnDepartment`(IN `p_sub_id` INT(11), IN `p_d_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM dep_sub 
    WHERE sub_id = p_sub_id AND d_id=p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckSubjectExistOnFaculty`( IN `p_sub_id` INT(11), IN `p_f_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM grp_sub gs 
    JOIN syl_grp sg ON gs.grp_id = sg.grp_id
    JOIN deg_syl ds ON sg.syl_id = ds.syl_id
    JOIN fac_deg fd ON ds.deg_id = fd.deg_id
    WHERE gs.sub_id = p_sub_id AND fd.f_id=p_f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckSyllabusExist`(IN `p_deg_id` INT(11), IN `p_commenced_year` YEAR, OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM syllabus s
    JOIN deg_syl ds ON s.syl_id = ds.syl_id
    WHERE s.commenced_year = p_commenced_year AND ds.deg_id = p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckUserExists`(IN `p_user_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM user 
    WHERE user_name = p_user_name OR email = p_email;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateBatchStudentsTable`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN



    DECLARE i INT DEFAULT 0;



    DECLARE sub_id INT;



    DECLARE columns_sql TEXT;







    SET columns_sql = 'id INT AUTO_INCREMENT PRIMARY KEY, s_id INT(11) NOT NULL UNIQUE, applied_to_exam VARCHAR(50) DEFAULT "false"';







    WHILE i < JSON_LENGTH(p_subjects) DO



        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', i, '].sub_id')));



        SET columns_sql = CONCAT(columns_sql, ', sub_', sub_id, ' INT NOT NULL DEFAULT 0, sub_', sub_id, '_as INT NOT NULL DEFAULT 0');



        SET i = i + 1;



    END WHILE;







    SET @create_table_sql = CONCAT(



        'CREATE TABLE IF NOT EXISTS batch_', 



        p_batch_id, 



        '_students (', 



        columns_sql, 



        ')'



    );







    PREPARE stmt FROM @create_table_sql;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateBatchSubjectTables`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE create_table_sql TEXT;
    WHILE i < JSON_LENGTH(p_subjects) DO
        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', i, '].sub_id')));
        SET create_table_sql = CONCAT(
            'CREATE TABLE IF NOT EXISTS batch_', 
            p_batch_id, 
            '_sub_', 
            sub_id, 
            ' (
             	id INT AUTO_INCREMENT PRIMARY KEY,
                s_id INT(11) NOT NULL,
                eligibility VARCHAR(50) NOT NULL,
            	exam_type VARCHAR(10) NOT NULL,
            	UNIQUE (s_id)
            )'
        );
        SET @stmt = create_table_sql;
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SET i = i + 1;
    END WHILE;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateDegree`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_levels` VARCHAR(255), IN `p_no_of_sem_per_year` VARCHAR(10), IN `p_status` VARCHAR(50), OUT `p_deg_id` INT)
BEGIN
    INSERT INTO degree(deg_name, short, levels, no_of_sem_per_year, status)
    VALUES (p_deg_name, p_short, p_levels, p_no_of_sem_per_year, p_status);
    SET p_deg_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateDepartment`(IN `p_d_name` VARCHAR(255), IN `p_user_id` INT, IN `p_contact_no` VARCHAR(50), IN `p_status` VARCHAR(50), OUT `p_d_id` INT)
BEGIN
    INSERT INTO department(d_name, user_id, contact_no, status)
    VALUES (p_d_name, p_user_id, p_contact_no, p_status);
    SET p_d_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateDepartmentUser`(IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), OUT `p_user_id` INT)
BEGIN
    INSERT INTO user(user_name, email, password, role_id)
    VALUES (p_email, p_email, p_password, '3');
    SET p_user_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateFaculty`(IN `p_f_name` VARCHAR(255), IN `p_user_id` INT, IN `p_contact_no` VARCHAR(50), IN `p_status` VARCHAR(50))
BEGIN
    INSERT INTO faculty (f_name, user_id, contact_no, status)
    VALUES (p_f_name, p_user_id, p_contact_no, p_status);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateFacultyUser`(IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), OUT `p_user_id` INT)
BEGIN
    INSERT INTO user(user_name, email, password, role_id)
    VALUES (p_email, p_email, p_password, '2');
    SET p_user_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateGroup`(IN `p_grp_code` VARCHAR(255), IN `p_level` INT(11), IN `p_sem_no` INT(11), IN `p_status` VARCHAR(50), IN `p_custom_suffix` VARCHAR(250), IN `p_course_title` VARCHAR(500), OUT `p_grp_id` INT)
BEGIN
    INSERT INTO grp(grp_code, level, sem_no, status, custom_suffix, course_title)
    VALUES (p_grp_code, p_level, p_sem_no, p_status, p_custom_suffix, p_course_title);
    SET p_grp_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateNewBatchSubjectTables`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE create_table_sql TEXT;
    WHILE i < JSON_LENGTH(p_subjects) DO
        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', i, '].sub_id')));
        SET create_table_sql = CONCAT(
            'CREATE TABLE IF NOT EXISTS batch_', 
            p_batch_id, 
            '_sub_', 
            sub_id, 
            ' (
                id INT AUTO_INCREMENT PRIMARY KEY,
                s_id INT(11) NOT NULL,
                eligibility VARCHAR(50) NOT NULL,
                exam_type VARCHAR(10) NOT NULL,
                UNIQUE (s_id)
            )'
        );
        SET @stmt = create_table_sql;
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SET i = i + 1;
    END WHILE;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateSubject`(IN `p_sub_code` VARCHAR(100), IN `p_sub_name` VARCHAR(150), IN `p_sem_no` INT, IN `p_syl_id` INT, IN `p_d_id` INT, IN `p_level` INT, IN `p_assignment_min_mark` INT, IN `p_status` VARCHAR(50), IN `p_pass_grade` INT) NOT DETERMINISTIC CONTAINS SQL SQL SECURITY DEFINER BEGIN DECLARE p_sub_id INT(11); INSERT INTO subject (sub_code, sub_name, sem_no, syl_id, level,assignment_min_mark, status, pass_grade) VALUES (p_sub_code, p_sub_name, p_sem_no, p_syl_id, p_level,p_assignment_min_mark, p_status, p_pass_grade); SET p_sub_id = LAST_INSERT_ID(); INSERT INTO dep_sub (d_id, sub_id) VALUES (p_d_id, p_sub_id); END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateSyllabus`(IN `p_deg_id` INT, IN `p_commenced_year` YEAR, IN `p_expired_year` VARCHAR(10), IN `p_status` VARCHAR(50))
BEGIN
	DECLARE v_syl_id INT;
    INSERT INTO syllabus(commenced_year, expired_year, status)
    VALUES (p_commenced_year, p_expired_year, p_status);
    SET v_syl_id = LAST_INSERT_ID();
    INSERT INTO deg_syl(deg_id, syl_id)
    VALUES (p_deg_id, v_syl_id);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateVenue`(IN `p_short_code` VARCHAR(100), IN `p_description` VARCHAR(500), IN `p_seat_count` INT)
BEGIN
    INSERT INTO venue (short_code, description, seat_count)
    VALUES (p_short_code, p_description, p_seat_count);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteBatchSubjectEntries`(IN `p_batch_id` INT)
BEGIN
    DECLARE sub_id INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cursor_subjects CURSOR FOR 
        SELECT sub_id 
        FROM batch_subject_lecturer 
        WHERE batch_id = p_batch_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    START TRANSACTION;
    OPEN cursor_subjects;
    subject_loop: LOOP
        FETCH cursor_subjects INTO sub_id;
        IF done THEN
            LEAVE subject_loop;
        END IF;
        SET @table_name = CONCAT('batch_', p_batch_id, '_sub_', sub_id);
        SET @delete_query = CONCAT('DELETE FROM ', @table_name);
        PREPARE delete_stmt FROM @delete_query;
        EXECUTE delete_stmt;
        DEALLOCATE PREPARE delete_stmt;
    END LOOP;
    CLOSE cursor_subjects;
    COMMIT;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteBatchSubjectLecturerRows`(IN `p_batch_id` INT)
BEGIN
    DELETE FROM batch_subject_lecturer WHERE batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteGrpSubjects`(IN `p_grp_id` INT)
BEGIN
    DELETE FROM 
    grp_sub
    WHERE grp_id = p_grp_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DropOldBatchTablesAndColumns`(IN `p_batch_id` INT, IN `p_old_subjects` JSON)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE drop_table_sql TEXT;
    DECLARE drop_column_sql TEXT;
    SET drop_column_sql = CONCAT('ALTER TABLE batch_', p_batch_id, '_students ');
    WHILE i < JSON_LENGTH(p_old_subjects) DO
        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_old_subjects, CONCAT('$[', i, '].sub_id')));
        SET drop_table_sql = CONCAT('DROP TABLE IF EXISTS batch_', p_batch_id, '_sub_', sub_id);
        SET @stmt = drop_table_sql;
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        IF i > 0 THEN
            SET drop_column_sql = CONCAT(drop_column_sql, ',');
        END IF;
        SET drop_column_sql = CONCAT(drop_column_sql, ' DROP COLUMN sub_', sub_id);
        SET i = i + 1;
    END WHILE;
    SET @stmt = drop_column_sql;
    PREPARE stmt FROM @stmt;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `FetchStudentEligibilityByBatchIdAndSId`(IN `p_batch_id` INT, IN `p_s_id` INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE temp_sub_id INT;
    DECLARE cur CURSOR FOR
        SELECT sub_id
        FROM batch_subject_lecturer
        WHERE batch_id = p_batch_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_eligibility_results (
        sub_id INT,
        eligibility VARCHAR(50)
    );
    OPEN cur;
    subject_loop: LOOP
        FETCH cur INTO temp_sub_id;
        IF done THEN
            LEAVE subject_loop;
        END IF;
        SET @query = CONCAT(
            'INSERT INTO temp_eligibility_results (sub_id, eligibility) ',
            'SELECT ', temp_sub_id, ' AS sub_id, COALESCE(bsub.eligibility, "N/A") ',
            'FROM batch_', p_batch_id, '_sub_', temp_sub_id, ' bsub ',
            'WHERE bsub.s_id = ', p_s_id
        );
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;
    CLOSE cur;
    SELECT * FROM temp_eligibility_results;
    DROP TEMPORARY TABLE temp_eligibility_results;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `FetchStudentsWithSubjects`(IN `p_batch_id` INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE temp_sub_id INT;
    DECLARE cur CURSOR FOR
        SELECT sub_id
        FROM subject
        WHERE sub_id IN (
            SELECT sub_id
            FROM batch_subject_lecturer
            WHERE batch_id = p_batch_id
        );
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_results (
        s_id INT,
        name VARCHAR(255),
        index_num VARCHAR(255),
        user_name VARCHAR(255),
        exam_type VARCHAR(50),
        sub_id INT,
        eligibility VARCHAR(50)
    );
    OPEN cur;
    subject_loop: LOOP
        FETCH cur INTO temp_sub_id;
        IF done THEN
            LEAVE subject_loop;
        END IF;
        SET @query = CONCAT(
            'INSERT INTO temp_results (s_id, name, index_num, user_name, exam_type, sub_id, eligibility) ',
            'SELECT sd.s_id, sd.name, sd.index_num, u.user_name, bsub.exam_type, ', temp_sub_id, ' AS sub_id, bsub.eligibility ',
            'FROM batch_', p_batch_id, '_sub_', temp_sub_id, ' bsub ',
            'JOIN student_detail sd ON bsub.s_id = sd.s_id ',
            'JOIN student st ON sd.s_id = st.s_id ',
            'JOIN user u ON st.user_id = u.user_id'
        );
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;
    CLOSE cur;
    SELECT * FROM temp_results ORDER BY index_num ASC;
    DROP TEMPORARY TABLE temp_results;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `FetchStudentWithSubjectsByUserId`(IN `batch_id` INT, IN `user_id` INT)
BEGIN
  DECLARE dynamic_students_table VARCHAR(255);
  DECLARE query_students TEXT;
  DECLARE query_subjects TEXT;
  DECLARE uid INT;
  DECLARE bid INT;
  SET uid = user_id;
  SET bid = batch_id;
  SET dynamic_students_table = CONCAT('batch_', batch_id, '_students');
  SET @query_students = CONCAT(
    'SELECT sd.s_id, sd.name, u.user_name, sd.index_num ',
    'FROM student_detail sd ',
    'JOIN student s ON s.s_id = sd.s_id ',
    'JOIN user u ON u.user_id = s.user_id ',
    'WHERE u.user_id = ?'
  );
  PREPARE stmt FROM @query_students;
  EXECUTE stmt USING @uid;
  DEALLOCATE PREPARE stmt;
  SET query_subjects = CONCAT(
    'SELECT bsl.sub_id, c.sub_name, c.sub_code ',
    'FROM batch_subject_lecturer bsl ',
    'JOIN subject c ON c.sub_id = bsl.sub_id ',
    'LEFT JOIN ', dynamic_students_table, ' bs ON bs.s_id = ? ',
    'WHERE bsl.batch_id = ?'
  );
  SET @stmt3 = query_subjects;
  PREPARE stmt3 FROM @stmt3;
  EXECUTE stmt3 USING @uid, @bid;
  DEALLOCATE PREPARE stmt3;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `FillProperSummary`(IN p_batch_id INT)
BEGIN
    DECLARE v_batch_code VARCHAR(100);
    DECLARE v_description VARCHAR(500);
    DECLARE v_deg_id INT;
    DECLARE v_no_of_sem_per_year VARCHAR(10);
    DECLARE v_academic_year VARCHAR(50);
    DECLARE v_sem VARCHAR(10);
    SELECT batch_code, deg_id, description 
    INTO v_batch_code, v_deg_id, v_description
    FROM batch 
    WHERE batch_id = p_batch_id;
    SELECT no_of_sem_per_year 
    INTO v_no_of_sem_per_year
    FROM degree 
    WHERE deg_id = v_deg_id;
    SET v_academic_year = LEFT(v_batch_code, 4);
    IF CAST(v_no_of_sem_per_year AS UNSIGNED) < 10 THEN
        SET v_sem = RIGHT(v_batch_code, 1);
    ELSE
        SET v_sem = RIGHT(v_batch_code, 2);
    END IF;
    SET @insert_query = CONCAT('
        INSERT INTO entry_summary (s_id, academic_year, sem, proper_subs, medical_subs, resit_subs)
        SELECT 
            s.s_id, 
            ''', v_academic_year, ''', 
            ''', v_sem, ''', 
            ''', v_description, ''',
            '''', -- Empty medical_subs
            ''''  -- Empty resit_subs
        FROM 
            batch_', p_batch_id, '_students s
        WHERE 
            NOT EXISTS (
                SELECT 1 
                FROM entry_summary e
                WHERE e.s_id = s.s_id 
                AND e.academic_year = ''', v_academic_year, '''
                AND e.sem = ''', v_sem, '''
            )
    ');
    PREPARE stmt FROM @insert_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SET @update_query = CONCAT('
        UPDATE entry_summary e
        JOIN batch_', p_batch_id, '_students s ON e.s_id = s.s_id
        SET e.proper_subs = ''', v_description, '''
        WHERE e.academic_year = ''', v_academic_year, '''
        AND e.sem = ''', v_sem, '''
    ');
    PREPARE stmt FROM @update_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerateIndexNumbers`(IN `p_batch_id` INT, IN `p_course` VARCHAR(50), IN `p_batch` VARCHAR(50), IN `p_startsFrom` INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE student_s_id INT;
    DECLARE student_user_name VARCHAR(250);
    DECLARE index_counter INT DEFAULT p_startsFrom;
    DECLARE cursor_students CURSOR FOR SELECT s_id, user_name FROM temp_students;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_students (
        s_id INT,
        user_name VARCHAR(250)
    );
    SET @query = CONCAT(
        'INSERT INTO temp_students (s_id, user_name) ',
        'SELECT sd.s_id, u.user_name ',
        'FROM batch_', p_batch_id, '_students bs ',
        'JOIN student_detail sd ON bs.s_id = sd.s_id ',
        'JOIN student st ON sd.s_id = st.s_id ',
        'JOIN user u ON st.user_id = u.user_id ',
        'WHERE bs.applied_to_exam = "true" AND (sd.index_num IS NULL OR sd.index_num = "") ',
        'ORDER BY u.user_name ASC'
    );
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    OPEN cursor_students;
    subject_loop: LOOP
        FETCH cursor_students INTO student_s_id, student_user_name;
        IF done THEN
            LEAVE subject_loop;
        END IF;
        SET @new_index = CONCAT(p_course, " ", p_batch, LPAD(index_counter, 3, '0'));
        UPDATE student_detail
        SET index_num = @new_index
        WHERE s_id = student_s_id;
        SET index_counter = index_counter + 1;
    END LOOP;
    CLOSE cursor_students;
    SELECT sd.s_id, sd.index_num, u.user_name
    FROM student_detail sd
    JOIN student st ON sd.s_id = st.s_id
    JOIN user u ON st.user_id = u.user_id
    WHERE sd.index_num LIKE CONCAT(p_course, " ", p_batch, "%")
    AND sd.index_num IS NOT NULL AND sd.index_num != ""
    ORDER BY sd.index_num ASC;
    DROP TEMPORARY TABLE IF EXISTS temp_students;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveBatches`(IN `p_deg_id` INT)
BEGIN
    SET @query = CONCAT(
        'SELECT b.batch_id, b.batch_code, g.course_title, b.level, b.sem, b.academic_year FROM batch b JOIN grp g ON b.grp_id = g.grp_id WHERE b.deg_id = ',p_deg_id,'  AND b.status = ''true'' ORDER BY b.batch_code DESC'
    );
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveBatchesOfDegWithinDeadline`(IN `p_deg_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE sql_query TEXT;
        SET sql_query = CONCAT(
            'SELECT b.batch_id, b.batch_code, b.academic_year, b.level, b.sem, g.course_title 
            FROM batch b 
            INNER JOIN grp g ON b.grp_id = g.grp_id 
            INNER JOIN batch_time_periods btp ON b.batch_id = btp.batch_id 
            WHERE b.deg_id = ', p_deg_id, ' 
            AND b.status = ''true'' 
            AND btp.user_type = ''', p_role_id, ''' 
            AND EXISTS (
                SELECT 1 
                FROM batch_time_periods 
                WHERE batch_time_periods.batch_id = b.batch_id 
                AND batch_time_periods.user_type = ''3'' 
                AND batch_time_periods.end_date < NOW()
            ) 
            ORDER BY b.batch_code DESC'
        );
        SET @stmt = sql_query;
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveBatchesOfDep`(IN `p_d_id` INT)
BEGIN
    DECLARE sql_query TEXT;
        SET sql_query = CONCAT(
            'SELECT b.batch_id, b.batch_code, b.academic_year, b.level, b.sem, g.course_title 
            FROM batch b 
            INNER JOIN grp_sub gs ON b.grp_id = gs.grp_id 
            INNER JOIN dep_sub ds ON gs.sub_id = ds.sub_id 
            INNER JOIN grp g ON b.grp_id = g.grp_id 
            INNER JOIN batch_time_periods btp ON b.batch_id = btp.batch_id 
            WHERE ds.d_id = ', p_d_id, ' 
            AND b.status = ''true'' 
            AND EXISTS (
                SELECT 1 
                FROM batch_time_periods 
                WHERE batch_time_periods.batch_id = b.batch_id 
                AND batch_time_periods.user_type = ''4'' 
                AND batch_time_periods.end_date < NOW()
            ) 
            GROUP by b.batch_id ORDER BY b.batch_code DESC'
        );
        SET @stmt = sql_query;
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveBatchesOfDepWithinDeadline`(IN `p_d_id` INT)
BEGIN
    DECLARE sql_query TEXT;
        SET sql_query = CONCAT(
            'SELECT b.batch_id, b.batch_code, b.academic_year, b.level, b.sem, g.course_title 
            FROM batch b 
            INNER JOIN grp_sub gs ON b.grp_id = gs.grp_id 
            INNER JOIN dep_sub ds ON gs.sub_id = ds.sub_id 
            INNER JOIN grp g ON b.grp_id = g.grp_id 
            INNER JOIN batch_time_periods btp ON b.batch_id = btp.batch_id 
            WHERE ds.d_id = ', p_d_id, ' 
            AND b.status = ''true'' 
            AND btp.user_type = ''3'' 
            AND EXISTS (
                SELECT 1 
                FROM batch_time_periods 
                WHERE batch_time_periods.batch_id = b.batch_id 
                AND batch_time_periods.user_type = ''4'' 
                AND batch_time_periods.end_date < NOW()
            ) 
            GROUP by b.batch_id ORDER BY b.batch_code DESC'
        );
        SET @stmt = sql_query;
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveDegrees`(`department_ids` TEXT)
BEGIN
    SET @query = CONCAT('SELECT deg_id, short FROM dep_deg WHERE d_id IN (', department_ids, ') AND status = ''true''');
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveDegreesInFaculty`(IN `p_f_id` INT)
BEGIN
    SELECT 
        deg.deg_id,
        deg.deg_name,
        deg.levels,
        deg.short
    FROM degree deg
    LEFT JOIN fac_deg fd ON deg.deg_id = fd.deg_id
    WHERE fd.f_id = p_f_id AND deg.status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveDepartmentsWithDegreesCount`(IN `p_f_id` INT)
BEGIN
    SELECT 
        d.d_id,
        d.d_name,
        COUNT(dd.deg_id) AS degrees_count
    FROM department d
    LEFT JOIN dep_deg dd ON d.d_id = dd.d_id
    LEFT JOIN fac_dep fd ON d.d_id = fd.d_id
    WHERE fd.f_id = p_f_id AND d.status = 'true'
    GROUP BY d.d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetActiveFacultiesWithDepartmentsCount`()
BEGIN
    SELECT 
        f.f_id,
        f.f_name,
        COUNT(fd.d_id) AS departments_count
    FROM faculty f
    LEFT JOIN fac_dep fd ON f.f_id = fd.f_id
    WHERE f.status = 'true'
    GROUP BY f.f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAdminDetails`(IN `p_user_id` INT)
BEGIN
    SELECT 
        email, user_name, role_id
    FROM 
        user
    WHERE 
        user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAdminSummary`()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM batch) AS batch_count,
        (SELECT COUNT(*) FROM subject) AS subject_count,
        (SELECT COUNT(*) FROM degree) AS degree_count,
        (SELECT COUNT(*) FROM department) AS department_count,
        (SELECT COUNT(*) FROM faculty) AS faculty_count,
        (SELECT COUNT(*) FROM student) AS student_count,
        (SELECT COUNT(*) FROM lecturer) AS lecturer_count;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllActiveBatchesProgesses`()
BEGIN
    SELECT 
        b.batch_id, 
        b.batch_code,
        b.application_open,
        GROUP_CONCAT(CONCAT_WS(' ; ', btp.user_type, btp.end_date) ORDER BY btp.end_date DESC SEPARATOR ', ') AS btp_data, 
        a.id AS admission_id, 
        att.id AS attendance_id
    FROM batch b
    LEFT JOIN batch_time_periods btp ON b.batch_id = btp.batch_id
    LEFT JOIN admission a ON b.batch_id = a.batch_id
    LEFT JOIN attendance att ON b.batch_id = att.batch_id
    WHERE b.status = 'true'
    GROUP BY b.batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllActiveLecturers`()
BEGIN
    SELECT 
        ld.name, 
        u.email, 
        ld.contact_no, 
        ld.status,
        ld.l_id 
    FROM 
        lecturer l
    INNER JOIN 
        lecturer_detail ld ON l.l_id = ld.l_id
    INNER JOIN 
        user u ON l.user_id = u.user_id
    WHERE 
        ld.status = 'true';
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllBatchDetails`()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE batchId INT;
    DECLARE batchCode VARCHAR(100);
    DECLARE academicYear VARCHAR(50);
    DECLARE levelNo INT(11);
    DECLARE semNo INT(11);    
    DECLARE shortCode VARCHAR(50);
    DECLARE degName VARCHAR(500);
    DECLARE deanEndDate TIMESTAMP;
    DECLARE batchStatus VARCHAR(50);
    DECLARE studentCount INT DEFAULT 0; 
    DECLARE batch_cursor CURSOR FOR 
        SELECT batch_id, batch_code, status, academic_year, level, sem FROM batch;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    DROP TEMPORARY TABLE IF EXISTS temp_batch_details;
    CREATE TEMPORARY TABLE temp_batch_details (
        batch_id INT,
        batch_code VARCHAR(100),
        academic_year VARCHAR(50),
        level INT(11),
        sem INT(11),
        degree_name VARCHAR(500),
        dean_end_date TIMESTAMP,
        student_count INT,
        batch_status VARCHAR(50)
    );
    OPEN batch_cursor;
    read_loop: LOOP
        FETCH batch_cursor INTO batchId, batchCode, batchStatus, academicYear, levelNo, semNo;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SELECT deg_name INTO degName
        FROM degree d
        JOIN batch b ON d.deg_id = b.deg_id
        WHERE b.batch_id = batchId
        LIMIT 1;
        SELECT end_date INTO deanEndDate
        FROM batch_time_periods
        WHERE batch_id = batchId AND user_type = '2'
        LIMIT 1;
        SET @query = CONCAT('SELECT COUNT(*) INTO @studentCount FROM batch_', batchId, '_students');
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        INSERT INTO temp_batch_details (batch_id, batch_code, academic_year, level, sem, degree_name, dean_end_date, student_count, batch_status)
        VALUES (batchId, batchCode, academicYear, levelNo, semNo, degName,deanEndDate, @studentCount, batchStatus);
    END LOOP;
    CLOSE batch_cursor;
    SELECT * FROM temp_batch_details ORDER BY batch_id DESC;
    DROP TEMPORARY TABLE IF EXISTS temp_batch_details;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllBatches`()
BEGIN
    SELECT * FROM batch;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllDegrees`()
BEGIN
    SELECT * 
    FROM degree 
    WHERE status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllDegreesWithDetails`()
BEGIN
    SELECT 
        dg.deg_id,
        dg.deg_name,
        dg.short,
        dg.levels,
        dg.no_of_sem_per_year,
        dg.status,
        f.f_id,
        f.f_name AS faculty_name
    FROM degree dg 
    LEFT JOIN fac_deg fd ON dg.deg_id =fd.deg_id 
    LEFT JOIN faculty f ON fd.f_id = f.f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllDepartments`()
BEGIN
    SELECT * 
    FROM department
    WHERE status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllDepartmentsWithDetails`()
BEGIN
    SELECT 
        d.*, 
        u.user_name AS email, 
        f.f_name AS faculty_name
    FROM department d 
    LEFT JOIN user u ON d.user_id = u.user_id 
    LEFT JOIN fac_dep fd ON d.d_id = fd.d_id 
    LEFT JOIN faculty f ON fd.f_id = f.f_id 
    GROUP BY d.d_id, d.d_name, f.f_name;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllFaculties`()
BEGIN
    SELECT * 
    FROM faculty 
    WHERE status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllFacultiesWithDetails`()
BEGIN
    SELECT 
        f.*, 
        u.user_name AS email, 
        COUNT(DISTINCT fd.d_id) AS department_count, 
        COUNT(DISTINCT fdeg.deg_id) AS degree_count 
    FROM faculty f 
    LEFT JOIN user u ON f.user_id = u.user_id 
    LEFT JOIN fac_dep fd ON f.f_id = fd.f_id 
    LEFT JOIN fac_deg fdeg ON f.f_id = fdeg.f_id 
    GROUP BY f.f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllGroupsWithExtraDetails`()
BEGIN
    SELECT 
        grp.*,
        syllabus.commenced_year
    FROM grp
    JOIN syl_grp ON grp.grp_id = syl_grp.grp_id
    JOIN syllabus ON syl_grp.syl_id = syllabus.syl_id
     ORDER BY syllabus.commenced_year DESC;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllInstructions`()
BEGIN
  SELECT * FROM instruction;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllLecturers`()
BEGIN
    SELECT 
        u.user_id, 
        u.user_name, 
        ld.name, 
        u.email, 
        ld.contact_no, 
        ld.status,
        ld.l_id 
    FROM 
        user u
    INNER JOIN 
        lecturer l ON u.user_id = l.user_id
    INNER JOIN 
        lecturer_detail ld ON l.l_id = ld.l_id
    WHERE 
        u.role_id = 4;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllLevelsInDegree`(IN `p_deg_id` INT)
BEGIN
    SELECT 
        deg.deg_id,
        deg.deg_name,
        deg.levels
    FROM degree deg
    WHERE deg.deg_id = p_deg_id AND deg.status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllPayments`()
BEGIN
  SELECT * FROM payment ORDER BY type;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllStudents`()
BEGIN
    SELECT 
        u.user_id, 
        u.user_name, 
        sd.name, 
        sd.f_id, 
        u.email, 
        sd.status,
        sd.s_id,
        sd.index_num,
        sd.contact_no
    FROM 
        user u
    INNER JOIN 
        student s ON u.user_id = s.user_id
    INNER JOIN 
        student_detail sd ON s.s_id = sd.s_id
    WHERE 
        u.role_id = 5;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllSubjects`()
BEGIN
    SELECT * 
    FROM subject 
    WHERE status = 'true';
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllSubjectsForGroupCreation`(IN `p_syl_id` INT, IN `p_level` INT, IN `p_sem_no` INT)
BEGIN
    SELECT 
        subject.sub_id,
        subject.sub_code,
        subject.sub_name
    FROM subject
    WHERE subject.syl_id = p_syl_id  AND subject.level = p_level AND subject.sem_no = p_sem_no; 
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllSubjectsForLecturer`(IN `p_user_id` INT)
BEGIN
    DECLARE p_l_id INT;
    SELECT l_id INTO p_l_id
    FROM lecturer
    WHERE user_id = p_user_id;
    IF p_l_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lecturer ID not found for the given user ID.';
    END IF;
    SELECT
        c.sub_id,
        c.sub_code,
        c.sub_name,
        bsl.batch_id,
        btp.end_date AS deadline
    FROM
        batch_subject_lecturer bsl
    INNER JOIN
        batch b ON b.batch_id = bsl.batch_id
    INNER JOIN
        subject c ON c.sub_id = bsl.sub_id
    INNER JOIN
        batch_time_periods btp ON btp.batch_id = bsl.batch_id
    WHERE
        bsl.l_id = p_l_id
        AND b.status = 'true'
        AND btp.user_type = '4' 
        AND btp.end_date > NOW() 
        AND b.application_open < NOW(); 
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllSubjectsWithExtraDetails`()
BEGIN
    SELECT 
        subject.*,
        syllabus.commenced_year,
        degree.deg_name AS degree_name,
        department.d_name
    FROM subject
    JOIN syllabus ON subject.syl_id = syllabus.syl_id
    JOIN deg_syl ON subject.syl_id = deg_syl.syl_id
    JOIN degree ON deg_syl.deg_id = degree.deg_id 
    JOIN dep_sub ON subject.sub_id = dep_sub.sub_id
    JOIN department ON dep_sub.d_id = department.d_id ORDER BY syllabus.commenced_year DESC;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllSyllabiWithExtraDetails`()
BEGIN
    SELECT 
        s.*,
        deg.deg_name AS degree_name
    FROM syllabus s
    JOIN deg_syl ds ON s.syl_id = ds.syl_id
    JOIN degree deg ON ds.deg_id = deg.deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAppliedMedicalStudentsByBatchAndSubject`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE p_l_id INT;
    DECLARE batch_status VARCHAR(50);
    DECLARE lecturer_deadline TIMESTAMP;
    SELECT status INTO batch_status
    FROM batch
    WHERE batch_id = p_batch_id;
    IF batch_status != 'true' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';
    END IF;
    IF p_role_id = '4' THEN 
        SELECT l_id INTO p_l_id
        FROM lecturer
        WHERE user_id = p_user_id;
        IF p_l_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
        SELECT COUNT(*)
        INTO @access_count
        FROM batch_subject_lecturer
        WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;
        IF @access_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';
        END IF;
        SELECT end_date INTO lecturer_deadline
        FROM batch_time_periods
        WHERE batch_id = p_batch_id AND user_type = '4'; 
        IF NOW() > lecturer_deadline THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The deadline for accessing this batch has passed.';
        END IF;
    END IF;
IF p_role_id = '3' THEN 
        SELECT d_id INTO p_l_id
        FROM department
        WHERE user_id = p_user_id;
        IF p_l_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
        SELECT COUNT(*)
        INTO @access_count
        FROM dep_sub
        WHERE d_id = p_l_id AND sub_id = p_sub_id;
        IF @access_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';
        END IF;
    END IF;
IF p_role_id = '2' THEN 
        SELECT f_id INTO p_l_id
        FROM faculty
        WHERE user_id = p_user_id;
        IF p_l_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
        SELECT COUNT(*)
        INTO @access_count
        FROM grp_sub gs
        JOIN syl_grp sg ON gs.grp_id = sg.grp_id
        JOIN deg_syl ds ON sg.syl_id = ds.syl_id
        JOIN fac_deg fd ON ds.deg_id = fd.deg_id
        WHERE fd.f_id = p_l_id AND gs.sub_id = p_sub_id;
        IF @access_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';
        END IF;
    END IF;
     SET @batch_students_query = CONCAT(
        'SELECT sd.name, sd.s_id, u.user_name, ms.eligibility ',
        'FROM medical_request mr ',
        'JOIN medical_subject ms ON mr.medical_id = ms.medical_id ',
        'JOIN student_detail sd ON mr.s_id = sd.s_id ',
        'JOIN student st ON st.s_id = sd.s_id ',
        'JOIN user u ON st.user_id = u.user_id ',
        'WHERE mr.batch_id=', p_batch_id, ' AND ms.sub_id=', p_sub_id, ';' 
    );
    PREPARE stmt FROM @batch_students_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAppliedResitStudentsByBatchAndSubject`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE p_l_id INT;
    DECLARE batch_status VARCHAR(50);
    DECLARE lecturer_deadline TIMESTAMP;
    SELECT status INTO batch_status
    FROM batch
    WHERE batch_id = p_batch_id;
    IF batch_status != 'true' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';
    END IF;
    IF p_role_id = '4' THEN 
        SELECT l_id INTO p_l_id
        FROM lecturer
        WHERE user_id = p_user_id;
        IF p_l_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
        SELECT COUNT(*)
        INTO @access_count
        FROM batch_subject_lecturer
        WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;
        IF @access_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';
        END IF;
        SELECT end_date INTO lecturer_deadline
        FROM batch_time_periods
        WHERE batch_id = p_batch_id AND user_type = '4'; 
        IF NOW() > lecturer_deadline THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The deadline for accessing this batch has passed.';
        END IF;
    END IF;
IF p_role_id = '3' THEN 
        SELECT d_id INTO p_l_id
        FROM department
        WHERE user_id = p_user_id;
        IF p_l_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
        SELECT COUNT(*)
        INTO @access_count
        FROM dep_sub
        WHERE d_id = p_l_id AND sub_id = p_sub_id;
        IF @access_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';
        END IF;
    END IF;
IF p_role_id = '2' THEN 
        SELECT f_id INTO p_l_id
        FROM faculty
        WHERE user_id = p_user_id;
        IF p_l_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
        SELECT COUNT(*)
        INTO @access_count
        FROM grp_sub gs
        JOIN syl_grp sg ON gs.grp_id = sg.grp_id
        JOIN deg_syl ds ON sg.syl_id = ds.syl_id
        JOIN fac_deg fd ON ds.deg_id = fd.deg_id
        WHERE fd.f_id = p_l_id AND gs.sub_id = p_sub_id;
        IF @access_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';
        END IF;
    END IF;
     SET @batch_students_query = CONCAT(
        'SELECT sd.name, sd.s_id, u.user_name, rs.attempt_1, rs.attempt_2, rs.attempt_3, rs.eligibility ',
        'FROM resit_request rr ',
        'JOIN resit_subject rs ON rr.resit_id = rs.resit_id ',
        'JOIN student_detail sd ON rr.s_id = sd.s_id ',
        'JOIN student st ON st.s_id = sd.s_id ',
        'JOIN user u ON st.user_id = u.user_id ',
        'WHERE rr.batch_id=', p_batch_id, ' AND rs.sub_id=', p_sub_id, ';' 
    );
    PREPARE stmt FROM @batch_students_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAppliedStudentsByBatchAndSubject`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE p_l_id INT;
    DECLARE batch_status VARCHAR(50);
    DECLARE lecturer_deadline TIMESTAMP;
    SELECT status INTO batch_status
    FROM batch
    WHERE batch_id = p_batch_id;
    IF batch_status != 'true' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';
    END IF;
    IF p_role_id != '1' THEN 
        SELECT l_id INTO p_l_id
        FROM lecturer
        WHERE user_id = p_user_id;
        IF p_l_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
        SELECT COUNT(*)
        INTO @access_count
        FROM batch_subject_lecturer
        WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;
        IF @access_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';
        END IF;
        SELECT end_date INTO lecturer_deadline
        FROM batch_time_periods
        WHERE batch_id = p_batch_id AND user_type = '4'; 
        IF NOW() > lecturer_deadline THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The deadline for accessing this batch has passed.';
        END IF;
    END IF;
    SET @batch_students_query = CONCAT(
        'SELECT sd.name, sd.s_id, u.user_name, bs.sub_', p_sub_id, ' AS attendance, bsub.eligibility ',
        'FROM batch_', p_batch_id, '_students bs ',
        'JOIN batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ON bs.s_id = bsub.s_id ',
        'JOIN student_detail sd ON sd.s_id = bs.s_id ',
        'JOIN student st ON st.s_id = bs.s_id ',
        'JOIN user u ON st.user_id = u.user_id ',
        'WHERE bs.sub_', p_sub_id, ' IS NOT NULL AND bsub.eligibility IS NOT NULL'
    );
    SET @non_batch_students_query = CONCAT(
        'SELECT sd.name, sd.s_id, u.user_name, bsub.exam_type AS attendance, bsub.eligibility ',
        'FROM batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ',
        'JOIN student_detail sd ON sd.s_id = bsub.s_id ',
        'JOIN student st ON st.s_id = bsub.s_id ',
        'JOIN user u ON st.user_id = u.user_id ',
        'WHERE bsub.s_id NOT IN (SELECT s_id FROM batch_', p_batch_id, '_students)'
    );
    SET @final_query = CONCAT('(', @batch_students_query, ') UNION ALL (', @non_batch_students_query, ')');
    PREPARE stmt FROM @final_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAppliedStudentsForSubjectOfFacOrDep`(IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE batch_status VARCHAR(50);
    DECLARE deadline TIMESTAMP;
    DECLARE previous_deadline TIMESTAMP;
    SELECT status INTO batch_status
    FROM batch
    WHERE batch_id = p_batch_id;
    IF batch_status != 'true' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';
    END IF;
    IF p_role_id = '3' THEN 
        SELECT end_date INTO previous_deadline
        FROM batch_time_periods
        WHERE batch_id = p_batch_id AND user_type = '4'; 
        IF NOW() < previous_deadline THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This is not a accessing period of this batch.';
        END IF;
    END IF;
    IF p_role_id = '2' THEN 
        SELECT end_date INTO previous_deadline
        FROM batch_time_periods
        WHERE batch_id = p_batch_id AND user_type = '3'; 
        IF NOW() < previous_deadline THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This is not a accessing period of this batch.';
        END IF;
    END IF;
    SET @batch_students_query = CONCAT(
        'SELECT sd.name, sd.s_id, u.user_name, bs.sub_', p_sub_id, ' AS attendance, bsub.eligibility ',
        'FROM batch_', p_batch_id, '_students bs ',
        'JOIN batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ON bs.s_id = bsub.s_id ',
        'JOIN student_detail sd ON sd.s_id = bs.s_id ',
        'JOIN student st ON st.s_id = bs.s_id ',
        'JOIN user u ON st.user_id = u.user_id ',
        'WHERE bs.sub_', p_sub_id, ' IS NOT NULL AND bsub.eligibility IS NOT NULL'
    );
    SET @non_batch_students_query = CONCAT(
        'SELECT sd.name, sd.s_id, u.user_name, bsub.exam_type AS attendance, bsub.eligibility ',
        'FROM batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ',
        'JOIN student_detail sd ON sd.s_id = bsub.s_id ',
        'JOIN student st ON st.s_id = bsub.s_id ',
        'JOIN user u ON st.user_id = u.user_id ',
        'WHERE bsub.s_id NOT IN (SELECT s_id FROM batch_', p_batch_id, '_students)'
    );
    SET @final_query = CONCAT('(', @batch_students_query, ') UNION ALL (', @non_batch_students_query, ')');
    PREPARE stmt FROM @final_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchAdmissionDetails`(IN `p_batch_id` INT)
BEGIN
    SELECT 
        id, 
        batch_id, 
        generated_date, 
        subject_list, 
        exam_date, 
        description, 
        instructions,
        provider
    FROM 
        admission
    WHERE 
        batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchApprovalAndDeadline`(IN `p_batch_id` INT, IN `p_role_id` INT)
BEGIN
    DECLARE v_user_type VARCHAR(10);
    DECLARE v_accepted_field VARCHAR(50);
    IF p_role_id = 3 THEN
        SET v_user_type = '3';
        SELECT 
            b.hod_accepted AS accepted_status,
            bt.end_date
        FROM batch_time_periods bt
        JOIN batch b ON b.batch_id = bt.batch_id
        WHERE bt.batch_id = p_batch_id AND bt.user_type = v_user_type
        LIMIT 1;
    ELSEIF p_role_id = 2 THEN
        SET v_user_type = '2';
        SELECT 
            b.dean_accepted AS accepted_status,
            bt.end_date
        FROM batch_time_periods bt
        JOIN batch b ON b.batch_id = bt.batch_id
        WHERE bt.batch_id = p_batch_id AND bt.user_type = v_user_type
        LIMIT 1;
    ELSEIF p_role_id = 1 THEN
        SELECT 
            admin_end
        FROM batch
        WHERE batch_id = p_batch_id
        LIMIT 1;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchCount`()
BEGIN
    SELECT COUNT(*) AS batch_count FROM batch;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchDetails`(IN `p_batch_id` INT)
BEGIN
    SELECT * FROM batch WHERE batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchDynamicTablesData`(IN `p_batch_id` INT, IN `p_sub_ids` VARCHAR(255))
BEGIN
    DECLARE current_pos INT DEFAULT 1;
    DECLARE comma_pos INT;
    DECLARE current_sub_id VARCHAR(10);
    DECLARE dynamic_sql TEXT;
    DECLARE select_parts TEXT DEFAULT '';
    DECLARE from_part TEXT DEFAULT '';
    DECLARE join_parts TEXT DEFAULT '';
    DECLARE union_part TEXT DEFAULT '';
    SET select_parts = 'SELECT all_s_ids.s_id, sd.name, sd.index_num, u.user_name';
    sub_parsing: LOOP
        SET comma_pos = LOCATE(',', p_sub_ids, current_pos);
        IF comma_pos > 0 THEN
            SET current_sub_id = SUBSTRING(p_sub_ids, current_pos, comma_pos - current_pos);
            SET current_pos = comma_pos + 1;
        ELSE
            SET current_sub_id = SUBSTRING(p_sub_ids, current_pos);
            IF LENGTH(current_sub_id) = 0 THEN
                LEAVE sub_parsing;
            END IF;
        END IF;
        SET current_sub_id = TRIM(current_sub_id);
        SET select_parts = CONCAT(select_parts, 
                           ', IFNULL(t', current_sub_id, '.eligibility, "") AS sub_', current_sub_id, '_eligibility',
                           ', IFNULL(t', current_sub_id, '.exam_type, "") AS sub_', current_sub_id, '_exam_type');
        IF LENGTH(union_part) > 0 THEN
            SET union_part = CONCAT(union_part, ' UNION SELECT s_id FROM batch_', p_batch_id, '_sub_', current_sub_id);
        ELSE
            SET union_part = CONCAT('SELECT s_id FROM batch_', p_batch_id, '_sub_', current_sub_id);
        END IF;
        SET join_parts = CONCAT(join_parts, 
                         ' LEFT JOIN batch_', p_batch_id, '_sub_', current_sub_id, ' AS t', current_sub_id, 
                         ' ON all_s_ids.s_id = t', current_sub_id, '.s_id');
        IF comma_pos = 0 THEN
            LEAVE sub_parsing;
        END IF;
    END LOOP;
    SET from_part = CONCAT('FROM (SELECT DISTINCT s_id FROM (', union_part, ') AS union_result) AS all_s_ids',
                          ' LEFT JOIN student_detail sd ON all_s_ids.s_id = sd.s_id',
                          ' LEFT JOIN student s ON all_s_ids.s_id = s.s_id',
                          ' LEFT JOIN user u ON s.user_id = u.user_id');
    SET dynamic_sql = CONCAT(select_parts, ' ', from_part, ' ', join_parts);
    SET @sql = dynamic_sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchesByFacultyId`(IN `p_f_id` INT)
BEGIN
    SELECT 
        b.batch_id, 
        b.batch_code, 
        b.academic_year, 
        b.level, 
        b.admin_end,
        b.sem, 
        d.deg_name,
        g.course_title,
        d.short,
        btp.end_date
    FROM 
        fac_deg fd
    JOIN 
        degree d ON fd.deg_id = d.deg_id
    JOIN 
        batch b ON b.deg_id = d.deg_id
    JOIN 
        grp g ON b.grp_id = g.grp_id
    LEFT JOIN
        batch_time_periods btp 
        ON b.batch_id = btp.batch_id 
        AND btp.user_type = '2'  
    WHERE 
        fd.f_id = p_f_id 
        AND b.status = 'true'
    ORDER BY 
        LENGTH(d.short);  
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchFullDetails`(IN `p_batch_id` INT)
BEGIN
    DECLARE query TEXT;
    SET query = CONCAT(
    'SELECT b.batch_id, b.batch_code, b.academic_year, b.level, b.sem, g.course_title, fac.f_name, a.exam_date ',
    'FROM batch b ',
    'JOIN grp g ON b.grp_id = g.grp_id ',
    'JOIN fac_deg fd ON b.deg_id = fd.deg_id ',
    'JOIN faculty fac ON fd.f_id = fac.f_id ',
    'LEFT JOIN attendance a ON b.batch_id = a.batch_id ',
    'WHERE b.batch_id = ', p_batch_id
);
    SET @stmt = query;
    PREPARE stmt FROM @stmt;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBatchOpenDate`(IN `p_batch_id` INT)
BEGIN
    SELECT
        application_open, payment_end, admin_end
    FROM
        batch
    WHERE
        batch_id = p_batch_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDeadlinesForBatch`(IN `p_batch_id` INT)
BEGIN
    SELECT
        btp.user_type,
        btp.end_date AS deadline,
        b.admin_end
    FROM
        batch_time_periods btp
    INNER JOIN
        batch b ON b.batch_id = btp.batch_id
    WHERE
        b.status = 'true'
        AND b.batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegFacDetails`(IN `p_deg_id` INT)
BEGIN
    SELECT 
        d.deg_id, 
        fd.f_id 
    FROM 
        degree d
    INNER JOIN 
        fac_deg fd ON d.deg_id = fd.deg_id
    WHERE 
        d.deg_id = p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegreeById`(IN `p_deg_id` INT)
BEGIN
    SELECT 
        dg.*,
        f.f_id
    FROM degree dg 
    LEFT JOIN fac_deg fd ON dg.deg_id = fd.deg_id 
    LEFT JOIN faculty f ON fd.f_id = f.f_id
    WHERE dg.deg_id = p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegreeByShort`(IN `p_short` VARCHAR(50))
BEGIN
    SELECT deg_name 
    FROM degree 
    WHERE short = p_short;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegreeCount`(OUT `p_degree_count` INT)
BEGIN
    SELECT COUNT(*) INTO p_degree_count
    FROM degree;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegreeCountByDepartment`(IN `p_d_id` INT, OUT `p_degree_count` INT)
BEGIN
    SELECT COUNT(DISTINCT deg_id) INTO p_degree_count
    FROM dep_deg
    WHERE d_id = p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegreeCountByLevel`(IN `p_levels` VARCHAR(255), OUT `p_degree_count` INT)
BEGIN
    SELECT COUNT(*) INTO p_degree_count
    FROM degree
    WHERE levels = p_levels;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegreeDetailsByDegid`(IN `p_deg_id` INT, OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM degree
    WHERE deg_id = p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDegreesByFacultyId`(IN `p_f_id` INT)
BEGIN
    SELECT 
        degree.* 
    FROM degree 
    INNER JOIN fac_deg ON degree.deg_id = fac_deg.deg_id 
    WHERE fac_deg.f_id = p_f_id 
      AND degree.status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentById`(IN `p_d_id` INT)
BEGIN
    SELECT 
        d.*, 
        fd.f_id, 
        u.user_name AS email 
    FROM department d 
    INNER JOIN fac_dep fd ON d.d_id = fd.d_id 
    LEFT JOIN user u ON u.user_id = d.user_id 
    WHERE d.d_id = p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentCount`(OUT `p_department_count` INT)
BEGIN
    SELECT COUNT(*) INTO p_department_count
    FROM department;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentCountByFaculty`(IN `p_f_id` INT, OUT `p_department_count` INT)
BEGIN
    SELECT COUNT(DISTINCT d_id) INTO p_department_count
    FROM fac_dep
    WHERE f_id = p_f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentDetails`(IN `p_user_id` INT)
BEGIN
    SELECT 
        u.email, u.user_name, d.d_name AS name, u.role_id
    FROM 
        user u
    INNER JOIN 
        department d ON u.user_id = d.user_id
    WHERE 
        u.user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentDetailsByDid`(IN `p_d_id` INT)
BEGIN
    SELECT d.d_id, d.user_id
    FROM department d
    WHERE d.d_id = p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentsByFacultyId`(IN `p_f_id` INT)
BEGIN
    SELECT 
        department.* 
    FROM department 
    INNER JOIN fac_dep ON department.d_id = fac_dep.d_id 
    WHERE fac_dep.f_id = p_f_id 
      AND department.status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDynamicTableData`(IN `batch_id` INT, IN `sub_id` INT)
BEGIN
    SET @query = CONCAT(
        'SELECT s_id, exam_type, eligibility ',
        'FROM batch_', batch_id, '_sub_', sub_id
    );
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEligibleMedicalBatches`(IN `p_user_id` INT)
BEGIN
    DECLARE v_s_id INT;
    DECLARE v_syl_id INT;
    DECLARE v_batch_ids TEXT;
    DECLARE v_last_batch_id INT;
    DECLARE v_level INT;
    SELECT s_id INTO v_s_id FROM student WHERE user_id = p_user_id;
    SELECT batch_ids, syl_id INTO v_batch_ids, v_syl_id FROM student_detail WHERE s_id = v_s_id;
    IF v_batch_ids IS NULL OR v_batch_ids = '' THEN
        SELECT 
    b.batch_id,
    b.batch_code,
    b.academic_year,
    b.level,
    b.sem,
    b.application_open,
    g.course_title,
    CASE WHEN a.batch_id IS NOT NULL THEN 'true' ELSE 'false' END AS admission_ready,
    bt5.end_date AS deadline,         
    bt2.end_date AS dean_end,             
    CASE
        WHEN mr.s_id IS NOT NULL AND mr.status = 'true' AND a.batch_id IS NOT NULL THEN 'done'
        WHEN mr.s_id IS NOT NULL AND mr.status = 'true' AND a.batch_id IS NULL THEN 'pending'
        WHEN mr.s_id IS NOT NULL AND mr.reference != '' AND mr.status = '' THEN 'pending'
        WHEN mr.s_id IS NOT NULL AND mr.reference = '' AND mr.status = '' AND NOW() > bt2.end_date AND NOW() < b.payment_end THEN 'payment pending'
        WHEN mr.s_id IS NOT NULL AND NOW() > b.application_open AND NOW() < bt2.end_date THEN 'processing'
        WHEN mr.s_id IS NOT NULL AND (mr.status = 'false' OR (mr.reference = '' AND NOW() > b.payment_end)) THEN 'expired'
        ELSE 'active'
    END AS medical_status
FROM batch b
LEFT JOIN medical_request mr ON mr.batch_id = b.batch_id AND mr.s_id = v_s_id
LEFT JOIN admission a ON a.batch_id = b.batch_id
JOIN grp g ON b.grp_id = g.grp_id 
JOIN batch_time_periods bt5 ON bt5.batch_id = b.batch_id AND bt5.user_type = '5' 
LEFT JOIN batch_time_periods bt2 ON bt2.batch_id = b.batch_id AND bt2.user_type = '2'  
WHERE b.syl_id = v_syl_id 
  AND b.status = 'true'
  AND (
    NOW() <= bt5.end_date
    OR mr.medical_id IS NOT NULL 
) ORDER BY b.batch_id DESC;
    ELSE
        SET v_last_batch_id = CAST(SUBSTRING_INDEX(v_batch_ids, ',', -1) AS UNSIGNED);
        SELECT level, status INTO v_level, @last_batch_status FROM batch WHERE batch_id = v_last_batch_id;
        SELECT 
    b.batch_id,
    b.batch_code,
    b.academic_year,
    b.level,
    b.sem,
    b.application_open,
    g.course_title,
    CASE WHEN a.batch_id IS NOT NULL THEN 'true' ELSE 'false' END AS admission_ready,
    bt5.end_date AS deadline,            
    bt2.end_date AS dean_end,        
    CASE
        WHEN mr.s_id IS NOT NULL AND mr.status = 'true' AND a.batch_id IS NOT NULL THEN 'done'
        WHEN mr.s_id IS NOT NULL AND mr.status = 'true' AND a.batch_id IS NULL THEN 'pending'
        WHEN mr.s_id IS NOT NULL AND mr.reference != '' AND mr.status = '' THEN 'pending'
        WHEN mr.s_id IS NOT NULL AND mr.reference = '' AND mr.status = '' AND NOW() > bt2.end_date AND NOW() < b.payment_end THEN 'payment pending'
        WHEN mr.s_id IS NOT NULL AND NOW() > b.application_open AND NOW() < bt2.end_date THEN 'processing'
        WHEN mr.s_id IS NOT NULL AND (mr.status = 'false' OR (mr.reference = '' AND NOW() > b.payment_end)) THEN 'expired'
        ELSE 'active'
    END AS medical_status
FROM batch b
LEFT JOIN medical_request mr ON mr.batch_id = b.batch_id AND mr.s_id = v_s_id
LEFT JOIN admission a ON a.batch_id = b.batch_id
JOIN grp g ON b.grp_id = g.grp_id 
JOIN batch_time_periods bt5 ON bt5.batch_id = b.batch_id AND bt5.user_type = '5'  
LEFT JOIN batch_time_periods bt2 ON bt2.batch_id = b.batch_id AND bt2.user_type = '2' 
WHERE b.syl_id = v_syl_id 
  AND (
      (@last_batch_status = 'true' AND b.level < v_level)
      OR
      (@last_batch_status = 'false' AND b.level <= v_level)
    )
  AND b.status = 'true'
  AND (
    NOW() <= bt5.end_date
    OR mr.medical_id IS NOT NULL 
) ORDER BY b.batch_id DESC;
    END IF;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEligibleMedicalSubjectsByBatchAndUser`(IN `input_batch_id` INT, IN `input_user_id` INT)
BEGIN
  DECLARE studentId INT;
  DECLARE medicalId INT;
  SELECT s_id INTO studentId FROM student WHERE user_id = input_user_id LIMIT 1;
  SELECT medical_id INTO medicalId 
  FROM medical_request 
  WHERE batch_id = input_batch_id AND s_id = studentId LIMIT 1;
  SELECT 
    s.sub_code,
    s.sub_name,
    s.sub_id
  FROM medical_subject ms
  JOIN subject s ON s.sub_id = ms.sub_id
  JOIN student st ON st.s_id = studentId
  JOIN user u ON u.user_id = st.user_id
  WHERE ms.medical_id = medicalId AND ms.eligibility = 'true';
  SELECT
    u.user_name,
    sd.name
  FROM user u
  JOIN student s ON u.user_id=s.user_id
  JOIN student_detail sd ON s.s_id=sd.s_id
    WHERE u.user_id = input_user_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEligibleResitBatches`(IN `p_user_id` INT)
BEGIN
    DECLARE v_s_id INT;
    DECLARE v_syl_id INT;
    DECLARE v_batch_ids TEXT;
    DECLARE v_last_batch_id INT;
    DECLARE v_level INT;
    SELECT s_id INTO v_s_id FROM student WHERE user_id = p_user_id;
    SELECT batch_ids, syl_id INTO v_batch_ids, v_syl_id FROM student_detail WHERE s_id = v_s_id;
    IF v_batch_ids IS NULL OR v_batch_ids = '' THEN
       SELECT 
    b.batch_id,
    b.batch_code,
    b.academic_year,
    b.level,
    b.sem,
    b.application_open,
    g.course_title,
    CASE WHEN a.batch_id IS NOT NULL THEN 'true' ELSE 'false' END AS admission_ready,
    bt5.end_date AS deadline,         
    bt2.end_date AS dean_end,     
    CASE
        WHEN rr.s_id IS NOT NULL AND rr.status = 'true' AND a.batch_id IS NOT NULL THEN 'done'
        WHEN rr.s_id IS NOT NULL AND rr.status = 'true' AND a.batch_id IS NULL THEN 'pending'
        WHEN rr.s_id IS NOT NULL AND rr.reference != '' AND rr.status = '' THEN 'pending'
        WHEN rr.s_id IS NOT NULL AND rr.reference = '' AND rr.status = '' AND NOW() > bt2.end_date AND NOW() < b.payment_end THEN 'payment pending'
        WHEN rr.s_id IS NOT NULL AND NOW() > b.application_open AND NOW() < bt2.end_date THEN 'processing'
        WHEN rr.s_id IS NOT NULL AND (rr.status = 'false' OR (rr.reference = '' AND NOW() > b.payment_end)) THEN 'expired'
        ELSE 'active'
    END AS resit_status
FROM batch b
LEFT JOIN resit_request rr ON rr.batch_id = b.batch_id AND rr.s_id = v_s_id
LEFT JOIN admission a ON a.batch_id = b.batch_id
JOIN grp g ON b.grp_id = g.grp_id 
JOIN batch_time_periods bt5 ON bt5.batch_id = b.batch_id AND bt5.user_type = '5'    
LEFT JOIN batch_time_periods bt2 ON bt2.batch_id = b.batch_id AND bt2.user_type = '2' 
WHERE b.syl_id = v_syl_id 
  AND (
      (b.status = 'true' AND NOW() <= bt5.end_date)
      OR rr.resit_id IS NOT NULL
  ) ORDER BY b.batch_id DESC;
    ELSE
        SET v_last_batch_id = CAST(SUBSTRING_INDEX(v_batch_ids, ',', -1) AS UNSIGNED);
        SELECT level, status INTO v_level, @last_batch_status FROM batch WHERE batch_id = v_last_batch_id;
        SELECT 
    b.batch_id,
    b.batch_code,
    b.academic_year,
    b.level,
    b.sem,
    b.application_open,
    g.course_title,
    CASE WHEN a.batch_id IS NOT NULL THEN 'true' ELSE 'false' END AS admission_ready,
    bt5.end_date AS deadline,         
    bt2.end_date AS dean_end,     
    CASE
        WHEN rr.s_id IS NOT NULL AND rr.status = 'true' AND a.batch_id IS NOT NULL THEN 'done'
        WHEN rr.s_id IS NOT NULL AND rr.status = 'true' AND a.batch_id IS NULL THEN 'pending'
        WHEN rr.s_id IS NOT NULL AND rr.reference != '' AND rr.status = '' THEN 'pending'
        WHEN rr.s_id IS NOT NULL AND rr.reference = '' AND rr.status = '' AND NOW() > bt2.end_date AND NOW() < b.payment_end THEN 'payment pending'
        WHEN rr.s_id IS NOT NULL AND NOW() > b.application_open AND NOW() < bt2.end_date THEN 'processing'
        WHEN rr.s_id IS NOT NULL AND (rr.status = 'false' OR (rr.reference = '' AND NOW() > b.payment_end)) THEN 'expired'
        ELSE 'active'
    END AS resit_status
FROM batch b
LEFT JOIN resit_request rr ON rr.batch_id = b.batch_id AND rr.s_id = v_s_id
LEFT JOIN admission a ON a.batch_id = b.batch_id
JOIN grp g ON b.grp_id = g.grp_id 
JOIN batch_time_periods bt5 ON bt5.batch_id = b.batch_id AND bt5.user_type = '5'    
LEFT JOIN batch_time_periods bt2 ON bt2.batch_id = b.batch_id AND bt2.user_type = '2' 
WHERE b.syl_id = v_syl_id 
  AND (
      (@last_batch_status = 'true' AND b.level < v_level)
      OR
      (@last_batch_status = 'false' AND b.level <= v_level)
    )
  AND (
      (b.status = 'true' AND NOW() <= bt5.end_date)
      OR rr.resit_id IS NOT NULL
  ) ORDER BY b.batch_id DESC;
    END IF;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEligibleResitSubjectsByBatchAndUser`(IN `input_batch_id` INT, IN `input_user_id` INT)
BEGIN
  DECLARE studentId INT;
  DECLARE resitId INT;
  SELECT s_id INTO studentId FROM student WHERE user_id = input_user_id LIMIT 1;
  SELECT resit_id INTO resitId 
  FROM resit_request 
  WHERE batch_id = input_batch_id AND s_id = studentId LIMIT 1;
  SELECT 
    s.sub_code,
    s.sub_name,
    s.sub_id,
    s.pass_grade,
    rs.attempt_1,
    rs.attempt_2,
    rs.attempt_3
  FROM resit_subject rs
  JOIN subject s ON s.sub_id = rs.sub_id
  JOIN student st ON st.s_id = studentId
  WHERE rs.resit_id = resitId AND rs.eligibility = 'true';
  SELECT
    u.user_name,
    sd.name
  FROM user u
  JOIN student s ON u.user_id=s.user_id
  JOIN student_detail sd ON s.s_id=sd.s_id
    WHERE u.user_id = input_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEligibleStudentsBySub`(IN `p_batch_id` INT, IN `p_sub_id` INT)
BEGIN
    DECLARE dynamic_table_name VARCHAR(255);
    SET dynamic_table_name = CONCAT('batch_', p_batch_id, '_sub_', p_sub_id);
    SET @check_table_query = CONCAT(
        'SELECT COUNT(*) INTO @table_exists FROM information_schema.tables ',
        'WHERE table_schema = DATABASE() AND table_name = "', dynamic_table_name, '"'
    );
    PREPARE stmt FROM @check_table_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    IF @table_exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'The dynamic table does not exist.';
    END IF;
    SET @query = CONCAT(
    'SELECT bs.s_id, bs.exam_type, sd.index_num ',
    'FROM ', dynamic_table_name, ' bs ',
    'JOIN student_detail sd ON bs.s_id = sd.s_id ',
    'WHERE bs.eligibility = "true"'
);
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFacStudentByBatchId`(IN `p_batch_id` INT)
BEGIN
    SELECT 
        sd.s_id,
        sd.name,
        u.user_name
    FROM 
        student_detail sd
    INNER JOIN 
        student s ON sd.s_id = s.s_id
    INNER JOIN 
        user u ON s.user_id = u.user_id
    INNER JOIN 
        fac_dep fd ON sd.f_id = fd.f_id
    INNER JOIN 
        dep_deg dd ON fd.d_id = dd.d_id
	INNER JOIN 
        batch b ON b.deg_id = dd.deg_id
    WHERE 
        b.batch_id = p_batch_id AND sd.status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFacultyById`(IN `p_f_id` INT)
BEGIN
    SELECT 
        f.*, 
        u.user_name AS email 
    FROM faculty f 
    LEFT JOIN user u ON u.user_id = f.user_id 
    WHERE f.f_id = p_f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFacultyCount`(OUT `p_faculty_count` INT)
BEGIN
    SELECT COUNT(*) INTO p_faculty_count
    FROM faculty;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFacultyDetails`(IN `p_user_id` INT)
BEGIN
    SELECT 
        u.email, u.user_name, f.f_name AS name, u.role_id
    FROM 
        user u
    INNER JOIN 
        faculty f ON u.user_id = f.user_id
    WHERE 
        u.user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFacultyDetailsByFid`(IN `p_f_id` INT)
BEGIN
    SELECT f.f_id, f.user_id
    FROM faculty f
    WHERE f.f_id = p_f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetGrades`()
BEGIN
    SELECT 
        *
    FROM 
        grade;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetGroupById`(IN `p_grp_id` INT)
BEGIN
    SELECT 
        g.*,
        ds.syl_id,
        ds.deg_id,
        fd.f_id,
        GROUP_CONCAT(gs.sub_id SEPARATOR ',') AS subIds
    FROM grp g 
    JOIN syl_grp sg ON g.grp_id = sg.grp_id 
    JOIN deg_syl ds ON sg.syl_id = ds.syl_id 
    JOIN fac_deg fd ON ds.deg_id = fd.deg_id 
    LEFT JOIN grp_sub gs ON g.grp_id = gs.grp_id
    WHERE g.grp_id = p_grp_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetGroupsBySylLevSem`(IN `p_syl_id` INT, IN `p_level` INT, IN `p_sem_no` INT)
BEGIN
    SELECT g.grp_id,g.grp_code,g.custom_suffix
    FROM grp g
    JOIN syl_grp sg ON g.grp_id = sg.grp_id
    WHERE 
        sg.syl_id = p_syl_id 
        AND g.level = p_level 
        AND g.sem_no = p_sem_no 
        AND g.status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLastAssignedIndexNumber`(IN `p_course` VARCHAR(50), IN `p_batch` VARCHAR(50))
BEGIN
    DECLARE last_index_num VARCHAR(50);
    SELECT SUBSTRING_INDEX(index_num, ' ', -1) INTO last_index_num
    FROM student_detail
    WHERE index_num LIKE CONCAT(p_course, " ", p_batch, "%")
    ORDER BY index_num DESC
    LIMIT 1;
    IF last_index_num IS NULL THEN
        SELECT 0 AS last_assigned_index;
    ELSE
        SELECT CAST(last_index_num AS UNSIGNED) AS last_assigned_index;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLatestAdmissionTemplate`(IN `p_batch_id` INT)
BEGIN
    DECLARE recordExists INT;
    SELECT COUNT(*) INTO recordExists
    FROM admission
    WHERE batch_id = p_batch_id;
    IF recordExists > 0 THEN
        SELECT 
            TRUE AS exist,
            JSON_OBJECT(
                'id', id,
                'batch_id', batch_id,
                'generated_date', generated_date,
                'subject_list', subject_list,
                'exam_date', exam_date,
                'exam_held_date', exam_held_date,
                'description', description,
                'instructions', instructions,
                'provider', provider
            ) AS data
        FROM admission
        WHERE batch_id = p_batch_id
        LIMIT 1;
    ELSE
        SELECT 
            FALSE AS exist,
            JSON_OBJECT(
                'description', description,
                'instructions', instructions,
                'provider', provider
            ) AS data
        FROM admission
        ORDER BY id DESC
        LIMIT 1;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLatestAttendanceTemplate`(IN `p_batch_id` INT, IN `p_sub_id` INT)
BEGIN
    DECLARE recordExists INT;
    DECLARE subjectRecordExists INT;
    SELECT COUNT(*) INTO recordExists
    FROM attendance
    WHERE batch_id = p_batch_id;
    IF recordExists > 0 THEN
        SELECT COUNT(*) INTO subjectRecordExists
        FROM attendance_subject ats
        JOIN attendance att ON ats.attendance_id = att.id
        WHERE att.batch_id = p_batch_id AND ats.sub_id=p_sub_id;
        IF subjectRecordExists > 0 THEN
        	SELECT 
                TRUE AS exist,
				TRUE AS subExist,
                JSON_OBJECT(
                    'id', att.id,
                    'batch_id', att.batch_id,
                    'exam_date', att.exam_date,
                    'exam_held_date', att.exam_held_date,
                    'description', att.description,
                    'no_of_groups', ats.no_of_groups,
                    'venues', ats.venues,
                    'dates', ats.dates,
                    'times', ats.times,
                    'student_detail', ats.student_detail
                ) AS data
            FROM attendance att
            left join attendance_subject ats on att.id = ats.attendance_id
            WHERE att.batch_id = p_batch_id AND ats.sub_id=p_sub_id
            LIMIT 1;
        ELSE
            SELECT 
                 TRUE AS exist,
				FALSE AS subExist,
                JSON_OBJECT(
                    'id', id,
                    'batch_id', batch_id,
                    'exam_date', exam_date,
                    'exam_held_date', exam_held_date,
                    'description', description
                ) AS data
            FROM attendance
            WHERE batch_id = p_batch_id
            LIMIT 1;
        END IF;
    ELSE
        SELECT 
             FALSE AS exist,
				FALSE AS subExist,
            JSON_OBJECT(
                'description', description
            ) AS data
        FROM attendance
        ORDER BY id DESC
        LIMIT 1;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLecturerById`(IN `p_user_id` INT)
BEGIN
    SELECT 
        u.user_id, 
        u.user_name, 
        ld.name, 
        u.email, 
        ld.contact_no, 
        ld.status,
        ld.l_id 
    FROM 
        user u
    INNER JOIN 
        lecturer m ON u.user_id = m.user_id
    INNER JOIN 
        lecturer_detail ld ON m.l_id = ld.l_id
    WHERE 
        u.user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLecturerDetails`(IN `p_user_id` INT)
BEGIN
    SELECT 
        u.email, u.user_name, ld.name, u.role_id
    FROM 
        user u
    INNER JOIN 
        lecturer m ON u.user_id = m.user_id
    INNER JOIN 
        lecturer_detail ld ON m.l_id = ld.l_id
    WHERE 
        u.user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetNonBatchStudentsByFaculty`(IN `p_batch_id` INT)
BEGIN
    DECLARE p_f_id INT;
    DECLARE table_name VARCHAR(255);
    SELECT fd.f_id INTO p_f_id
    FROM batch b
    JOIN degree deg ON b.batch_code REGEXP CONCAT('^[0-9]{4}', deg.short, '[0-9]{2}$')
    JOIN dep_deg dd ON deg.deg_id = dd.deg_id
    JOIN fac_dep fd ON fd.d_id = dd.d_id
    JOIN faculty f ON fd.f_id = f.f_id
    WHERE b.batch_id = p_batch_id
    LIMIT 1;
    SELECT p_f_id AS faculty_id;
    IF p_f_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Faculty ID not found for the given batch ID.';
    END IF;
    SET table_name = CONCAT('batch_', p_batch_id, '_students');
    SET @check_table_query = CONCAT('SHOW TABLES LIKE "', table_name, '"');
    PREPARE check_stmt FROM @check_table_query;
    EXECUTE check_stmt;
    DEALLOCATE PREPARE check_stmt;
    SET @query = CONCAT(
        'SELECT u.user_name, sd.s_id 
         FROM student_detail sd 
         INNER JOIN student s ON sd.s_id = s.s_id 
         INNER JOIN user u ON s.user_id = u.user_id 
         WHERE sd.s_id NOT IN (SELECT s_id FROM ', table_name, ')
         AND sd.f_id = ', p_f_id
    );
    SELECT @query AS constructed_query;
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetNoOfGroups`()
BEGIN
    SELECT COUNT(*) AS grp_count FROM grp;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetNoOfLecturers`()
BEGIN
    SELECT COUNT(*) AS lecturer_count FROM lecturer;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetNoOfStudents`()
BEGIN
    SELECT COUNT(*) AS student_count FROM student;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetNoOfSubjects`()
BEGIN
    SELECT COUNT(*) AS subject_count FROM subject;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetNoOfSyllabi`()
BEGIN
    SELECT COUNT(*) AS syllabus_count FROM syllabus;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPaymentMailData`(IN `p_batch_id` INT)
BEGIN
    SELECT payment_end FROM batch WHERE batch_id=p_batch_id;
    (
        SELECT u.email, sd.name
        FROM resit_request rr
        JOIN student s ON rr.s_id = s.s_id
        JOIN student_detail sd ON s.s_id = sd.s_id
        JOIN user u ON s.user_id = u.user_id
        WHERE rr.batch_id = p_batch_id
    )
    UNION
    (
        SELECT u.email, sd.name
        FROM medical_request mr
        JOIN student s ON mr.s_id = s.s_id
        JOIN student_detail sd ON s.s_id = sd.s_id
        JOIN user u ON s.user_id = u.user_id
        WHERE mr.batch_id = p_batch_id
    );
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRemarksForSubject`(IN `p_batch_id` INT, IN `p_sub_id` INT)
BEGIN
    SELECT 
       el.date_time, 
       el.remark, 
       el.status_to, 
       el.status_from, 
       el.s_id, 
       el.user_id,
       u.user_name
    FROM 
        eligibility_log el
    INNER JOIN
    	user u ON el.user_id = u.user_id
    WHERE 
        sub_id = p_sub_id AND exam = p_batch_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentApplicationDetails`(IN `p_user_id` INT)
BEGIN
    DECLARE batch_id INT;
    DECLARE batch_end_date TIMESTAMP;
    SELECT 
        CAST(SUBSTRING_INDEX(batch_ids, ',', -1) AS UNSIGNED) INTO batch_id
    FROM 
        student_detail sd
    INNER JOIN 
        student s 
    ON 
        sd.s_id = s.s_id
    WHERE 
        s.user_id = p_user_id;
    IF batch_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch ID is missing for the user';
    END IF;
    SELECT 
        sd.name, 
        sd.index_num, 
        s.s_id, 
        u.user_name, 
        f.f_name 
    FROM 
        faculty f
    INNER JOIN 
        student_detail sd 
    ON 
        f.f_id = sd.f_id
    INNER JOIN 
        student s 
    ON 
        sd.s_id = s.s_id
    INNER JOIN 
        user u 
    ON 
        s.user_id = u.user_id
    WHERE 
        u.user_id = p_user_id;
    SELECT 
        c.sub_code, 
        c.sub_name, 
        c.sub_id, 
        bsl.batch_id 
    FROM 
        subject c
    INNER JOIN 
        batch_subject_lecturer bsl 
    ON 
        c.sub_id = bsl.sub_id
    WHERE 
        bsl.batch_id = batch_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentBatchDetails`(IN `p_batch_ids` TEXT, IN `p_s_id` INT)
BEGIN
    DECLARE batch_id VARCHAR(255);
    DECLARE temp_batch_ids TEXT;
    DECLARE query TEXT;
    DECLARE is_first BOOLEAN DEFAULT TRUE;
    SET temp_batch_ids = p_batch_ids;
    SET query = '';
    WHILE LOCATE(',', temp_batch_ids) > 0 DO
        SET batch_id = SUBSTRING_INDEX(temp_batch_ids, ',', 1);
        SET temp_batch_ids = SUBSTRING(temp_batch_ids, LOCATE(',', temp_batch_ids) + 1);
        IF NOT is_first THEN
            SET query = CONCAT(query, ' UNION ');
        END IF;
        SET query = CONCAT(
            query,
            'SELECT b.batch_id, b.batch_code, b.academic_year, b.level, b.sem, b.application_open, s.applied_to_exam, g.course_title, ',
            '(CASE WHEN EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "true" ELSE "false" END) AS admission_ready, ',
            'bt.end_date AS deadline, ',
            'CASE ',
'  WHEN s.applied_to_exam = "true" AND EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "done" ',
'  WHEN s.applied_to_exam = "true" AND NOT EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "applied" ',
'  WHEN NOW() > bt.end_date AND s.applied_to_exam = "false" THEN "expired" ',
'  ELSE "active" ',
'END AS status ',
            'FROM batch_', batch_id, '_students s ',
            'JOIN batch b ON b.batch_id = ', batch_id, ' ',
            'JOIN grp g ON b.grp_id = g.grp_id ',
            'LEFT JOIN batch_time_periods bt ON bt.batch_id = ', batch_id, ' AND bt.user_type = "5" ',
            'WHERE s.s_id = ', p_s_id, ' '
        );
        SET is_first = FALSE;
    END WHILE;
    SET batch_id = temp_batch_ids;
    IF NOT is_first THEN
        SET query = CONCAT(query, ' UNION ');
    END IF;
    SET query = CONCAT(
        query,
        'SELECT b.batch_id, b.batch_code, b.academic_year, b.level, b.sem, b.application_open, s.applied_to_exam, g.course_title, ',
        '(CASE WHEN EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "true" ELSE "false" END) AS admission_ready, ',
        'bt.end_date AS deadline, ',
'CASE ',
'  WHEN s.applied_to_exam = "true" AND EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "done" ',
'  WHEN s.applied_to_exam = "true" AND NOT EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "applied" ',
'  WHEN NOW() > bt.end_date AND s.applied_to_exam = "false" THEN "expired" ',
'  ELSE "active" ',
'END AS status ',
        'FROM batch_', batch_id, '_students s ',
        'JOIN batch b ON b.batch_id = ', batch_id, ' ',
        'JOIN grp g ON b.grp_id = g.grp_id ',
        'LEFT JOIN batch_time_periods bt ON bt.batch_id = ', batch_id, ' AND bt.user_type = "5" ',
        'WHERE s.s_id = ', p_s_id, ' '
    );
    SET @stmt = query;
    PREPARE stmt FROM @stmt;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentBatchIds`(IN `p_user_id` INT)
BEGIN
    SELECT 
        sd.batch_ids,
        s.s_id 
    FROM 
        user u
    INNER JOIN 
        student s ON u.user_id = s.user_id
    INNER JOIN 
        student_detail sd ON s.s_id = sd.s_id 
    WHERE 
        u.user_id = p_user_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentById`(IN `p_user_id` INT)
BEGIN
    SELECT 
        u.user_id, 
        u.user_name, 
        sd.name, 
        u.email, 
        sd.status,
        sd.s_id,
        sd.f_id,
        sd.syl_id,
        ds.deg_id,
        sd.index_num,
        sd.contact_no
    FROM 
        user u
    INNER JOIN 
        student s ON u.user_id = s.user_id
    INNER JOIN 
        student_detail sd ON s.s_id = sd.s_id 
    INNER JOIN 
        deg_syl ds ON sd.syl_id = ds.syl_id
    WHERE 
        u.user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentDetails`(IN `p_user_id` INT)
BEGIN
    SELECT 
        u.email, u.user_name, sd.name, u.role_id
    FROM 
        user u
    INNER JOIN 
        student s ON u.user_id = s.user_id
    INNER JOIN 
        student_detail sd ON s.s_id = sd.s_id
    WHERE 
        u.user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentDetailsWithSubjects`(IN `batchId` INT, IN `userId` INT)
BEGIN
    DECLARE sub_id INT;
    DECLARE studentId INT DEFAULT NULL;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cursor_subjects CURSOR FOR 
        SELECT sub_id 
        FROM batch_subject_lecturer 
        WHERE batch_id = batchId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    SELECT s_id INTO studentId
    FROM student 
    WHERE user_id = userId;
    IF studentId IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Student ID not found for the provided user ID.';
    END IF;
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_subjects (
        sub_id INT,
        eligibility VARCHAR(50)
    );
    OPEN cursor_subjects;
    subject_loop: LOOP
        FETCH cursor_subjects INTO sub_id;
        IF done THEN
            LEAVE subject_loop;
        END IF;
        SET @table_name = CONCAT('batch_', batchId, '_sub_', sub_id);
        SET @exists_query = CONCAT(
            'SELECT COUNT(*) INTO @table_exists FROM information_schema.tables ',
            'WHERE table_name = "', @table_name, '" AND table_schema = DATABASE()'
        );
        PREPARE exists_stmt FROM @exists_query;
        EXECUTE exists_stmt;
        DEALLOCATE PREPARE exists_stmt;
        IF @table_exists > 0 THEN
            SET @insert_query = CONCAT(
                'INSERT INTO temp_subjects (sub_id, eligibility) ',
                'SELECT ', sub_id, ', eligibility FROM ', @table_name, 
                ' WHERE s_id = ', studentId
            );
            PREPARE stmt FROM @insert_query;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;
    END LOOP;
    CLOSE cursor_subjects;
    SELECT 
        sd.s_id,
        sd.name,
        sd.index_num,
        u.user_name,
        GROUP_CONCAT(CONCAT('{ "sub_id": "', ts.sub_id, '", "eligibility": "', ts.eligibility, '" }')) AS subjects
    FROM
        student_detail sd
    JOIN
        student st ON sd.s_id = st.s_id
    JOIN
        user u ON st.user_id = u.user_id
    LEFT JOIN
        temp_subjects ts ON ts.sub_id IS NOT NULL
    WHERE
        sd.s_id = studentId
    GROUP BY 
        sd.s_id, sd.name, sd.index_num, u.user_name;
    DROP TEMPORARY TABLE IF EXISTS temp_subjects;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentMedicalApplicationDetailsByBatch`(IN `p_user_id` INT, IN `p_batch_id` INT)
BEGIN
    DECLARE v_s_id INT;
    DECLARE v_batch_id INT DEFAULT p_batch_id;
    SELECT s.s_id
    INTO v_s_id
    FROM student s
    INNER JOIN student_detail sd ON sd.s_id = s.s_id
    WHERE s.user_id = p_user_id;
    IF v_s_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';
    END IF;
    SELECT 
        sd.name, 
        sd.index_num, 
        s.s_id, 
        u.user_name, 
        f.f_name 
    FROM 
        faculty f
    INNER JOIN student_detail sd ON f.f_id = sd.f_id
    INNER JOIN student s ON sd.s_id = s.s_id
    INNER JOIN user u ON s.user_id = u.user_id
    WHERE u.user_id = p_user_id;
    SELECT 
        c.sub_code, 
        c.sub_name, 
        c.sub_id, 
        bsl.batch_id 
    FROM 
        subject c
    INNER JOIN batch_subject_lecturer bsl ON c.sub_id = bsl.sub_id
    WHERE bsl.batch_id = v_batch_id AND c.sub_id NOT IN (
    SELECT sub_id FROM resit_subject rs
    INNER JOIN resit_request rr ON rs.resit_id = rr.resit_id
    WHERE rr.s_id = v_s_id AND rr.batch_id=v_batch_id
);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentMedicalResitApplications`()
BEGIN
    SELECT 
        s.s_id,
        u.user_name AS _user_name,
        b.batch_id,
        b.academic_year,
        sy.commenced_year,
        g.course_title AS grp_course_title,
        b.batch_code,
        b.sem AS sem_no,
        b.level,
        mr.medical_id,
        rr.resit_id,
        mr.reference AS medical_reference,
        mr.subjects_verified AS medical_subjects_verified,
        mr.payment_verified AS medical_payment_verified,
        rr.reference AS resit_reference,
        rr.subjects_verified AS resit_subjects_verified,
        rr.payment_verified AS resit_payment_verified,
        ms.sub_id AS medical_sub_id,
        ms.id AS medical_subject_id,
        sb1.sub_code AS medical_sub_code,
        sb1.sub_name AS medical_sub_name,
        rs.sub_id AS resit_sub_id,
        rs.id AS resit_subject_id,
        sb2.sub_code AS resit_sub_code,
        sb2.sub_name AS resit_sub_name,
        rs.attempt_1,
        rs.attempt_2,
        rs.attempt_3
    FROM student s
    JOIN user u ON s.user_id = u.user_id
    JOIN batch b ON b.batch_id IN (
        SELECT batch_id FROM medical_request WHERE s_id = s.s_id AND status = ''
        UNION
        SELECT batch_id FROM resit_request WHERE s_id = s.s_id AND status = ''
    )
    LEFT JOIN medical_request mr ON mr.s_id = s.s_id AND mr.batch_id = b.batch_id AND mr.status = ''
    LEFT JOIN resit_request rr ON rr.s_id = s.s_id AND rr.batch_id = b.batch_id AND rr.status = ''
    LEFT JOIN medical_subject ms ON ms.medical_id = mr.medical_id AND ms.eligibility = 'true'
    LEFT JOIN subject sb1 ON ms.sub_id = sb1.sub_id
    LEFT JOIN resit_subject rs ON rs.resit_id = rr.resit_id AND rs.eligibility = 'true'
    LEFT JOIN subject sb2 ON rs.sub_id = sb2.sub_id
    JOIN syllabus sy ON b.syl_id = sy.syl_id
    JOIN grp g ON b.grp_id = g.grp_id
    WHERE b.status = 'true'
    ORDER BY s.s_id, b.batch_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentMedicalSubjectEligibility`(IN `p_user_id` INT, IN `p_batch_id` INT)
main_proc: BEGIN
    DECLARE v_s_id INT DEFAULT NULL;
    DECLARE v_medical_id INT DEFAULT NULL;
    DECLARE v_status VARCHAR(50) DEFAULT '';
    DECLARE v_description VARCHAR(500) DEFAULT '';
    DECLARE current_pos INT DEFAULT 1;
    DECLARE comma_pos INT;
    DECLARE current_sub_id VARCHAR(10);
    DECLARE v_eligibility VARCHAR(50);
    DECLARE v_table_exists INT DEFAULT 0;
    DECLARE dynamic_sql TEXT;
    DECLARE result_json TEXT DEFAULT '';
    DECLARE eligibility_json TEXT DEFAULT '{';
    DECLARE first_item BOOLEAN DEFAULT TRUE;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cursor_sub_id INT;
    DECLARE cursor_eligibility VARCHAR(50);
    DECLARE medical_cursor CURSOR FOR 
        SELECT sub_id, IFNULL(eligibility, '') as eligibility 
        FROM medical_subject 
        WHERE medical_id = v_medical_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET v_table_exists = 0;
    SELECT s.s_id INTO v_s_id
    FROM student s
    WHERE s.user_id = p_user_id
    LIMIT 1;
    IF v_s_id IS NULL THEN
        SELECT '{"error": "Student not found for the given user_id"}' AS result;
        LEAVE main_proc;
    END IF;
    SELECT medical_id, IFNULL(status, '') INTO v_medical_id, v_status
    FROM medical_request
    WHERE batch_id = p_batch_id AND s_id = v_s_id
    LIMIT 1;
    IF v_medical_id IS NULL THEN
        SELECT '{"applied":"false","eligibility":{}}' AS result;
        LEAVE main_proc;
    END IF;
    IF v_status = '' OR v_status = 'false' THEN
        SET done = FALSE;
        OPEN medical_cursor;
        read_loop: LOOP
            FETCH medical_cursor INTO cursor_sub_id, cursor_eligibility;
            IF done THEN
                LEAVE read_loop;
            END IF;
            IF NOT first_item THEN
                SET eligibility_json = CONCAT(eligibility_json, ',');
            END IF;
            SET first_item = FALSE;
            SET eligibility_json = CONCAT(eligibility_json, '"', cursor_sub_id, '":"', cursor_eligibility, '"');
        END LOOP;
        CLOSE medical_cursor;
        SET eligibility_json = CONCAT(eligibility_json, '}');
        SET result_json = CONCAT('{"applied":"true","eligibility":', eligibility_json, '}');
    ELSEIF v_status = 'true' THEN
        SELECT description INTO v_description
        FROM batch
        WHERE batch_id = p_batch_id
        LIMIT 1;
        IF v_description IS NULL OR LENGTH(v_description) = 0 THEN
            SELECT '{"error": "Batch not found or has no subjects"}' AS result;
            LEAVE main_proc;
        END IF;
        sub_parsing: LOOP
            SET comma_pos = LOCATE(',', v_description, current_pos);
            IF comma_pos > 0 THEN
                SET current_sub_id = SUBSTRING(v_description, current_pos, comma_pos - current_pos);
                SET current_pos = comma_pos + 1;
            ELSE
                SET current_sub_id = SUBSTRING(v_description, current_pos);
                IF LENGTH(current_sub_id) = 0 THEN
                    LEAVE sub_parsing;
                END IF;
            END IF;
            SET current_sub_id = TRIM(current_sub_id);
            IF LENGTH(current_sub_id) = 0 THEN
                IF comma_pos = 0 THEN
                    LEAVE sub_parsing;
                END IF;
                ITERATE sub_parsing;
            END IF;
            SET v_eligibility = NULL;
            SET v_table_exists = 1;
            SET dynamic_sql = CONCAT(
                'SELECT eligibility INTO @temp_eligibility FROM batch_', 
                p_batch_id, '_sub_', current_sub_id, 
                ' WHERE s_id = ', v_s_id, ' LIMIT 1'
            );
            SET @sql = dynamic_sql;
            SELECT COUNT(*) INTO v_table_exists
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
            AND table_name = CONCAT('batch_', p_batch_id, '_sub_', current_sub_id);
            IF v_table_exists > 0 THEN
                SET @temp_eligibility = NULL;
                PREPARE stmt FROM @sql;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
                SET v_eligibility = @temp_eligibility;
            END IF;
            IF NOT first_item THEN
                SET eligibility_json = CONCAT(eligibility_json, ',');
            END IF;
            SET first_item = FALSE;
            IF v_eligibility IS NULL THEN
                SET eligibility_json = CONCAT(eligibility_json, '"', current_sub_id, '":"none"');
            ELSEIF v_eligibility = 'true' OR v_eligibility = '1' OR LOWER(v_eligibility) = 'eligible' THEN
                SET eligibility_json = CONCAT(eligibility_json, '"', current_sub_id, '":"true"');
            ELSE
                SET eligibility_json = CONCAT(eligibility_json, '"', current_sub_id, '":"false"');
            END IF;
            IF comma_pos = 0 THEN
                LEAVE sub_parsing;
            END IF;
        END LOOP;
        SET eligibility_json = CONCAT(eligibility_json, '}');
        SET result_json = CONCAT('{"applied":"true","eligibility":', eligibility_json, '}');
    ELSE
        SET done = FALSE;
        OPEN medical_cursor;
        read_loop2: LOOP
            FETCH medical_cursor INTO cursor_sub_id, cursor_eligibility;
            IF done THEN
                LEAVE read_loop2;
            END IF;
            IF NOT first_item THEN
                SET eligibility_json = CONCAT(eligibility_json, ',');
            END IF;
            SET first_item = FALSE;
            SET eligibility_json = CONCAT(eligibility_json, '"', cursor_sub_id, '":"', cursor_eligibility, '"');
        END LOOP;
        CLOSE medical_cursor;
        SET eligibility_json = CONCAT(eligibility_json, '}');
        SET result_json = CONCAT('{"applied":"true","eligibility":', eligibility_json, '}');
    END IF;
    SELECT result_json AS result;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentResitApplicationDetailsByBatch`(IN `p_user_id` INT, IN `p_batch_id` INT)
BEGIN
    DECLARE v_s_id INT;
    DECLARE v_batch_id INT DEFAULT p_batch_id;
    SELECT s.s_id
    INTO v_s_id
    FROM student s
    INNER JOIN student_detail sd ON sd.s_id = s.s_id
    WHERE s.user_id = p_user_id;
    IF v_s_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';
    END IF;
    SELECT 
        sd.name, 
        sd.index_num, 
        s.s_id, 
        u.user_name, 
        f.f_name 
    FROM 
        faculty f
    INNER JOIN student_detail sd ON f.f_id = sd.f_id
    INNER JOIN student s ON sd.s_id = s.s_id
    INNER JOIN user u ON s.user_id = u.user_id
    WHERE u.user_id = p_user_id;
    SELECT 
        c.sub_code, 
        c.sub_name, 
        c.sub_id, 
        bsl.batch_id 
    FROM 
        subject c
    INNER JOIN batch_subject_lecturer bsl ON c.sub_id = bsl.sub_id
    WHERE bsl.batch_id = v_batch_id AND c.sub_id NOT IN (
    SELECT sub_id FROM medical_subject ms
    INNER JOIN medical_request mr ON ms.medical_id = mr.medical_id
    WHERE mr.s_id = v_s_id AND mr.batch_id=v_batch_id
);
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentResitSubjectEligibility`(IN `p_user_id` INT, IN `p_batch_id` INT)
main_proc: BEGIN
    DECLARE v_s_id INT DEFAULT NULL;
    DECLARE v_resit_id INT DEFAULT NULL;
    DECLARE v_status VARCHAR(50) DEFAULT '';
    DECLARE v_description VARCHAR(500) DEFAULT '';
    DECLARE current_pos INT DEFAULT 1;
    DECLARE comma_pos INT;
    DECLARE current_sub_id VARCHAR(10);
    DECLARE v_eligibility VARCHAR(50);
    DECLARE v_table_exists INT DEFAULT 0;
    DECLARE dynamic_sql TEXT;
    DECLARE result_json TEXT DEFAULT '';
    DECLARE eligibility_json TEXT DEFAULT '{';
    DECLARE first_item BOOLEAN DEFAULT TRUE;
    DECLARE eligibility_value VARCHAR(10);
    DECLARE done INT DEFAULT FALSE;
    DECLARE cursor_sub_id INT;
    DECLARE cursor_eligibility VARCHAR(50);
    DECLARE cursor_attempt_1 VARCHAR(50);
    DECLARE cursor_attempt_2 VARCHAR(50);
    DECLARE cursor_attempt_3 VARCHAR(50);
    DECLARE resit_cursor CURSOR FOR 
        SELECT sub_id, 
               IFNULL(eligibility, '') as eligibility,
               IFNULL(attempt_1, '') as attempt_1,
               IFNULL(attempt_2, '') as attempt_2,
               IFNULL(attempt_3, '') as attempt_3
        FROM resit_subject 
        WHERE resit_id = v_resit_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET v_table_exists = 0;
    SELECT s.s_id INTO v_s_id
    FROM student s
    WHERE s.user_id = p_user_id
    LIMIT 1;
    IF v_s_id IS NULL THEN
        SELECT '{"error": "Student not found for the given user_id"}' AS result;
        LEAVE main_proc;
    END IF;
    SELECT resit_id, IFNULL(status, '') INTO v_resit_id, v_status
    FROM resit_request
    WHERE batch_id = p_batch_id AND s_id = v_s_id
    LIMIT 1;
    IF v_resit_id IS NULL THEN
        SELECT '{"applied":"false","eligibility":{}}' AS result;
        LEAVE main_proc;
    END IF;
    IF v_status = '' OR v_status = 'false' THEN
        SET done = FALSE;
        OPEN resit_cursor;
        read_loop: LOOP
            FETCH resit_cursor INTO cursor_sub_id, cursor_eligibility, cursor_attempt_1, cursor_attempt_2, cursor_attempt_3;
            IF done THEN
                LEAVE read_loop;
            END IF;
            IF NOT first_item THEN
                SET eligibility_json = CONCAT(eligibility_json, ',');
            END IF;
            SET first_item = FALSE;
            SET eligibility_json = CONCAT(eligibility_json, '"', cursor_sub_id, '":{"eligible":"', cursor_eligibility, 
                                        '","attempt_1":"', cursor_attempt_1, 
                                        '","attempt_2":"', cursor_attempt_2, 
                                        '","attempt_3":"', cursor_attempt_3, '"}');
        END LOOP;
        CLOSE resit_cursor;
        SET eligibility_json = CONCAT(eligibility_json, '}');
        SET result_json = CONCAT('{"applied":"true","eligibility":', eligibility_json, '}');
    ELSEIF v_status = 'true' THEN
        CREATE TEMPORARY TABLE temp_attempts (
            sub_id INT,
            attempt_1 VARCHAR(50),
            attempt_2 VARCHAR(50),
            attempt_3 VARCHAR(50)
        );
        INSERT INTO temp_attempts (sub_id, attempt_1, attempt_2, attempt_3)
        SELECT sub_id, 
               IFNULL(attempt_1, '') as attempt_1,
               IFNULL(attempt_2, '') as attempt_2,
               IFNULL(attempt_3, '') as attempt_3
        FROM resit_subject 
        WHERE resit_id = v_resit_id;
        SELECT description INTO v_description
        FROM batch
        WHERE batch_id = p_batch_id
        LIMIT 1;
        IF v_description IS NULL OR LENGTH(v_description) = 0 THEN
            DROP TEMPORARY TABLE temp_attempts;
            SELECT '{"error": "Batch not found or has no subjects"}' AS result;
            LEAVE main_proc;
        END IF;
        sub_parsing: LOOP
            SET comma_pos = LOCATE(',', v_description, current_pos);
            IF comma_pos > 0 THEN
                SET current_sub_id = SUBSTRING(v_description, current_pos, comma_pos - current_pos);
                SET current_pos = comma_pos + 1;
            ELSE
                SET current_sub_id = SUBSTRING(v_description, current_pos);
                IF LENGTH(current_sub_id) = 0 THEN
                    LEAVE sub_parsing;
                END IF;
            END IF;
            SET current_sub_id = TRIM(current_sub_id);
            IF LENGTH(current_sub_id) = 0 THEN
                IF comma_pos = 0 THEN
                    LEAVE sub_parsing;
                END IF;
                ITERATE sub_parsing;
            END IF;
            SET cursor_attempt_1 = '';
            SET cursor_attempt_2 = '';
            SET cursor_attempt_3 = '';
            SELECT IFNULL(attempt_1, ''), IFNULL(attempt_2, ''), IFNULL(attempt_3, '')
            INTO cursor_attempt_1, cursor_attempt_2, cursor_attempt_3
            FROM temp_attempts
            WHERE sub_id = CAST(current_sub_id AS UNSIGNED)
            LIMIT 1;
            IF cursor_attempt_1 IS NOT NULL THEN
                SET v_eligibility = NULL;
                SET v_table_exists = 1;
                SET dynamic_sql = CONCAT(
                    'SELECT eligibility INTO @temp_eligibility FROM batch_', 
                    p_batch_id, '_sub_', current_sub_id, 
                    ' WHERE s_id = ', v_s_id, ' LIMIT 1'
                );
                SET @sql = dynamic_sql;
                SELECT COUNT(*) INTO v_table_exists
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = CONCAT('batch_', p_batch_id, '_sub_', current_sub_id);
                IF v_table_exists > 0 THEN
                    SET @temp_eligibility = NULL;
                    PREPARE stmt FROM @sql;
                    EXECUTE stmt;
                    DEALLOCATE PREPARE stmt;
                    SET v_eligibility = @temp_eligibility;
                END IF;
                IF NOT first_item THEN
                    SET eligibility_json = CONCAT(eligibility_json, ',');
                END IF;
                SET first_item = FALSE;
                IF v_eligibility IS NULL THEN
                    SET eligibility_value = 'none';
                ELSEIF v_eligibility = 'true' OR v_eligibility = '1' OR LOWER(v_eligibility) = 'eligible' THEN
                    SET eligibility_value = 'true';
                ELSE
                    SET eligibility_value = 'false';
                END IF;
                SET eligibility_json = CONCAT(eligibility_json, '"', current_sub_id, '":{"eligible":"', eligibility_value, 
                                            '","attempt_1":"', cursor_attempt_1, 
                                            '","attempt_2":"', cursor_attempt_2, 
                                            '","attempt_3":"', cursor_attempt_3, '"}');
            END IF;
            IF comma_pos = 0 THEN
                LEAVE sub_parsing;
            END IF;
        END LOOP;
        DROP TEMPORARY TABLE temp_attempts;
        SET eligibility_json = CONCAT(eligibility_json, '}');
        SET result_json = CONCAT('{"applied":"true","eligibility":', eligibility_json, '}');
    ELSE
        SET done = FALSE;
        OPEN resit_cursor;
        read_loop2: LOOP
            FETCH resit_cursor INTO cursor_sub_id, cursor_eligibility, cursor_attempt_1, cursor_attempt_2, cursor_attempt_3;
            IF done THEN
                LEAVE read_loop2;
            END IF;
            IF NOT first_item THEN
                SET eligibility_json = CONCAT(eligibility_json, ',');
            END IF;
            SET first_item = FALSE;
            SET eligibility_json = CONCAT(eligibility_json, '"', cursor_sub_id, '":{"eligible":"', cursor_eligibility, 
                                        '","attempt_1":"', cursor_attempt_1, 
                                        '","attempt_2":"', cursor_attempt_2, 
                                        '","attempt_3":"', cursor_attempt_3, '"}');
        END LOOP;
        CLOSE resit_cursor;
        SET eligibility_json = CONCAT(eligibility_json, '}');
        SET result_json = CONCAT('{"applied":"true","eligibility":', eligibility_json, '}');
    END IF;
    SELECT result_json AS result;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentsByDeg`(IN p_deg_id INT)
BEGIN
    SELECT 
        u.user_id, 
        u.user_name, 
        sd.name, 
        sd.f_id, 
        u.email, 
        sd.status,
        sd.s_id,
        sd.index_num,
        sd.contact_no
    FROM 
        user u
    INNER JOIN 
        student s ON u.user_id = s.user_id
    INNER JOIN 
        student_detail sd ON s.s_id = sd.s_id
    INNER JOIN 
        deg_syl ds ON sd.syl_id = ds.syl_id
    WHERE 
        u.role_id = 5 AND ds.deg_id = p_deg_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentSubjectEligibility`(
    IN `p_user_id` INT, 
    IN `p_batch_id` INT
)
main_proc: BEGIN
    DECLARE v_s_id INT DEFAULT NULL;
    DECLARE v_description VARCHAR(500) DEFAULT '';
    DECLARE current_pos INT DEFAULT 1;
    DECLARE comma_pos INT;
    DECLARE current_sub_id VARCHAR(10);
    DECLARE v_eligibility VARCHAR(50);
    DECLARE v_table_exists INT DEFAULT 0;
    DECLARE dynamic_sql TEXT;
    DECLARE result_json TEXT DEFAULT '{';
    DECLARE first_item BOOLEAN DEFAULT TRUE;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET v_table_exists = 0;
    SELECT s.s_id INTO v_s_id
    FROM student s
    WHERE s.user_id = p_user_id
    LIMIT 1;
    IF v_s_id IS NULL THEN
        SELECT '{"error": "Student not found for the given user_id"}' AS result;
        LEAVE main_proc;
    END IF;
    SELECT description INTO v_description
    FROM batch
    WHERE batch_id = p_batch_id
    LIMIT 1;
    IF v_description IS NULL OR LENGTH(v_description) = 0 THEN
        SELECT '{"error": "Batch not found or has no subjects"}' AS result;
        LEAVE main_proc;
    END IF;
    sub_parsing: LOOP
        SET comma_pos = LOCATE(',', v_description, current_pos);
        IF comma_pos > 0 THEN
            SET current_sub_id = SUBSTRING(v_description, current_pos, comma_pos - current_pos);
            SET current_pos = comma_pos + 1;
        ELSE
            SET current_sub_id = SUBSTRING(v_description, current_pos);
            IF LENGTH(current_sub_id) = 0 THEN
                LEAVE sub_parsing;
            END IF;
        END IF;
        SET current_sub_id = TRIM(current_sub_id);
        IF LENGTH(current_sub_id) = 0 THEN
            IF comma_pos = 0 THEN
                LEAVE sub_parsing;
            END IF;
            ITERATE sub_parsing;
        END IF;
        SET v_eligibility = NULL;
        SET v_table_exists = 1;
        SET dynamic_sql = CONCAT(
            'SELECT eligibility INTO @temp_eligibility FROM batch_', 
            p_batch_id, '_sub_', current_sub_id, 
            ' WHERE s_id = ', v_s_id, ' LIMIT 1'
        );
        SET @sql = dynamic_sql;
        SELECT COUNT(*) INTO v_table_exists
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = CONCAT('batch_', p_batch_id, '_sub_', current_sub_id);
        IF v_table_exists > 0 THEN
            SET @temp_eligibility = NULL;
            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
            SET v_eligibility = @temp_eligibility;
        END IF;
        IF NOT first_item THEN
            SET result_json = CONCAT(result_json, ',');
        END IF;
        SET first_item = FALSE;
        IF v_eligibility IS NULL THEN
            SET result_json = CONCAT(result_json, '"', current_sub_id, '":"none"');
        ELSEIF v_eligibility = 'true' OR v_eligibility = '1' OR LOWER(v_eligibility) = 'eligible' THEN
            SET result_json = CONCAT(result_json, '"', current_sub_id, '":"true"');
        ELSE
            SET result_json = CONCAT(result_json, '"', current_sub_id, '":"false"');
        END IF;
        IF comma_pos = 0 THEN
            LEAVE sub_parsing;
        END IF;
    END LOOP;
    SET result_json = CONCAT(result_json, '}');
    SELECT result_json AS result;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentSubjects`(IN `p_batch_id` INT, IN `p_s_id` INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE sub_id INT;
    DECLARE temp_description TEXT;
    DECLARE sub_cursor CURSOR FOR 
        SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(description, ',', n.n), ',', -1) AS UNSIGNED) AS sub_id
        FROM batch
        JOIN (
            SELECT @row := @row + 1 AS n FROM 
            (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
             SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL 
             SELECT 8 UNION ALL SELECT 9) t1,
            (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
             SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL 
             SELECT 8 UNION ALL SELECT 9) t2,
            (SELECT @row := 0) t3
        ) n
        WHERE batch_id = p_batch_id 
        AND n.n <= CHAR_LENGTH(description) - CHAR_LENGTH(REPLACE(description, ',', '')) + 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_subjects (sub_id INT);
    OPEN sub_cursor;
    subject_loop: LOOP
        FETCH sub_cursor INTO sub_id;
        IF done THEN
            LEAVE subject_loop;
        END IF;
        SET @check_query = CONCAT(
            'SELECT COUNT(*) INTO @exists 
             FROM batch_', p_batch_id, '_sub_', sub_id, 
            ' WHERE s_id = ', p_s_id
        );
        PREPARE stmt FROM @check_query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        IF @exists > 0 THEN
            INSERT INTO temp_subjects VALUES (sub_id);
        END IF;
    END LOOP;
    CLOSE sub_cursor;
    SELECT * FROM temp_subjects;
    DROP TEMPORARY TABLE temp_subjects;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentsWithoutIndexNumber`(IN `p_batch_id` INT)
BEGIN
    DECLARE table_name_students VARCHAR(255);
    SET table_name_students = CONCAT('batch_', p_batch_id, '_students');
    SET @check_table_query = CONCAT('SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "', table_name_students, '"');
    PREPARE check_table_stmt FROM @check_table_query;
    EXECUTE check_table_stmt;
    DEALLOCATE PREPARE check_table_stmt;
    IF @exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The batch students table does not exist.';
    END IF;
    SET @query_count = CONCAT(
        'SELECT COUNT(*) AS students_without_index 
         FROM ', table_name_students, ' bs
         JOIN student_detail sd ON sd.s_id = bs.s_id 
         WHERE bs.applied_to_exam = "true" AND (sd.index_num IS NULL OR sd.index_num = "")'
    );
    PREPARE stmt_count FROM @query_count;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;
    SET @query_names = CONCAT(
        'SELECT u.user_name 
         FROM ', table_name_students, ' bs
         JOIN student_detail sd ON sd.s_id = bs.s_id 
         JOIN student st ON st.s_id = sd.s_id
         JOIN user u ON u.user_id = st.user_id
         WHERE bs.applied_to_exam = "true" AND (sd.index_num IS NULL OR sd.index_num = "")'
    );
    PREPARE stmt_names FROM @query_names;
    EXECUTE stmt_names;
    DEALLOCATE PREPARE stmt_names;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSubjectBybatchAndDepartment`(IN `p_batch_id` INT, IN `p_d_id` INT)
BEGIN
    SELECT 
        c.sub_code, 
        c.sub_name, 
        c.sub_id 
    FROM 
        batch_subject_lecturer bsl 
    INNER JOIN subject c ON bsl.sub_id = c.sub_id 
    INNER JOIN dep_sub ds ON c.sub_id = ds.sub_id 
    WHERE 
        bsl.batch_id = p_batch_id AND ds.d_id = p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSubjectByBatchId`(IN `p_batch_id` INT)
BEGIN
    SELECT 
        c.sub_code, 
        c.sub_name, 
        c.sub_id 
    FROM 
        batch_subject_lecturer bsl 
    INNER JOIN subject c ON bsl.sub_id = c.sub_id 
    WHERE 
        bsl.batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSubjectById`(IN `p_sub_id` INT)
BEGIN
    SELECT 
        subject.*,
        deg_syl.deg_id,
        fac_deg.f_id,
        dep_sub.d_id
    FROM subject
    INNER JOIN deg_syl ON subject.syl_id = deg_syl.syl_id
    INNER JOIN fac_deg ON deg_syl.deg_id = fac_deg.deg_id
    INNER JOIN dep_sub ON subject.sub_id = dep_sub.sub_id
    WHERE subject.sub_id = p_sub_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSubjectsByDid`(IN `p_hod_id` INT)
BEGIN
    SELECT 
        subject.sub_id, 
        subject.sub_name, 
        subject.sem_no, 
        subject.deg_id, 
        subject.level, 
        subject.status
    FROM subject
    INNER JOIN dep_deg ON subject.deg_id = dep_deg.deg_id
    INNER JOIN dep_hod ON dep_deg.d_id = dep_hod.d_id
    WHERE 
        dep_hod.l_id = p_hod_id 
        AND subject.status = 'Active';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSubjectsByGrp`(IN `p_grp_id` INT)
BEGIN
    SELECT s.sub_id, s.sub_code, s.sub_name
    FROM subject s 
    JOIN grp_sub gs ON s.sub_id= gs.sub_id
    WHERE gs.grp_id=p_grp_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSubjectsByLecId`(IN `p_l_id` INT)
BEGIN
    SELECT subject.* 
    FROM subject 
    JOIN batch_subject_lecturer 
    ON subject.sub_id = batch_subject_lecturer.sub_id 
    WHERE batch_subject_lecturer.l_id = p_l_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSubjectsForBatch`(IN `batch_id` INT)
BEGIN
    SELECT bsl.sub_id, c.sub_code, c.sub_name FROM batch_subject_lecturer bsl JOIN subject c ON bsl.sub_id=c.sub_id  WHERE bsl.batch_id = batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSummarySubjectsData`(IN `p_batch_id` INT)
BEGIN
    SELECT 
        c.sub_code, 
        c.sub_name, 
        c.sub_id,
        ats.no_of_groups,
        ats.venues,
        ats.dates,
        ats.times
    FROM 
        batch_subject_lecturer bsl 
    INNER JOIN subject c ON bsl.sub_id = c.sub_id 
    left join attendance_subject ats on bsl.sub_id = ats.sub_id
    left join attendance att on ats.attendance_id = att.id
    WHERE 
        bsl.batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSyllabiByDegreeId`(IN `p_deg_id` INT)
BEGIN
    SELECT 
        syllabus.* 
    FROM syllabus 
    INNER JOIN deg_syl ON syllabus.syl_id = deg_syl.syl_id
    WHERE deg_syl.deg_id = p_deg_id 
      AND syllabus.status = 'true';
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSyllabusById`(IN `p_syl_id` INT)
BEGIN
    SELECT 
        s.*,
        ds.deg_id,
        fd.f_id
    FROM syllabus s
    INNER JOIN deg_syl ds ON s.syl_id = ds.syl_id
    INNER JOIN fac_deg fd ON ds.deg_id = fd.deg_id
    WHERE s.syl_id = p_syl_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByCredentials`(IN `p_user_name_or_email` VARCHAR(255), OUT `p_user_id` INT, OUT `p_password` VARCHAR(255), OUT `p_role_id` INT)
BEGIN
    SELECT user_id, password, role_id
    INTO p_user_id, p_password, p_role_id
    FROM user
    WHERE user_name = p_user_name_or_email OR email = p_user_name_or_email;
    IF p_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByResetToken`(IN `p_token` TEXT)
BEGIN
    SELECT user_id
    FROM user
    WHERE reset_token = p_token
      AND token_expiration > NOW();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetVenueById`(IN `p_id` INT)
BEGIN
    SELECT 
        *
    FROM venue 
    WHERE id = p_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetVenues`()
BEGIN
    SELECT 
        *
    FROM venue;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertBatch`(IN `p_batch_code` VARCHAR(100), IN `p_description` VARCHAR(500), IN `p_status` VARCHAR(50), IN `p_deg_id` INT, IN `p_syl_id` INT, IN `p_application_open` TIMESTAMP, IN `p_academic_year` VARCHAR(50), IN `p_level` INT(11), IN `p_sem_no` INT(11), IN `p_payment_end` TIMESTAMP, IN `p_grp_id` INT, IN `p_admin_end` TIMESTAMP, OUT `p_batch_id` INT)
BEGIN
    INSERT INTO batch (batch_code, description, status, deg_id, syl_id, application_open, payment_end, academic_year, level, sem, grp_id, admin_end)
    VALUES (p_batch_code, p_description, p_status, p_deg_id, p_syl_id, p_application_open, p_payment_end, p_academic_year, p_level, p_sem_no,p_grp_id, p_admin_end);
    SET p_batch_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertBatchSubjectLecturer`(IN `p_batch_id` INT, IN `p_subjects` TEXT)
BEGIN
    DECLARE json_length INT;
    DECLARE counter INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE l_id INT;
    SET json_length = JSON_LENGTH(p_subjects);
    WHILE counter < json_length DO
        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', counter, '].sub_id')));
        SET l_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', counter, '].l_id')));
        INSERT INTO batch_subject_lecturer (batch_id, sub_id, l_id)
        VALUES (p_batch_id, sub_id, l_id);
        SET counter = counter + 1;
    END WHILE;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertLecturer`(IN `p_user_id` INT, IN `p_l_id` INT)
BEGIN
    INSERT INTO lecturer(user_id, l_id) 
    VALUES (p_user_id,p_l_id);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertLecturerDetail`(IN `p_name` VARCHAR(255), IN `p_contact_no` VARCHAR(20), IN `p_status` VARCHAR(255), OUT `p_l_id` INT)
BEGIN
    INSERT INTO lecturer_detail(name, contact_no, status) 
    VALUES (p_name, p_contact_no, p_status);
    SET p_l_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertMedicalApplication`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_subjects_string` TEXT)
BEGIN
    DECLARE v_s_id INT;
    DECLARE v_batch_end_date TIMESTAMP;
    DECLARE v_accessible BOOLEAN DEFAULT FALSE;
    DECLARE v_medical_id INT;
    DECLARE v_subjects_left TEXT;
    DECLARE v_sub_id_text TEXT;
    DECLARE v_pos INT;
    DECLARE v_sub_id INT;
    DECLARE v_sub_exists INT;
    SELECT s.s_id INTO v_s_id
    FROM student s
    WHERE s.user_id = p_user_id;
    IF v_s_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';
    END IF;
    SELECT end_date INTO v_batch_end_date
    FROM batch_time_periods
    WHERE batch_id = p_batch_id AND user_type = '5'
    ORDER BY end_date DESC
    LIMIT 1;
    IF v_batch_end_date IS NULL OR NOW() > v_batch_end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch access expired or not found';
    END IF;
    IF EXISTS (
        SELECT 1 FROM batch b
        LEFT JOIN medical_request mr ON mr.batch_id = b.batch_id AND mr.s_id = v_s_id
        LEFT JOIN batch_time_periods bt ON bt.batch_id = b.batch_id AND bt.user_type = '5'
        INNER JOIN student_detail sd ON sd.s_id = v_s_id
        WHERE b.batch_id = p_batch_id
        AND b.syl_id = sd.syl_id
        AND b.status = 'true'
        AND (
            bt.end_date > NOW()
            OR mr.medical_id IS NOT NULL
        )
    ) THEN
        SET v_accessible = TRUE;
    END IF;
    IF NOT v_accessible THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student does not have access to the requested batch';
    END IF;
    INSERT INTO medical_request(batch_id, s_id)
    VALUES (p_batch_id, v_s_id);
    SET v_medical_id = LAST_INSERT_ID();
    SET v_subjects_left = p_subjects_string;
    subject_loop: LOOP
        SET v_pos = LOCATE(',', v_subjects_left);
        IF v_pos > 0 THEN
            SET v_sub_id_text = SUBSTRING(v_subjects_left, 1, v_pos - 1);
            SET v_subjects_left = SUBSTRING(v_subjects_left, v_pos + 1);
        ELSE
            SET v_sub_id_text = v_subjects_left;
            SET v_subjects_left = '';
        END IF;
        SET v_sub_id = CAST(v_sub_id_text AS UNSIGNED);
        SELECT COUNT(*) INTO v_sub_exists
        FROM batch_subject_lecturer
        WHERE batch_id = p_batch_id AND sub_id = v_sub_id;
        IF v_sub_exists = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Subject ID found that is not offered in this batch';
        END IF;
        IF EXISTS (
    SELECT 1 FROM resit_subject rs
    INNER JOIN resit_request rr ON rr.resit_id = rs.resit_id
    WHERE rr.s_id = v_s_id AND rr.batch_id = p_batch_id AND rs.sub_id = v_sub_id
) OR EXISTS (
    SELECT 1 FROM medical_subject ms
    INNER JOIN medical_request mr ON mr.medical_id = ms.medical_id
    WHERE mr.s_id = v_s_id AND mr.batch_id = p_batch_id AND ms.sub_id = v_sub_id
) THEN
    ITERATE subject_loop;
END IF;
        INSERT INTO medical_subject(medical_id, sub_id)
        VALUES (v_medical_id, v_sub_id);
        IF v_subjects_left = '' THEN
            LEAVE subject_loop;
        END IF;
    END LOOP subject_loop;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertResitApplication`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_subjects_string` TEXT)
BEGIN
    DECLARE v_s_id INT;
    DECLARE v_batch_end_date TIMESTAMP;
    DECLARE v_accessible BOOLEAN DEFAULT FALSE;
    DECLARE v_resit_id INT;
    DECLARE v_subject_entry TEXT;
    DECLARE v_subjects_left TEXT;
    DECLARE v_pos INT;
    DECLARE v_sub_id INT;
    DECLARE v_attempts TEXT;
    DECLARE v_attempt_1 VARCHAR(50);
    DECLARE v_attempt_2 VARCHAR(50);
    DECLARE v_attempt_3 VARCHAR(50);
    DECLARE v_sub_exists INT;
    SELECT s.s_id INTO v_s_id
    FROM student s
    WHERE s.user_id = p_user_id;
    IF v_s_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';
    END IF;
    SELECT end_date INTO v_batch_end_date
    FROM batch_time_periods
    WHERE batch_id = p_batch_id AND user_type = '5'
    ORDER BY end_date DESC
    LIMIT 1;
    IF v_batch_end_date IS NULL OR NOW() > v_batch_end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch access expired or not found';
    END IF;
    IF EXISTS (
        SELECT 1 FROM batch b
        LEFT JOIN resit_request rr ON rr.batch_id = b.batch_id AND rr.s_id = v_s_id
        LEFT JOIN batch_time_periods bt ON bt.batch_id = b.batch_id AND bt.user_type = '5'
        INNER JOIN student_detail sd ON sd.s_id = v_s_id
        WHERE b.batch_id = p_batch_id
        AND b.syl_id = sd.syl_id
        AND b.status = 'true'
        AND (
            bt.end_date > NOW()
            OR rr.resit_id IS NOT NULL
        )
    ) THEN
        SET v_accessible = TRUE;
    END IF;
    IF NOT v_accessible THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student does not have access to the requested batch';
    END IF;
    INSERT INTO resit_request(batch_id, s_id)
    VALUES (p_batch_id, v_s_id);
    SET v_resit_id = LAST_INSERT_ID();
    SET v_subjects_left = p_subjects_string;
    subject_loop: LOOP
        SET v_pos = LOCATE(';', v_subjects_left);
        IF v_pos > 0 THEN
            SET v_subject_entry = SUBSTRING(v_subjects_left, 1, v_pos - 1);
            SET v_subjects_left = SUBSTRING(v_subjects_left, v_pos + 1);
        ELSE
            SET v_subject_entry = v_subjects_left;
            SET v_subjects_left = '';
        END IF;
        SET v_pos = LOCATE('|', v_subject_entry);
        SET v_sub_id = CAST(SUBSTRING(v_subject_entry, 1, v_pos - 1) AS UNSIGNED);
        SET v_attempts = SUBSTRING(v_subject_entry, v_pos + 1);
        SET v_attempt_1 = SUBSTRING_INDEX(v_attempts, ',', 1);
        SET v_attempt_2 = SUBSTRING_INDEX(SUBSTRING_INDEX(v_attempts, ',', 2), ',', -1);
        SET v_attempt_3 = SUBSTRING_INDEX(v_attempts, ',', -1);
        IF v_attempt_1 = '#' THEN SET v_attempt_1 = ''; END IF;
        IF v_attempt_2 = '#' THEN SET v_attempt_2 = ''; END IF;
        IF v_attempt_3 = '#' THEN SET v_attempt_3 = ''; END IF;
        SELECT COUNT(*) INTO v_sub_exists
        FROM batch_subject_lecturer
        WHERE batch_id = p_batch_id AND sub_id = v_sub_id;
        IF v_sub_exists = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Subject ID found that is not offered in this batch';
        END IF;
		IF EXISTS (
    SELECT 1 FROM resit_subject rs
    INNER JOIN resit_request rr ON rr.resit_id = rs.resit_id
    WHERE rr.s_id = v_s_id AND rr.batch_id = p_batch_id AND rs.sub_id = v_sub_id
) OR EXISTS (
    SELECT 1 FROM medical_subject ms
    INNER JOIN medical_request mr ON mr.medical_id = ms.medical_id
    WHERE mr.s_id = v_s_id AND mr.batch_id = p_batch_id AND ms.sub_id = v_sub_id
) THEN
    ITERATE subject_loop;
END IF;
        INSERT INTO resit_subject(resit_id, sub_id, attempt_1, attempt_2, attempt_3)
        VALUES (v_resit_id, v_sub_id, v_attempt_1, v_attempt_2, v_attempt_3);
        IF v_subjects_left = '' THEN
            LEAVE subject_loop;
        END IF;
    END LOOP subject_loop;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertStudent`(IN `p_user_id` INT, IN `p_s_id` INT)
BEGIN
    INSERT INTO student(user_id,s_id) 
    VALUES (p_user_id, p_s_id);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertStudentDetail`(IN `p_name` VARCHAR(255), IN `p_f_id` INT, IN `p_syl_id` INT, IN `p_status` VARCHAR(255), IN `p_index_num` VARCHAR(50), IN `p_contact_no` VARCHAR(100), OUT `p_s_id` INT)
BEGIN
    INSERT INTO student_detail(name, f_id, syl_id, status, index_num, contact_no) 
    VALUES (p_name, p_f_id, p_syl_id, p_status,p_index_num,p_contact_no);
    SET p_s_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertUser`(IN `p_user_name` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_role_id` INT, OUT `p_user_id` INT)
BEGIN
    INSERT INTO user(user_name, email, password, role_id) 
    VALUES (p_user_name, p_email, p_password, p_role_id);
    SET p_user_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LinkDegreeWithFaculty`(IN `p_f_id` INT, IN `p_deg_id` INT)
BEGIN
    INSERT INTO fac_deg(f_id, deg_id)
    VALUES (p_f_id, p_deg_id);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LinkFacultyDepartment`(IN `p_f_id` INT, IN `p_d_id` INT)
BEGIN
    INSERT INTO fac_dep(f_id, d_id)
    VALUES (p_f_id, p_d_id);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LinkGroupWithSyllabus`(IN `p_grp_id` INT, IN `p_syl_id` INT)
BEGIN
    INSERT INTO syl_grp(grp_id, syl_id)
    VALUES (p_grp_id, p_syl_id);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LinkSubjectWithGroup`(IN `p_sub_id` INT, IN `p_grp_id` INT)
BEGIN
    INSERT INTO grp_sub(sub_id, grp_id)
    VALUES (p_sub_id, p_grp_id);
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LogAdminAction`(IN `p_description` TEXT)
BEGIN
    INSERT INTO admin_log (description, date_time)
    VALUES (p_description, CURRENT_TIMESTAMP());
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LogEligibilityChange`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_exam` INT, IN `p_sub_id` INT, IN `p_status_from` VARCHAR(50), IN `p_status_to` VARCHAR(50), IN `p_remark` TEXT)
BEGIN
    INSERT INTO eligibility_log (user_id, s_id, exam, sub_id, status_from, status_to, remark, date_time)
    VALUES (p_user_id, p_s_id, p_exam, p_sub_id, p_status_from, p_status_to, p_remark, CURRENT_TIMESTAMP());
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LogStudentAction`(IN `p_user_id` INT, IN `p_exam` INT, IN `p_description` TEXT)
BEGIN
    INSERT INTO students_log (user_id, exam, description, date_time)
    VALUES (p_user_id, p_exam, p_description, CURRENT_TIMESTAMP());
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `MoveToMedical`(IN p_resit_subject_id INT)
BEGIN
    DECLARE v_batch_id INT;
    DECLARE v_s_id INT;
    DECLARE v_sub_id INT;
    DECLARE v_medical_id INT;
    SELECT rr.batch_id, rr.s_id, rs.sub_id
    INTO v_batch_id, v_s_id, v_sub_id
    FROM resit_subject rs
    JOIN resit_request rr ON rs.resit_id = rr.resit_id
    WHERE rs.id = p_resit_subject_id;
    SELECT medical_id INTO v_medical_id
    FROM medical_request
    WHERE batch_id = v_batch_id AND s_id = v_s_id
    LIMIT 1;
    IF v_medical_id IS NULL THEN
        INSERT INTO medical_request (batch_id, s_id, subjects_verified, payment_verified, status)
        VALUES (v_batch_id, v_s_id, 'false', 'false', '');
        SET v_medical_id = LAST_INSERT_ID();
    END IF;
    INSERT INTO medical_subject (medical_id, sub_id, eligibility)
    VALUES (v_medical_id, v_sub_id, 'true');
    DELETE FROM resit_subject WHERE id = p_resit_subject_id;
    UPDATE medical_request SET subjects_verified = 'false' WHERE medical_id = v_medical_id;
    UPDATE resit_request SET subjects_verified = 'false' WHERE batch_id = v_batch_id AND s_id = v_s_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `MoveToResit`(IN p_medical_subject_id INT)
BEGIN
    DECLARE v_batch_id INT;
    DECLARE v_s_id INT;
    DECLARE v_sub_id INT;
    DECLARE v_resit_id INT;
    SELECT mr.batch_id, mr.s_id, ms.sub_id
    INTO v_batch_id, v_s_id, v_sub_id
    FROM medical_subject ms
    JOIN medical_request mr ON ms.medical_id = mr.medical_id
    WHERE ms.id = p_medical_subject_id;
    SELECT resit_id INTO v_resit_id
    FROM resit_request
    WHERE batch_id = v_batch_id AND s_id = v_s_id
    LIMIT 1;
    IF v_resit_id IS NULL THEN
        INSERT INTO resit_request (batch_id, s_id, subjects_verified, payment_verified, status)
        VALUES (v_batch_id, v_s_id, 'false', 'false', '');
        SET v_resit_id = LAST_INSERT_ID();
    END IF;
    INSERT INTO resit_subject (resit_id, sub_id, attempt_1, attempt_2, attempt_3, eligibility)
    VALUES (v_resit_id, v_sub_id, 'F', '', '', 'true');
    DELETE FROM medical_subject WHERE id = p_medical_subject_id;
    UPDATE resit_request SET subjects_verified = 'false' WHERE resit_id = v_resit_id;
    UPDATE medical_request SET subjects_verified = 'false' WHERE batch_id = v_batch_id AND s_id = v_s_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RejectMedicalResitApplication`(
    IN p_batch_id INT,
    IN p_s_id INT
)
BEGIN
    UPDATE resit_request
    SET status = 'false'
    WHERE batch_id = p_batch_id AND s_id = p_s_id;
    UPDATE medical_request
    SET status = 'false'
    WHERE batch_id = p_batch_id AND s_id = p_s_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RemoveStudentsFromBatch`(IN `p_batch_id` INT, IN `p_removed_students` TEXT)
BEGIN
    DECLARE drop_query TEXT;
    SET @update_query = CONCAT(
        'UPDATE student_detail SET batch_ids = CASE ',
        'WHEN TRIM(BOTH \',\' FROM REPLACE(CONCAT(\',\', batch_ids, \',\'), CONCAT(\',\', ', p_batch_id, ', \',\'), \',\')) = \'\' THEN \'\' ',
        'ELSE TRIM(BOTH \',\' FROM REPLACE(CONCAT(\',\', batch_ids, \',\'), CONCAT(\',\', ', p_batch_id, ', \',\'), \',\')) ',
        'END WHERE s_id IN (', p_removed_students, ')'
    );
    PREPARE update_stmt FROM @update_query;
    EXECUTE update_stmt;
    DEALLOCATE PREPARE update_stmt;
    SET drop_query = CONCAT(
        'DELETE FROM batch_', p_batch_id, '_students WHERE s_id IN (', p_removed_students, ')'
    );
    SET @stmt = drop_query;
    PREPARE drop_stmt FROM @stmt;
    EXECUTE drop_stmt;
    DEALLOCATE PREPARE drop_stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RequestedStudents`(IN `p_batch_id` INT, IN `p_sub_id` INT)
BEGIN
    (
        SELECT rr.s_id, 'R' AS exam_type, rs.eligibility
        FROM resit_request rr
        JOIN resit_subject rs ON rr.resit_id = rs.resit_id
        WHERE rr.batch_id = p_batch_id
          AND rs.sub_id = p_sub_id
    )
    UNION
    (
        SELECT mr.s_id, 'M' AS exam_type, ms.eligibility
        FROM medical_request mr
        JOIN medical_subject ms ON mr.medical_id = ms.medical_id
        WHERE mr.batch_id = p_batch_id
          AND ms.sub_id = p_sub_id
    );
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RevokeStudentEntry`(IN `p_batch_id` INT, IN `p_s_id` INT)
main_proc: BEGIN
    DECLARE v_medical_id INT DEFAULT NULL;
    DECLARE v_resit_id INT DEFAULT NULL;
    DECLARE v_description VARCHAR(500) DEFAULT '';
    DECLARE v_academic_year VARCHAR(50) DEFAULT '';
    DECLARE v_level INT DEFAULT NULL;
    DECLARE v_sem INT DEFAULT NULL;
    DECLARE current_pos INT DEFAULT 1;
    DECLARE comma_pos INT;
    DECLARE current_sub_id VARCHAR(10);
    DECLARE dynamic_sql TEXT;
    DECLARE v_table_exists INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET v_table_exists = 0;
    SELECT description, academic_year, level, sem 
    INTO v_description, v_academic_year, v_level, v_sem
    FROM batch
    WHERE batch_id = p_batch_id
    LIMIT 1;
    IF v_description IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch not found for the given batch_id';
    END IF;
    SELECT medical_id INTO v_medical_id
    FROM medical_request
    WHERE batch_id = p_batch_id AND s_id = p_s_id
    LIMIT 1;
    SELECT resit_id INTO v_resit_id
    FROM resit_request
    WHERE batch_id = p_batch_id AND s_id = p_s_id
    LIMIT 1;
    IF v_medical_id IS NOT NULL THEN
        DELETE FROM medical_subject WHERE medical_id = v_medical_id;
        DELETE FROM medical_request WHERE medical_id = v_medical_id;
    END IF;
    IF v_resit_id IS NOT NULL THEN
        DELETE FROM resit_subject WHERE resit_id = v_resit_id;
        DELETE FROM resit_request WHERE resit_id = v_resit_id;
    END IF;
    IF LENGTH(v_description) > 0 THEN
        sub_parsing: LOOP
            SET comma_pos = LOCATE(',', v_description, current_pos);
            IF comma_pos > 0 THEN
                SET current_sub_id = SUBSTRING(v_description, current_pos, comma_pos - current_pos);
                SET current_pos = comma_pos + 1;
            ELSE
                SET current_sub_id = SUBSTRING(v_description, current_pos);
                IF LENGTH(current_sub_id) = 0 THEN
                    LEAVE sub_parsing;
                END IF;
            END IF;
            SET current_sub_id = TRIM(current_sub_id);
            IF LENGTH(current_sub_id) = 0 THEN
                IF comma_pos = 0 THEN
                    LEAVE sub_parsing;
                END IF;
                ITERATE sub_parsing;
            END IF;
            SELECT COUNT(*) INTO v_table_exists
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
            AND table_name = CONCAT('batch_', p_batch_id, '_sub_', current_sub_id);
            IF v_table_exists > 0 THEN
                SET dynamic_sql = CONCAT(
                    'DELETE FROM batch_', p_batch_id, '_sub_', current_sub_id,
                    ' WHERE s_id = ', p_s_id
                );
                SET @sql = dynamic_sql;
                PREPARE stmt FROM @sql;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
            END IF;
            IF comma_pos = 0 THEN
                LEAVE sub_parsing;
            END IF;
        END LOOP;
    END IF;
    SET dynamic_sql = CONCAT(
        'UPDATE batch_', p_batch_id, '_students SET applied_to_exam = "false" WHERE s_id = ', p_s_id
    );
    SET @sql = dynamic_sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    DELETE FROM entry_summary 
    WHERE s_id = p_s_id 
    AND academic_year = v_academic_year 
    AND level = v_level 
    AND sem = v_sem;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RevokeStudentRequest`(
    IN `p_batch_id` INT,
    IN `p_s_id` INT
)
main_proc: BEGIN
    DECLARE v_medical_id INT DEFAULT NULL;
    DECLARE v_resit_id INT DEFAULT NULL;
    SELECT medical_id INTO v_medical_id
    FROM medical_request
    WHERE batch_id = p_batch_id AND s_id = p_s_id
    LIMIT 1;
    SELECT resit_id INTO v_resit_id
    FROM resit_request
    WHERE batch_id = p_batch_id AND s_id = p_s_id
    LIMIT 1;
    IF v_medical_id IS NULL AND v_resit_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No medical or resit request found for the given batch_id and s_id';
    END IF;
    IF v_medical_id IS NOT NULL THEN
        DELETE FROM medical_subject WHERE medical_id = v_medical_id;
        DELETE FROM medical_request WHERE medical_id = v_medical_id;
    END IF;
    IF v_resit_id IS NOT NULL THEN
        DELETE FROM resit_subject WHERE resit_id = v_resit_id;
        DELETE FROM resit_request WHERE resit_id = v_resit_id;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SetApproval`(IN `p_batch_id` INT, IN `p_role_id` INT)
BEGIN
    DECLARE v_accepted_field VARCHAR(50);
    IF p_role_id = 3 THEN
        update batch
        SET
        hod_accepted = "true"
        WHERE batch_id = p_batch_id;        
    ELSE
        update batch
        SET
        dean_accepted = "true"
        WHERE batch_id = p_batch_id;    
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `StoreResetToken`(IN `p_user_id` INT, IN `p_hashed_token` TEXT, IN `p_expiration` TIMESTAMP)
BEGIN
    UPDATE user
    SET reset_token = p_hashed_token,
        token_expiration = p_expiration
    WHERE user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateAdmissionData`(IN `p_batch_id` INT, IN `p_generated_date` VARCHAR(250), IN `p_subject_list` VARCHAR(250), IN `p_exam_date` VARCHAR(250), IN `p_exam_held_date` VARCHAR(250), IN `p_description` TEXT, IN `p_instructions` TEXT, IN `p_provider` TEXT)
BEGIN
    IF EXISTS (SELECT 1 FROM admission WHERE batch_id = p_batch_id) THEN
        UPDATE admission
        SET 
            generated_date = p_generated_date,
            subject_list = p_subject_list,
            exam_date = p_exam_date,
            exam_held_date = p_exam_held_date,
            description = p_description,
            instructions = p_instructions,
            provider = p_provider
        WHERE batch_id = p_batch_id;
    ELSE
        INSERT INTO admission (batch_id, generated_date, subject_list, exam_date, exam_held_date, description, instructions, provider)
        VALUES (p_batch_id, p_generated_date, p_subject_list, p_exam_date, p_exam_held_date, p_description, p_instructions, p_provider);
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateAttendanceData`(IN `p_batch_id` INT, IN `p_exam_date` VARCHAR(250), IN `p_exam_held_date` VARCHAR(250), IN `p_description` TEXT, IN `p_no_of_groups` INT, IN `p_venues` TEXT, IN `p_dates` VARCHAR(250), IN `p_times` VARCHAR(250), IN `p_student_detail` TEXT, IN `p_sub_id` INT)
BEGIN
	DECLARE p_attendance_id INT(11);
    IF EXISTS (SELECT 1 FROM attendance WHERE batch_id = p_batch_id) THEN
UPDATE attendance
        SET 
            exam_date = p_exam_date,
            exam_held_date=p_exam_held_date,
            description = p_description
        WHERE batch_id = p_batch_id;
    ELSE
        INSERT INTO attendance (batch_id, exam_date, exam_held_date, description)
        VALUES (p_batch_id, p_exam_date,p_exam_held_date, p_description);
    END IF;
    select id into p_attendance_id from attendance where batch_id=p_batch_id;
     IF EXISTS (SELECT 1 FROM attendance_subject WHERE attendance_id = p_attendance_id) THEN
UPDATE attendance_subject
        SET 
        no_of_groups=p_no_of_groups,
            venues = p_venues,
            dates = p_dates,
            times = p_times,
            student_detail = p_student_detail
        WHERE attendance_id = p_attendance_id;
    ELSE
        INSERT INTO attendance_subject (attendance_id, sub_id, venues, dates, times, student_detail,no_of_groups)
        VALUES (p_attendance_id, p_sub_id, p_venues, p_dates, p_times, p_student_detail,p_no_of_groups);
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateBatchDetails`(IN `p_batch_id` INT, IN `p_batch_code` VARCHAR(100), IN `p_description` VARCHAR(500), IN `p_deg_id` INT, IN `p_syl_id` INT, IN `p_application_open` TIMESTAMP, IN `p_academic_year` VARCHAR(50), IN `p_level` INT(11), IN `p_sem_no` INT(11), IN `p_payment_end` TIMESTAMP, IN `p_grp_id` INT, IN `p_admin_end` TIMESTAMP)
BEGIN
    UPDATE batch
    SET batch_code = p_batch_code, description = p_description, deg_id = p_deg_id, syl_id = p_syl_id, application_open = p_application_open, payment_end = p_payment_end, academic_year= p_academic_year, level = p_level, sem = p_sem_no, grp_id=p_grp_id, admin_end=p_admin_end
    WHERE batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateBatchStatus`(IN `p_batch_id` INT, IN `p_status` VARCHAR(50))
BEGIN
    UPDATE batch
    SET status = p_status
    WHERE batch_id = p_batch_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateDegreeDetails`(IN `p_deg_id` INT, IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_levels` VARCHAR(255), IN `p_no_of_sem_per_year` VARCHAR(10))
BEGIN
    UPDATE degree
    SET deg_name = p_deg_name,
        short = p_short,
        levels = p_levels,
        no_of_sem_per_year = p_no_of_sem_per_year
    WHERE deg_id = p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateDegreeStatus`(IN `p_deg_id` INT, IN `p_status` VARCHAR(50))
BEGIN
    UPDATE degree
    SET 
        status = p_status
    WHERE deg_id = p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateDepartmentDetails`(IN `p_d_id` INT, IN `p_d_name` VARCHAR(255), IN `p_contact_no` VARCHAR(50))
BEGIN
    UPDATE department
    SET d_name = p_d_name,
        contact_no = p_contact_no
    WHERE d_id = p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateDepartmentStatus`(IN `p_d_id` INT, IN `p_status` VARCHAR(50))
BEGIN
    UPDATE department
    SET 
        status = p_status
    WHERE d_id = p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateDepartmentUser`(IN `p_user_id` INT, IN `p_email` VARCHAR(255))
BEGIN
    UPDATE user
    SET user_name = p_email,
        email = p_email
    WHERE user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateEligibility`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_sub_id` INT, IN `p_batch_id` INT, IN `p_eligibility` VARCHAR(50), IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE p_l_id INT;
    DECLARE batch_status VARCHAR(50);
    SELECT status INTO batch_status
    FROM batch
    WHERE batch_id = p_batch_id;
    IF batch_status != 'true' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';
    END IF;
    IF p_role_id != '1' THEN
        IF p_role_id = '4' THEN
            SELECT l_id INTO p_l_id FROM lecturer WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(*) INTO @access_count
            FROM batch_subject_lecturer
            WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '4' AND end_date > NOW();
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSEIF p_role_id = '3' THEN
            SELECT d_id INTO p_l_id FROM department WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(ds.d_id) INTO @access_count
            FROM subject s
            JOIN dep_sub ds ON s.sub_id = ds.sub_id
            WHERE s.sub_id=p_sub_id AND ds.d_id=p_l_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '3' AND end_date > NOW()
              AND (SELECT COUNT(*) FROM batch_time_periods 
                   WHERE batch_id = p_batch_id AND user_type = '4' AND end_date < NOW()) > 0;
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSEIF p_role_id = '2' THEN
            SELECT f_id INTO p_l_id FROM faculty WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(fd.f_id) INTO @access_count
            FROM subject s
            INNER JOIN deg_syl ds ON s.syl_id = ds.syl_id
            INNER JOIN fac_deg fd ON ds.deg_id = fd.deg_id
            WHERE fd.f_id = p_l_id AND s.sub_id = p_sub_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '2' AND end_date > NOW()
              AND (SELECT COUNT(*) FROM batch_time_periods 
                   WHERE batch_id = p_batch_id AND user_type = '3' AND end_date < NOW()) > 0;
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
    END IF;
    SET @query = CONCAT(
        'UPDATE batch_', p_batch_id, '_sub_', p_sub_id, 
        ' SET eligibility = ? WHERE s_id = ?'
    );
    SET @eligibility = p_eligibility;
    SET @s_id = p_s_id;
    PREPARE stmt FROM @query;
    EXECUTE stmt USING @eligibility, @s_id;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateFacDeg`(IN `p_f_id` INT, IN `p_deg_id` INT)
BEGIN
    UPDATE fac_deg
    SET f_id = p_f_id
    WHERE deg_id = p_deg_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateFacultyDepartmentLink`(IN `p_f_id` INT, IN `p_d_id` INT)
BEGIN
    UPDATE fac_dep
    SET f_id = p_f_id
    WHERE d_id = p_d_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateFacultyDetails`(IN `p_f_id` INT, IN `p_f_name` VARCHAR(255), IN `p_contact_no` VARCHAR(50))
BEGIN
    UPDATE faculty
    SET f_name = p_f_name,
        contact_no = p_contact_no
    WHERE f_id = p_f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateFacultyStatus`(IN `p_f_id` INT, IN `p_status` VARCHAR(50))
BEGIN
    UPDATE faculty
    SET 
        status = p_status
    WHERE f_id = p_f_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateGroup`(IN `p_grp_id` INT, IN `p_grp_code` VARCHAR(250), IN `p_level` INT, IN `p_sem_no` INT, IN `p_custom_suffix` VARCHAR(250), IN `p_course_title` VARCHAR(500))
BEGIN
    UPDATE grp
    SET 
        grp_code = p_grp_code,
        level = p_level,
        sem_no = p_sem_no,
        course_title = p_course_title,
        custom_suffix = p_custom_suffix
    WHERE grp_id = p_grp_id;   
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateGroupStatus`(IN `p_grp_id` INT, IN `p_status` VARCHAR(50))
BEGIN
    UPDATE grp
    SET 
        status = p_status
    WHERE grp_id = p_grp_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateLecturer`(IN `p_name` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_user_name` VARCHAR(255), IN `p_contact_no` VARCHAR(50), IN `p_l_id` INT)
BEGIN
    IF EXISTS (
        SELECT 1 FROM user u
        INNER JOIN lecturer l ON u.user_id = l.user_id
        WHERE (u.email = p_email OR u.user_name = p_user_name) AND l.l_id != p_l_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email or username already exists';
    END IF;
    UPDATE lecturer_detail 
    SET 
        name = p_name, 
        contact_no = p_contact_no
    WHERE l_id = p_l_id;
    UPDATE user u 
    INNER JOIN lecturer l ON u.user_id = l.user_id 
    SET 
        u.email = p_email,
        u.user_name = p_user_name
    WHERE l.l_id = p_l_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateLecturerStatus`(IN `p_status` VARCHAR(50), IN `p_l_id` INT)
BEGIN
    UPDATE lecturer_detail 
    SET 
        status = p_status 
    WHERE l_id = p_l_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateMedicalEligibility`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_sub_id` INT, IN `p_batch_id` INT, IN `p_eligibility` VARCHAR(50), IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE p_l_id INT;
    DECLARE batch_status VARCHAR(50);
    SELECT status INTO batch_status
    FROM batch
    WHERE batch_id = p_batch_id;
    IF batch_status != 'true' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';
    END IF;
    IF p_role_id != '1' THEN
        IF p_role_id = '4' THEN
            SELECT l_id INTO p_l_id FROM lecturer WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(*) INTO @access_count
            FROM batch_subject_lecturer
            WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '4' AND end_date > NOW();
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSEIF p_role_id = '3' THEN
            SELECT d_id INTO p_l_id FROM department WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(ds.d_id) INTO @access_count
            FROM subject s
            JOIN dep_sub ds ON s.sub_id = ds.sub_id
            WHERE s.sub_id=p_sub_id AND ds.d_id=p_l_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '3' AND end_date > NOW()
              AND (SELECT COUNT(*) FROM batch_time_periods 
                   WHERE batch_id = p_batch_id AND user_type = '4' AND end_date < NOW()) > 0;
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSEIF p_role_id = '2' THEN
            SELECT f_id INTO p_l_id FROM faculty WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(fd.f_id) INTO @access_count
            FROM subject s
            INNER JOIN deg_syl ds ON s.syl_id = ds.syl_id
            INNER JOIN fac_deg fd ON ds.deg_id = fd.deg_id
            WHERE fd.f_id = p_l_id AND s.sub_id = p_sub_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '2' AND end_date > NOW()
              AND (SELECT COUNT(*) FROM batch_time_periods 
                   WHERE batch_id = p_batch_id AND user_type = '3' AND end_date < NOW()) > 0;
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
    END IF;
    SET @query = CONCAT(
        'UPDATE medical_subject ms JOIN medical_request mr ON mr.medical_id = ms.medical_id SET ms.eligibility = ? WHERE mr.s_id = ? AND ms.sub_id = ?'
    );
    SET @eligibility = p_eligibility;
    SET @s_id = p_s_id;
    SET @sub_id = p_sub_id;
    PREPARE stmt FROM @query;
    EXECUTE stmt USING @eligibility, @s_id, @sub_id;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateMedicalPaymentVerified`(
    IN p_medical_id INT,
    IN p_verified VARCHAR(50)
)
BEGIN
    UPDATE medical_request
    SET payment_verified = p_verified
    WHERE medical_id = p_medical_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateMedicalReference`(
    IN p_medical_id INT,
    IN p_reference VARCHAR(500)
)
BEGIN
    UPDATE medical_request
    SET reference = p_reference
    WHERE medical_id = p_medical_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateMedicalSubjectsVerified`(
    IN p_medical_id INT,
    IN p_verified VARCHAR(50)
)
BEGIN
    UPDATE medical_request
    SET subjects_verified = p_verified
    WHERE medical_id = p_medical_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateRequestReference`(
    IN in_user_id INT,
    IN in_batch_id INT,
    IN in_type VARCHAR(50),
    IN in_reference TEXT
)
BEGIN
    DECLARE student_id INT;
    SELECT s_id INTO student_id
    FROM student
    WHERE user_id = in_user_id;
    IF in_type = 'medical' THEN
        UPDATE medical_request
        SET reference = in_reference
        WHERE batch_id = in_batch_id AND s_id = student_id;
    ELSEIF in_type = 'resit' THEN
        UPDATE resit_request
        SET reference = in_reference
        WHERE batch_id = in_batch_id AND s_id = student_id;
    END IF;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateResitEligibility`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_sub_id` INT, IN `p_batch_id` INT, IN `p_eligibility` VARCHAR(50), IN `p_role_id` VARCHAR(50))
BEGIN
    DECLARE p_l_id INT;
    DECLARE batch_status VARCHAR(50);
    SELECT status INTO batch_status
    FROM batch
    WHERE batch_id = p_batch_id;
    IF batch_status != 'true' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';
    END IF;
    IF p_role_id != '1' THEN
        IF p_role_id = '4' THEN
            SELECT l_id INTO p_l_id FROM lecturer WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(*) INTO @access_count
            FROM batch_subject_lecturer
            WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '4' AND end_date > NOW();
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSEIF p_role_id = '3' THEN
            SELECT d_id INTO p_l_id FROM department WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(ds.d_id) INTO @access_count
            FROM subject s
            JOIN dep_sub ds ON s.sub_id = ds.sub_id
            WHERE s.sub_id=p_sub_id AND ds.d_id=p_l_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '3' AND end_date > NOW()
              AND (SELECT COUNT(*) FROM batch_time_periods 
                   WHERE batch_id = p_batch_id AND user_type = '4' AND end_date < NOW()) > 0;
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSEIF p_role_id = '2' THEN
            SELECT f_id INTO p_l_id FROM faculty WHERE user_id = p_user_id;
            IF p_l_id IS NULL THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
            END IF;
            SELECT COUNT(fd.f_id) INTO @access_count
            FROM subject s
            INNER JOIN deg_syl ds ON s.syl_id = ds.syl_id
            INNER JOIN fac_deg fd ON ds.deg_id = fd.deg_id
            WHERE fd.f_id = p_l_id AND s.sub_id = p_sub_id;
            IF @access_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to modify this batch.';
            END IF;
            SELECT COUNT(*) INTO @deadline_count
            FROM batch_time_periods
            WHERE batch_id = p_batch_id AND user_type = '2' AND end_date > NOW()
              AND (SELECT COUNT(*) FROM batch_time_periods 
                   WHERE batch_id = p_batch_id AND user_type = '3' AND end_date < NOW()) > 0;
            IF @deadline_count = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User cross the dealine of this batch.';
            END IF;
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';
        END IF;
    END IF;
    SET @query = CONCAT(
        'UPDATE resit_subject rs JOIN resit_request rr ON rr.resit_id = rs.resit_id SET rs.eligibility = ? WHERE rr.s_id = ? AND rs.sub_id = ?'
    );
    SET @eligibility = p_eligibility;
    SET @s_id = p_s_id;
    SET @sub_id = p_sub_id;
    PREPARE stmt FROM @query;
    EXECUTE stmt USING @eligibility, @s_id, @sub_id;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateResitPaymentVerified`(
    IN p_resit_id INT,
    IN p_verified VARCHAR(50)
)
BEGIN
    UPDATE resit_request
    SET payment_verified = p_verified
    WHERE resit_id = p_resit_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateResitReference`(
    IN p_resit_id INT,
    IN p_reference VARCHAR(500)
)
BEGIN
    UPDATE resit_request
    SET reference = p_reference
    WHERE resit_id = p_resit_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateResitSubjectsVerified`(
    IN p_resit_id INT,
    IN p_verified VARCHAR(50)
)
BEGIN
    UPDATE resit_request
    SET subjects_verified = p_verified
    WHERE resit_id = p_resit_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateStudent`(IN `p_name` VARCHAR(255), IN `p_f_id` INT, IN `p_s_id` INT, IN `p_email` VARCHAR(255), IN `p_user_name` VARCHAR(255), IN `p_contact_no` VARCHAR(100), IN `p_index_num` VARCHAR(50))
BEGIN
    DECLARE exit handler FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'An unexpected error occurred';
    END;
    START TRANSACTION;
    IF EXISTS (
        SELECT 1 
        FROM user u
        INNER JOIN student s ON u.user_id = s.user_id
        WHERE (u.email = p_email OR u.user_name = p_user_name) AND s.s_id != p_s_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email or username already exists';
    END IF;
    IF EXISTS (
        SELECT 1 
        FROM student s
        INNER JOIN student_detail sd ON s.s_id = sd.s_id
        WHERE sd.index_num = p_index_num 
          AND sd.index_num IS NOT NULL 
          AND sd.index_num != '' 
          AND s.s_id != p_s_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Index number already exists';
    END IF;
    UPDATE student_detail 
    SET 
        name = p_name, 
        f_id = p_f_id,
        contact_no = p_contact_no,
        index_num = p_index_num
    WHERE s_id = p_s_id;
    UPDATE user u 
    INNER JOIN student s ON u.user_id = s.user_id 
    SET 
        u.email = p_email,
        u.user_name = p_user_name
    WHERE s.s_id = p_s_id;
    COMMIT;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateStudentBatchIds`(IN `p_batch_id` INT, IN `p_s_id` INT)
BEGIN
        UPDATE student_detail
        SET batch_ids = 
            CASE
                WHEN batch_ids IS NULL OR batch_ids = '' THEN p_batch_id
                ELSE CONCAT(batch_ids, ',', p_batch_id)
            END
        WHERE s_id = p_s_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateStudentStatus`(IN `p_status` VARCHAR(50), IN `p_s_id` INT)
BEGIN
    UPDATE student_detail 
    SET 
        status = p_status 
    WHERE s_id = p_s_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSubject`(IN `p_sub_id` INT, IN `p_sub_code` VARCHAR(100), IN `p_sub_name` VARCHAR(150), IN `p_sem_no` INT, IN `p_syl_id` INT, IN `p_d_id` INT, IN `p_level` INT, IN `p_assignment_min_mark` INT, IN `p_pass_grade` INT) NOT DETERMINISTIC CONTAINS SQL SQL SECURITY DEFINER BEGIN UPDATE subject SET sub_code = p_sub_code, sub_name = p_sub_name, sem_no = p_sem_no, syl_id = p_syl_id, pass_grade = p_pass_grade, level = p_level, assignment_min_mark = p_assignment_min_mark WHERE sub_id = p_sub_id; update dep_sub SET d_id = p_d_id WHERE sub_id = p_sub_id; END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSubjectStatus`(IN `p_sub_id` INT, IN `p_status` VARCHAR(50))
BEGIN
    UPDATE subject
    SET 
        status = p_status
    WHERE sub_id = p_sub_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSylGrp`(IN `p_syl_id` INT, IN `p_grp_id` INT)
BEGIN
    UPDATE syl_grp
    SET syl_id = p_syl_id
    WHERE grp_id = p_grp_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSyllabus`(IN `p_deg_id` INT, IN `p_commenced_year` YEAR, IN `p_expired_year` VARCHAR(10), IN `p_syl_id` INT)
BEGIN
    UPDATE syllabus
    SET 
        commenced_year = p_commenced_year,
        expired_year = p_expired_year
    WHERE syl_id = p_syl_id;
    UPDATE deg_syl
    SET 
        deg_id = p_deg_id
    WHERE syl_id = p_syl_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateSyllabusStatus`(IN `p_syl_id` INT, IN `p_status` VARCHAR(50))
BEGIN
    UPDATE syllabus
    SET 
        status = p_status
    WHERE syl_id = p_syl_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateUserDetails`(IN `p_user_id` INT, IN `p_email` VARCHAR(255))
BEGIN
    UPDATE user
    SET user_name = p_email,
        email = p_email
    WHERE user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateUserPassword`(IN `p_user_id` INT, IN `p_hashed_password` TEXT)
BEGIN
    UPDATE user
    SET password = p_hashed_password,
        reset_token = NULL,
        token_expiration = NULL
    WHERE user_id = p_user_id;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateVenue`(
    IN `p_id` INT,
    IN `p_short_code` VARCHAR(100),
    IN `p_description` VARCHAR(500),
    IN `p_seat_count` INT
)
BEGIN
    UPDATE venue
    SET
        short_code = p_short_code,
        description = p_description,
        seat_count = p_seat_count
    WHERE
        id = p_id;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpsertInstruction`(IN `p_type` VARCHAR(250), IN `p_instruction` TEXT)
BEGIN
    INSERT INTO instruction (type, instruction)
VALUES (p_type, p_instruction)
ON DUPLICATE KEY UPDATE
  instruction = VALUES(instruction);
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpsertPayment`(IN `p_type` VARCHAR(250), IN `p_amount` DECIMAL(18,2))
BEGIN
    INSERT INTO payment (type, amount)
VALUES (p_type, p_amount)
ON DUPLICATE KEY UPDATE
  amount = VALUES(amount);
END ;;
DELIMITER ;


ALTER TABLE `subject` ADD `assignment_min_mark` INT NOT NULL AFTER `level`;