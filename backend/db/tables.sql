SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Table structure for table `admin_log`
--

DROP TABLE IF EXISTS `admin_log`;


CREATE TABLE `admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6133 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `admission`
--

DROP TABLE IF EXISTS `admission`;


CREATE TABLE `admission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `generated_date` varchar(250) NOT NULL,
  `subject_list` varchar(250) NOT NULL,
  `exam_date` varchar(250) NOT NULL,
  `exam_held_date` varchar(250) NOT NULL,
  `description` text NOT NULL,
  `instructions` text NOT NULL,
  `provider` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_admission_batch_id` (`batch_id`),
  CONSTRAINT `fk_admission_batch_id` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;


CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `exam_date` varchar(250) NOT NULL,
  `exam_held_date` varchar(250) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_attendance_batch_id` (`batch_id`),
  CONSTRAINT `fk_attendance_batch_id` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `attendance_subject`
--

DROP TABLE IF EXISTS `attendance_subject`;


CREATE TABLE `attendance_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attendance_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `no_of_groups` int(11) NOT NULL,
  `venues` text NOT NULL,
  `dates` varchar(250) NOT NULL,
  `times` varchar(250) NOT NULL,
  `student_detail` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `batch`
--

DROP TABLE IF EXISTS `batch`;


CREATE TABLE `batch` (
  `batch_id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_code` varchar(100) NOT NULL,
  `deg_id` int(11) NOT NULL,
  `syl_id` int(11) NOT NULL,
  `academic_year` varchar(50) NOT NULL,
  `level` int(11) NOT NULL,
  `sem` int(11) NOT NULL,
  `grp_id` int(11) NOT NULL,
  `application_open` timestamp NOT NULL DEFAULT current_timestamp(),
  `hod_accepted` varchar(50) NOT NULL DEFAULT 'false',
  `dean_accepted` varchar(50) NOT NULL DEFAULT 'false',
  `payment_end` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin_end` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` varchar(500) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`batch_id`),
  KEY `fk_batch_deg_id` (`deg_id`),
  CONSTRAINT `fk_batch_deg_id` FOREIGN KEY (`deg_id`) REFERENCES `degree` (`deg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `batch_subject_lecturer`
--

DROP TABLE IF EXISTS `batch_subject_lecturer`;


CREATE TABLE `batch_subject_lecturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `l_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_batch_curriculum_lecturer_sub_id` (`sub_id`),
  KEY `fk_batch_curriculum_lecturer_batch_id` (`batch_id`),
  KEY `fk_batch_curriculum_lecturer_l_id` (`l_id`) USING BTREE,
  CONSTRAINT `fk_batch_curriculum_lecturer_batch_id` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`),
  CONSTRAINT `fk_batch_curriculum_lecturer_l_id` FOREIGN KEY (`l_id`) REFERENCES `lecturer_detail` (`l_id`),
  CONSTRAINT `fk_batch_curriculum_lecturer_sub_id` FOREIGN KEY (`sub_id`) REFERENCES `subject` (`sub_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2867 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `batch_time_periods`
--

DROP TABLE IF EXISTS `batch_time_periods`;


CREATE TABLE `batch_time_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `user_type` enum('5','4','3','2') NOT NULL,
  `end_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mail_sent` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `batch_id` (`batch_id`,`user_type`),
  CONSTRAINT `fk_batch_time_periods_batch_id` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1645 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `deg_syl`
--

DROP TABLE IF EXISTS `deg_syl`;


CREATE TABLE `deg_syl` (
  `deg_id` int(11) NOT NULL,
  `syl_id` int(11) NOT NULL,
  PRIMARY KEY (`deg_id`,`syl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `degree`
--

DROP TABLE IF EXISTS `degree`;


CREATE TABLE `degree` (
  `deg_id` int(11) NOT NULL AUTO_INCREMENT,
  `deg_name` varchar(500) NOT NULL,
  `short` varchar(50) NOT NULL,
  `levels` varchar(100) NOT NULL,
  `no_of_sem_per_year` varchar(10) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`deg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `dep_sub`
--

DROP TABLE IF EXISTS `dep_sub`;


CREATE TABLE `dep_sub` (
  `d_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  PRIMARY KEY (`d_id`,`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;


CREATE TABLE `department` (
  `d_id` int(11) NOT NULL AUTO_INCREMENT,
  `d_name` varchar(250) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contact_no` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`d_id`),
  KEY `fk_department_user_id` (`user_id`),
  CONSTRAINT `fk_department_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `eligibility_log`
--

DROP TABLE IF EXISTS `eligibility_log`;


CREATE TABLE `eligibility_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `s_id` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `status_from` varchar(50) NOT NULL,
  `status_to` varchar(50) NOT NULL,
  `remark` text NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_eligibility_log_user_id` (`user_id`),
  KEY `fk_eligibility_log_s_id` (`s_id`),
  KEY `fk_eligibility_log_sub_id` (`sub_id`),
  CONSTRAINT `fk_eligibility_log_s_id` FOREIGN KEY (`s_id`) REFERENCES `student_detail` (`s_id`),
  CONSTRAINT `fk_eligibility_log_sub_id` FOREIGN KEY (`sub_id`) REFERENCES `subject` (`sub_id`),
  CONSTRAINT `fk_eligibility_log_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1609 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `entry_summary`
--

DROP TABLE IF EXISTS `entry_summary`;


CREATE TABLE `entry_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `s_id` int(11) NOT NULL,
  `academic_year` varchar(50) NOT NULL,
  `level` int(11) NOT NULL,
  `sem` int(11) NOT NULL,
  `proper_subs` text DEFAULT NULL,
  `medical_subs` text DEFAULT NULL,
  `resit_subs` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_entry_summary_s_id` (`s_id`),
  CONSTRAINT `fk_entry_summary_s_id` FOREIGN KEY (`s_id`) REFERENCES `student_detail` (`s_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1495 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `fac_deg`
--

DROP TABLE IF EXISTS `fac_deg`;


CREATE TABLE `fac_deg` (
  `f_id` int(11) NOT NULL,
  `deg_id` int(11) NOT NULL,
  PRIMARY KEY (`f_id`,`deg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `fac_dep`
--

DROP TABLE IF EXISTS `fac_dep`;


CREATE TABLE `fac_dep` (
  `f_id` int(11) NOT NULL,
  `d_id` int(11) NOT NULL,
  PRIMARY KEY (`f_id`,`d_id`),
  KEY `fk_fac_dep_d_id` (`d_id`),
  CONSTRAINT `fk_fac_dep_d_id` FOREIGN KEY (`d_id`) REFERENCES `department` (`d_id`),
  CONSTRAINT `fk_fac_dep_f_id` FOREIGN KEY (`f_id`) REFERENCES `faculty` (`f_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;


CREATE TABLE `faculty` (
  `f_id` int(11) NOT NULL AUTO_INCREMENT,
  `f_name` varchar(250) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contact_no` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`f_id`),
  KEY `fk_faculty_user_id` (`user_id`),
  CONSTRAINT `fk_faculty_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;


CREATE TABLE `grade` (
  `id` int(11) NOT NULL,
  `grade` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
INSERT INTO `grade` VALUES (0,'N/A'),(1,'F'),(2,'E'),(3,'D'),(4,'D+'),(5,'C-'),(6,'C');
/*!40000 ALTER TABLE `grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grp`
--

DROP TABLE IF EXISTS `grp`;


CREATE TABLE `grp` (
  `grp_id` int(11) NOT NULL AUTO_INCREMENT,
  `grp_code` varchar(250) NOT NULL,
  `custom_suffix` varchar(250) NOT NULL,
  `course_title` varchar(500) NOT NULL,
  `level` int(11) NOT NULL,
  `sem_no` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`grp_id`,`grp_code`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `grp_sub`
--

DROP TABLE IF EXISTS `grp_sub`;


CREATE TABLE `grp_sub` (
  `grp_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  PRIMARY KEY (`grp_id`,`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `instruction`
--

DROP TABLE IF EXISTS `instruction`;


CREATE TABLE `instruction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(250) NOT NULL,
  `instruction` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `lecturer`
--

DROP TABLE IF EXISTS `lecturer`;


CREATE TABLE `lecturer` (
  `l_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`l_id`,`user_id`),
  KEY `fk_lecturer_user_id` (`user_id`),
  CONSTRAINT `fk_lecturer_l_id` FOREIGN KEY (`l_id`) REFERENCES `lecturer_detail` (`l_id`),
  CONSTRAINT `fk_lecturer_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `lecturer_detail`
--

DROP TABLE IF EXISTS `lecturer_detail`;


CREATE TABLE `lecturer_detail` (
  `l_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `contact_no` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`l_id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `medical_request`
--

DROP TABLE IF EXISTS `medical_request`;


CREATE TABLE `medical_request` (
  `medical_id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `s_id` int(11) NOT NULL,
  `subjects_verified` varchar(50) NOT NULL DEFAULT 'false',
  `reference` varchar(500) NOT NULL DEFAULT '',
  `payment_verified` varchar(50) NOT NULL DEFAULT 'false',
  `status` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`medical_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `medical_subject`
--

DROP TABLE IF EXISTS `medical_subject`;


CREATE TABLE `medical_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `medical_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `eligibility` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;


CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(250) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `resit_request`
--

DROP TABLE IF EXISTS `resit_request`;


CREATE TABLE `resit_request` (
  `resit_id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `s_id` int(11) NOT NULL,
  `subjects_verified` varchar(50) NOT NULL DEFAULT 'false',
  `reference` varchar(500) NOT NULL DEFAULT '',
  `payment_verified` varchar(50) NOT NULL DEFAULT 'false',
  `status` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`resit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=512 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `resit_subject`
--

DROP TABLE IF EXISTS `resit_subject`;


CREATE TABLE `resit_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resit_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `attempt_1` varchar(50) NOT NULL,
  `attempt_2` varchar(50) NOT NULL,
  `attempt_3` varchar(50) NOT NULL,
  `eligibility` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1189 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;


CREATE TABLE `roles` (
  `role_id` varchar(50) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('1','admin'),('2','dean'),('3','hod'),('4','lecturer'),('5','student');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;


CREATE TABLE `student` (
  `s_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`s_id`,`user_id`),
  KEY `fk_student_user_id` (`user_id`),
  CONSTRAINT `fk_student_s_id` FOREIGN KEY (`s_id`) REFERENCES `student_detail` (`s_id`),
  CONSTRAINT `fk_student_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `student_detail`
--

DROP TABLE IF EXISTS `student_detail`;


CREATE TABLE `student_detail` (
  `s_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `index_num` varchar(50) NOT NULL,
  `contact_no` varchar(100) NOT NULL,
  `batch_ids` varchar(150) NOT NULL,
  `f_id` int(11) NOT NULL,
  `syl_id` int(11) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`s_id`),
  KEY `fk_student_detail_f_id` (`f_id`),
  CONSTRAINT `fk_student_detail_f_id` FOREIGN KEY (`f_id`) REFERENCES `faculty` (`f_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2162 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `students_log`
--

DROP TABLE IF EXISTS `students_log`;


CREATE TABLE `students_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `description` text NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_student_log_user_id` (`user_id`),
  CONSTRAINT `fk_student_log_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2071 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;


CREATE TABLE `subject` (
  `sub_id` int(11) NOT NULL AUTO_INCREMENT,
  `sub_code` varchar(100) NOT NULL,
  `sub_name` varchar(150) NOT NULL,
  `sem_no` int(2) NOT NULL,
  `level` int(3) NOT NULL,
  `syl_id` int(11) NOT NULL,
  `pass_grade` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`sub_id`),
  UNIQUE KEY `unique_subcode_sylid` (`sub_code`,`syl_id`),
  KEY `fk_syllabus_syl_id` (`syl_id`),
  CONSTRAINT `fk_syllabus_syl_id` FOREIGN KEY (`syl_id`) REFERENCES `syllabus` (`syl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=901 DEFAULT CHARSET=utf8mb4;


ALTER TABLE `subject` ADD `assignment_min_mark` INT NOT NULL AFTER `level`;

--
-- Table structure for table `syl_grp`
--

DROP TABLE IF EXISTS `syl_grp`;


CREATE TABLE `syl_grp` (
  `syl_id` int(11) NOT NULL,
  `grp_id` int(11) NOT NULL,
  PRIMARY KEY (`syl_id`,`grp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `syllabus`
--

DROP TABLE IF EXISTS `syllabus`;


CREATE TABLE `syllabus` (
  `syl_id` int(11) NOT NULL AUTO_INCREMENT,
  `commenced_year` year(4) NOT NULL,
  `expired_year` year(4) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`syl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;


ALTER TABLE `syllabus` CHANGE `expired_year` `expired_year` YEAR(4) NULL DEFAULT NULL;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;


CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(250) NOT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(250) NOT NULL,
  `role_id` varchar(50) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `token_expiration` timestamp NOT NULL DEFAULT current_timestamp(),
  `failed_attempts` int(11) DEFAULT 0,
  `lockout_until` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  KEY `fk_user_role_id` (`role_id`),
  CONSTRAINT `fk_user_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2362 DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;


CREATE TABLE `venue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `short_code` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `seat_count` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 1;