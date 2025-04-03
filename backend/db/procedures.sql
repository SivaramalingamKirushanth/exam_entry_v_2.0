GRANT EXECUTE ON exam_entry.* TO 'student'@'%';
GRANT EXECUTE ON exam_entry.* TO 'manager'@'%';
GRANT EXECUTE ON exam_entry.* TO 'hod'@'%';
GRANT EXECUTE ON exam_entry.* TO 'dean'@'%';
GRANT EXECUTE ON exam_entry.* TO 'guest'@'%';
GRANT EXECUTE ON exam_entry.* TO 'admin'@'%';

DELIMITER $$
CREATE DEFINER=CURRENT_USER@`%` PROCEDURE `AddMedicalResitStudents`(
    IN `p_batch_id` INT, 
    IN `p_sub_id` INT, 
    IN `p_s_id` INT, 
    IN `p_exam_type` VARCHAR(50)
)
BEGIN
    DECLARE table_name VARCHAR(255);
    DECLARE record_count INT;
    DECLARE v_academic_year VARCHAR(50);
    DECLARE v_level INT;
    DECLARE v_sem INT;
    DECLARE existing_entry_count INT;
    DECLARE existing_subs TEXT;
    DECLARE new_subs TEXT;

    -- Get batch information
    SELECT academic_year, level, sem 
    INTO v_academic_year, v_level, v_sem
    FROM batch 
    WHERE batch_id = p_batch_id;

    -- Construct the dynamic table name
    SET table_name = CONCAT('batch_', p_batch_id, '_sub_', p_sub_id);

    -- Check if the table exists
    SET @check_table_query = CONCAT('SHOW TABLES LIKE "', table_name, '"');
    PREPARE stmt FROM @check_table_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- If table doesn't exist, raise an error
    IF FOUND_ROWS() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The specified table does not exist.';
    END IF;

    -- Check if the student record already exists
    SET @check_record_query = CONCAT(
        'SELECT COUNT(*) INTO @record_count 
         FROM ', table_name, ' 
         WHERE s_id = ', p_s_id
    );
    PREPARE stmt FROM @check_record_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- If the record does not exist, insert the student
    IF @record_count = 0 THEN
        SET @insert_query = CONCAT(
            'INSERT INTO ', table_name, ' (s_id, eligibility, exam_type) 
             VALUES (', p_s_id, ', "true", "', p_exam_type, '")'
        );
        PREPARE stmt FROM @insert_query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    -- Check if an entry already exists in entry_summary for this student and academic year
    SELECT COUNT(*) INTO existing_entry_count
    FROM entry_summary
    WHERE s_id = p_s_id 
      AND academic_year = v_academic_year 
      AND level = v_level 
      AND sem = v_sem;

    -- If entry exists, update the appropriate column
    IF existing_entry_count > 0 THEN
        IF p_exam_type = 'R' THEN
            -- For resit students
            SELECT COALESCE(resit_subs, '') INTO existing_subs
            FROM entry_summary
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;

            -- Prepare new subjects list
            IF existing_subs = '' THEN
                SET new_subs = CAST(p_sub_id AS CHAR);
            ELSE
                SET new_subs = CONCAT(existing_subs, ',', CAST(p_sub_id AS CHAR));
            END IF;

            -- Update resit_subs
            UPDATE entry_summary 
            SET resit_subs = new_subs
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;

        ELSEIF p_exam_type = 'M' THEN
            -- For medical students
            SELECT COALESCE(medical_subs, '') INTO existing_subs
            FROM entry_summary
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;

            -- Prepare new subjects list
            IF existing_subs = '' THEN
                SET new_subs = CAST(p_sub_id AS CHAR);
            ELSE
                SET new_subs = CONCAT(existing_subs, ',', CAST(p_sub_id AS CHAR));
            END IF;

            -- Update medical_subs
            UPDATE entry_summary 
            SET medical_subs = new_subs
            WHERE s_id = p_s_id 
              AND academic_year = v_academic_year 
              AND level = v_level 
              AND sem = v_sem;
        END IF;
    ELSE
        -- If no entry exists, insert a new record
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
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddNewBatchStudentColumns`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE add_column_sql TEXT;

    SET add_column_sql = CONCAT('ALTER TABLE batch_', p_batch_id, '_students ');

    WHILE i < JSON_LENGTH(p_subjects) DO
        SET sub_id = JSON_VALUE(p_subjects, CONCAT('$[', i, '].sub_id'));

        IF i > 0 THEN
            SET add_column_sql = CONCAT(add_column_sql, ',');
        END IF;
        SET add_column_sql = CONCAT(add_column_sql, ' ADD COLUMN sub_', sub_id, ' VARCHAR(50) NOT NULL');
        
        SET i = i + 1;
    END WHILE;

    -- Execute add column SQL
    PREPARE stmt FROM add_column_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddStudentsToBatch`(IN `p_batch_id` INT, IN `p_new_students` TEXT)
BEGIN
    DECLARE student_id VARCHAR(255);
    DECLARE temp_students TEXT;
    DECLARE insert_query TEXT;

    -- Initialize the temporary students string
    SET temp_students = p_new_students;

    -- Update student_detail to add batch_id
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

    -- Handle the last student ID in the list
    SET student_id = temp_students;
    UPDATE student_detail
    SET batch_ids = 
        CASE
            WHEN batch_ids IS NULL OR batch_ids = '' THEN p_batch_id
            ELSE CONCAT(batch_ids, ',', p_batch_id)
        END
    WHERE s_id = student_id;

    -- Generate dynamic INSERT query for batch_{batch_id}_students
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

    -- Handle the last student ID in the list for the INSERT query
    SET student_id = temp_students;
    SET insert_query = CONCAT(insert_query, '(', student_id, ', "false")');

    -- Execute the INSERT query
    PREPARE stmt FROM insert_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ApplyExam`(
    IN `p_user_id` INT, 
    IN `p_removed_subjects` VARCHAR(255), -- Comma-separated subject IDs to skip
    OUT `out_batch_id` INT
)
ae:BEGIN
    DECLARE p_s_id INT;
    DECLARE p_batch_id INT;
    DECLARE p_applied_to_exam VARCHAR(50);
    DECLARE done INT DEFAULT FALSE;
    DECLARE sub_col_name VARCHAR(255);
    DECLARE current_sub_id VARCHAR(10);
    DECLARE attendance_value INT;
    DECLARE eligibility_value VARCHAR(50);
    DECLARE student_deadline DATETIME;
    DECLARE open_date DATETIME;
    
    -- New variables for entry_summary
    DECLARE v_batch_code VARCHAR(100);
    DECLARE v_academic_year VARCHAR(50);
    DECLARE v_level INT;
    DECLARE v_sem INT;
    DECLARE v_proper_subs TEXT DEFAULT '';
    DECLARE existing_entry_count INT;

    -- Cursor for getting all subject columns (sub_* columns)
    DECLARE sub_cursor CURSOR FOR 
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = CONCAT('batch_', p_batch_id, '_students') 
          AND COLUMN_NAME LIKE 'sub_%';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Step 1: Get s_id from student table using user_id
    SELECT s_id INTO p_s_id
    FROM student
    WHERE user_id = p_user_id;

    IF p_s_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student ID not found for the given user_id.';
    END IF;

    -- Step 2: Get batch_ids from student_detail and extract the last batch_id
    SELECT CAST(SUBSTRING_INDEX(batch_ids, ',', -1) AS UNSIGNED) INTO p_batch_id
    FROM student_detail
    WHERE s_id = p_s_id;

    IF p_batch_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch ID not found for the student.';
    END IF;

    -- Set the OUT parameter with the batch_id
    SET out_batch_id = p_batch_id;

    -- Get batch information
    SELECT batch_code, level, sem, academic_year 
    INTO v_batch_code, v_level, v_sem, v_academic_year
    FROM batch 
    WHERE batch_id = p_batch_id;

    -- Step 3: Check student deadline
    SELECT end_date INTO student_deadline
    FROM batch_time_periods
    WHERE batch_id = p_batch_id AND user_type = '5'; -- User type '5' is for students

    IF NOW() > student_deadline THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The application deadline for this batch has passed.';
    END IF;
    
    -- Step 4: Check application open date
    SELECT application_open INTO open_date
    FROM batch
    WHERE batch_id = p_batch_id; 

    IF NOW() < open_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The application not opened yet.';
    END IF;

    -- Step 5: Check if student already applied to exam
    SET @table_name = CONCAT('batch_', p_batch_id, '_students');
    
    -- Check if the dynamic table exists
    SET @check_table_query = CONCAT('SHOW TABLES LIKE "', @table_name, '"');
    PREPARE stmt FROM @check_table_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- If table doesn't exist, raise an error
    IF FOUND_ROWS() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The batch table does not exist.';
    END IF;

    -- Check if the student has already applied to the exam
    SET @check_applied_query = CONCAT(
        'SELECT applied_to_exam INTO @p_applied_to_exam FROM ', @table_name, ' WHERE s_id = ', p_s_id
    );
    PREPARE stmt FROM @check_applied_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- If already applied, exit the procedure
    IF @p_applied_to_exam = 'true' THEN
        LEAVE ae;
    END IF;

    -- Step 6: Iterate over all subject columns for the batch
    OPEN sub_cursor;

    subject_loop: LOOP
        FETCH sub_cursor INTO sub_col_name;

        IF done THEN
            LEAVE subject_loop;
        END IF;

        -- Extract the subject ID from the column name (e.g., 'sub_5' -> '5')
        SET current_sub_id = SUBSTRING(sub_col_name, 5);
        
        -- Check if this subject should be skipped
        IF p_removed_subjects IS NOT NULL AND FIND_IN_SET(current_sub_id, p_removed_subjects) > 0 THEN
            -- Skip this subject
            ITERATE subject_loop;
        END IF;

        -- Get the attendance value for the subject
        SET @attendance_query = CONCAT(
            'SELECT ', sub_col_name, ' INTO @attendance_value 
            FROM ', @table_name, ' 
            WHERE s_id = ', p_s_id
        );
        PREPARE stmt FROM @attendance_query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

        -- Determine eligibility based on attendance
        IF @attendance_value >= 80 THEN
            SET eligibility_value = 'true';
        ELSE
            SET eligibility_value = 'false';
        END IF;

        -- Insert eligibility value into respective subject table (if not exists)
        SET @insert_query = CONCAT(
            'INSERT IGNORE INTO batch_', p_batch_id, '_sub_', current_sub_id, 
            ' (s_id, eligibility, exam_type) VALUES (', p_s_id, ', "', eligibility_value, '", "P")'
        );
        PREPARE stmt FROM @insert_query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

        -- Collect proper subjects (not skipped)
        IF v_proper_subs = '' THEN
            SET v_proper_subs = current_sub_id;
        ELSE
            SET v_proper_subs = CONCAT(v_proper_subs, ',', current_sub_id);
        END IF;
    END LOOP;

    CLOSE sub_cursor;

    -- Step 7: Update applied_to_exam to 'true' for the student
    SET @update_query = CONCAT(
        'UPDATE ', @table_name, ' 
         SET applied_to_exam = "true" 
         WHERE s_id = ', p_s_id
    );
    PREPARE stmt FROM @update_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Step 8: Handle entry_summary
    -- Check if an entry already exists
    SELECT COUNT(*) INTO existing_entry_count
    FROM entry_summary
    WHERE s_id = p_s_id 
      AND academic_year = v_academic_year 
      AND level = v_level 
      AND sem = v_sem;

    -- If entry exists, update proper_subs
    IF existing_entry_count > 0 THEN
        UPDATE entry_summary 
        SET proper_subs = v_proper_subs
        WHERE s_id = p_s_id 
          AND academic_year = v_academic_year 
          AND level = v_level 
          AND sem = v_sem;
    ELSE
        -- If no entry exists, insert a new record
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

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckForDuplicateDegree`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_deg_id` INT, OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM degree
    WHERE (deg_name = p_deg_name OR short = p_short) AND deg_id != p_deg_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIfDegreeExists`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM degree
    WHERE deg_name = p_deg_name OR short = p_short;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIfDepartmentExists`(IN `p_d_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM department d
    LEFT JOIN user u ON d.user_id = u.user_id
    WHERE d.d_name = p_d_name OR u.user_name = p_email OR u.email = p_email;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIfFacultyExists`(IN `p_f_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` INT)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM faculty f
    LEFT JOIN user u ON f.user_id = u.user_id
    WHERE f.f_name = p_f_name OR u.user_name = p_email;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckIndexNoExists`(IN `p_index_no` VARCHAR(255), OUT `p_exists` BOOLEAN)
BEGIN
    IF p_index_no = '' THEN
        SELECT FALSE INTO p_exists; 
    ELSE
        SELECT EXISTS (SELECT 1 FROM student_detail WHERE index_num = p_index_no) INTO p_exists;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckSubjectExist`(IN `p_batch_id` INT(11), IN `p_sub_id` INT(11), IN `p_user_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM batch_curriculum_lecturer bcl 
    JOIN manager m
    ON bcl.m_id=m.m_id
    WHERE bcl.batch_id = p_batch_id AND bcl.sub_id = p_sub_id AND m.user_id=p_user_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckUserExists`(IN `p_user_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO p_exists 
    FROM user 
    WHERE user_name = p_user_name OR email = p_email;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateBatchStudentsTable`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE columns_sql TEXT;

    SET columns_sql = 'id INT AUTO_INCREMENT PRIMARY KEY, s_id INT(11) NOT NULL, applied_to_exam VARCHAR(50) DEFAULT "false"';

    WHILE i < JSON_LENGTH(p_subjects) DO
        SET sub_id = JSON_VALUE(p_subjects, CONCAT('$[', i, '].sub_id'));
        SET columns_sql = CONCAT(columns_sql, ', sub_', sub_id, ' VARCHAR(50) NOT NULL');
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
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateBatchSubjectTables`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE sub_id INT;
    DECLARE create_table_sql TEXT;

    WHILE i < JSON_LENGTH(p_subjects) DO
        SET sub_id = JSON_VALUE(p_subjects, CONCAT('$[', i, '].sub_id'));
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
        PREPARE stmt FROM create_table_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateCurriculum`(IN `p_sub_code` VARCHAR(100), IN `p_sub_name` VARCHAR(150), IN `p_sem_no` INT, IN `p_deg_id` INT, IN `p_level` INT, IN `p_status` VARCHAR(50))
BEGIN
    INSERT INTO curriculum (sub_code, sub_name, sem_no, deg_id, level, status)
    VALUES (p_sub_code, p_sub_name, p_sem_no, p_deg_id, p_level, p_status);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateDegree`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_levels` VARCHAR(255), IN `p_no_of_sem_per_year` VARCHAR(10), IN `p_status` VARCHAR(50), OUT `p_deg_id` INT)
BEGIN
    INSERT INTO degree(deg_name, short, levels, no_of_sem_per_year, status)
    VALUES (p_deg_name, p_short, p_levels, p_no_of_sem_per_year, p_status);
    SET p_deg_id = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateDepartment`(IN `p_d_name` VARCHAR(255), IN `p_user_id` INT, IN `p_contact_no` VARCHAR(50), IN `p_status` VARCHAR(50), OUT `p_d_id` INT)
BEGIN
    INSERT INTO department(d_name, user_id, contact_no, status)
    VALUES (p_d_name, p_user_id, p_contact_no, p_status);
    SET p_d_id = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateDepartmentUser`(IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), OUT `p_user_id` INT)
BEGIN
    INSERT INTO user(user_name, email, password, role_id)
    VALUES (p_email, p_email, p_password, '3');
    SET p_user_id = LAST_INSERT_ID();
END$$
DELIMITER ;