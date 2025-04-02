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