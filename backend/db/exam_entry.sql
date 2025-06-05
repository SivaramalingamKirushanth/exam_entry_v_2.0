-- MySQL dump 10.13  Distrib 8.4.4, for Win64 (x86_64)
--
-- Host: localhost    Database: exam_entry
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `exam_entry`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `exam_entry` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `exam_entry`;

--
-- Table structure for table `admin_log`
--

DROP TABLE IF EXISTS `admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_log`
--

LOCK TABLES `admin_log` WRITE;
/*!40000 ALTER TABLE `admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission`
--

DROP TABLE IF EXISTS `admission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission`
--

LOCK TABLES `admission` WRITE;
/*!40000 ALTER TABLE `admission` DISABLE KEYS */;
/*!40000 ALTER TABLE `admission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `exam_date` varchar(250) NOT NULL,
  `exam_held_date` varchar(250) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_attendance_batch_id` (`batch_id`),
  CONSTRAINT `fk_attendance_batch_id` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_subject`
--

DROP TABLE IF EXISTS `attendance_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_subject`
--

LOCK TABLES `attendance_subject` WRITE;
/*!40000 ALTER TABLE `attendance_subject` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch`
--

DROP TABLE IF EXISTS `batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch`
--

LOCK TABLES `batch` WRITE;
/*!40000 ALTER TABLE `batch` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_subject_lecturer`
--

DROP TABLE IF EXISTS `batch_subject_lecturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_subject_lecturer`
--

LOCK TABLES `batch_subject_lecturer` WRITE;
/*!40000 ALTER TABLE `batch_subject_lecturer` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_subject_lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_time_periods`
--

DROP TABLE IF EXISTS `batch_time_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_time_periods`
--

LOCK TABLES `batch_time_periods` WRITE;
/*!40000 ALTER TABLE `batch_time_periods` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_time_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deg_syl`
--

DROP TABLE IF EXISTS `deg_syl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deg_syl` (
  `deg_id` int(11) NOT NULL,
  `syl_id` int(11) NOT NULL,
  PRIMARY KEY (`deg_id`,`syl_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deg_syl`
--

LOCK TABLES `deg_syl` WRITE;
/*!40000 ALTER TABLE `deg_syl` DISABLE KEYS */;
/*!40000 ALTER TABLE `deg_syl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `degree`
--

DROP TABLE IF EXISTS `degree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `degree` (
  `deg_id` int(11) NOT NULL AUTO_INCREMENT,
  `deg_name` varchar(500) NOT NULL,
  `short` varchar(50) NOT NULL,
  `levels` varchar(100) NOT NULL,
  `no_of_sem_per_year` varchar(10) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`deg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `degree`
--

LOCK TABLES `degree` WRITE;
/*!40000 ALTER TABLE `degree` DISABLE KEYS */;
/*!40000 ALTER TABLE `degree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dep_sub`
--

DROP TABLE IF EXISTS `dep_sub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dep_sub` (
  `d_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  PRIMARY KEY (`d_id`,`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dep_sub`
--

LOCK TABLES `dep_sub` WRITE;
/*!40000 ALTER TABLE `dep_sub` DISABLE KEYS */;
/*!40000 ALTER TABLE `dep_sub` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `d_id` int(11) NOT NULL AUTO_INCREMENT,
  `d_name` varchar(250) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contact_no` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`d_id`),
  KEY `fk_department_user_id` (`user_id`),
  CONSTRAINT `fk_department_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eligibility_log`
--

DROP TABLE IF EXISTS `eligibility_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eligibility_log`
--

LOCK TABLES `eligibility_log` WRITE;
/*!40000 ALTER TABLE `eligibility_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `eligibility_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entry_summary`
--

DROP TABLE IF EXISTS `entry_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entry_summary`
--

LOCK TABLES `entry_summary` WRITE;
/*!40000 ALTER TABLE `entry_summary` DISABLE KEYS */;
/*!40000 ALTER TABLE `entry_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fac_deg`
--

DROP TABLE IF EXISTS `fac_deg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fac_deg` (
  `f_id` int(11) NOT NULL,
  `deg_id` int(11) NOT NULL,
  PRIMARY KEY (`f_id`,`deg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fac_deg`
--

LOCK TABLES `fac_deg` WRITE;
/*!40000 ALTER TABLE `fac_deg` DISABLE KEYS */;
/*!40000 ALTER TABLE `fac_deg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fac_dep`
--

DROP TABLE IF EXISTS `fac_dep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fac_dep` (
  `f_id` int(11) NOT NULL,
  `d_id` int(11) NOT NULL,
  PRIMARY KEY (`f_id`,`d_id`),
  KEY `fk_fac_dep_d_id` (`d_id`),
  CONSTRAINT `fk_fac_dep_d_id` FOREIGN KEY (`d_id`) REFERENCES `department` (`d_id`),
  CONSTRAINT `fk_fac_dep_f_id` FOREIGN KEY (`f_id`) REFERENCES `faculty` (`f_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fac_dep`
--

LOCK TABLES `fac_dep` WRITE;
/*!40000 ALTER TABLE `fac_dep` DISABLE KEYS */;
/*!40000 ALTER TABLE `fac_dep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `f_id` int(11) NOT NULL AUTO_INCREMENT,
  `f_name` varchar(250) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contact_no` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`f_id`),
  KEY `fk_faculty_user_id` (`user_id`),
  CONSTRAINT `fk_faculty_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade` (
  `id` int(11) NOT NULL,
  `grade` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grp` (
  `grp_id` int(11) NOT NULL AUTO_INCREMENT,
  `grp_code` varchar(250) NOT NULL,
  `custom_suffix` varchar(250) NOT NULL,
  `course_title` varchar(500) NOT NULL,
  `level` int(11) NOT NULL,
  `sem_no` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`grp_id`,`grp_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grp`
--

LOCK TABLES `grp` WRITE;
/*!40000 ALTER TABLE `grp` DISABLE KEYS */;
/*!40000 ALTER TABLE `grp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grp_sub`
--

DROP TABLE IF EXISTS `grp_sub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grp_sub` (
  `grp_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  PRIMARY KEY (`grp_id`,`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grp_sub`
--

LOCK TABLES `grp_sub` WRITE;
/*!40000 ALTER TABLE `grp_sub` DISABLE KEYS */;
/*!40000 ALTER TABLE `grp_sub` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturer`
--

DROP TABLE IF EXISTS `lecturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturer` (
  `l_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`l_id`,`user_id`),
  KEY `fk_lecturer_user_id` (`user_id`),
  CONSTRAINT `fk_lecturer_l_id` FOREIGN KEY (`l_id`) REFERENCES `lecturer_detail` (`l_id`),
  CONSTRAINT `fk_lecturer_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturer`
--

LOCK TABLES `lecturer` WRITE;
/*!40000 ALTER TABLE `lecturer` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturer_detail`
--

DROP TABLE IF EXISTS `lecturer_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturer_detail` (
  `l_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `contact_no` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'true',
  PRIMARY KEY (`l_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturer_detail`
--

LOCK TABLES `lecturer_detail` WRITE;
/*!40000 ALTER TABLE `lecturer_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturer_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_request`
--

DROP TABLE IF EXISTS `medical_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_request` (
  `medical_id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `s_id` int(11) NOT NULL,
  `subjects_verified` varchar(50) NOT NULL DEFAULT 'false',
  `reference` varchar(500) NOT NULL DEFAULT '',
  `payment_verified` varchar(50) NOT NULL DEFAULT 'false',
  `status` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`medical_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_request`
--

LOCK TABLES `medical_request` WRITE;
/*!40000 ALTER TABLE `medical_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_subject`
--

DROP TABLE IF EXISTS `medical_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `medical_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `eligibility` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_subject`
--

LOCK TABLES `medical_subject` WRITE;
/*!40000 ALTER TABLE `medical_subject` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(250) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (4,'medical',250.00),(5,'resit',250.00),(6,'upgrade',500.00);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resit_request`
--

DROP TABLE IF EXISTS `resit_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resit_request` (
  `resit_id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `s_id` int(11) NOT NULL,
  `subjects_verified` varchar(50) NOT NULL DEFAULT 'false',
  `reference` varchar(500) NOT NULL DEFAULT '',
  `payment_verified` varchar(50) NOT NULL DEFAULT 'false',
  `status` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`resit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resit_request`
--

LOCK TABLES `resit_request` WRITE;
/*!40000 ALTER TABLE `resit_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `resit_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resit_subject`
--

DROP TABLE IF EXISTS `resit_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resit_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resit_id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL,
  `attempt_1` varchar(50) NOT NULL,
  `attempt_2` varchar(50) NOT NULL,
  `attempt_3` varchar(50) NOT NULL,
  `eligibility` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resit_subject`
--

LOCK TABLES `resit_subject` WRITE;
/*!40000 ALTER TABLE `resit_subject` DISABLE KEYS */;
/*!40000 ALTER TABLE `resit_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` varchar(50) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `s_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`s_id`,`user_id`),
  KEY `fk_student_user_id` (`user_id`),
  CONSTRAINT `fk_student_s_id` FOREIGN KEY (`s_id`) REFERENCES `student_detail` (`s_id`),
  CONSTRAINT `fk_student_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_detail`
--

DROP TABLE IF EXISTS `student_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `fk_student_detail_f_id` FOREIGN KEY (`f_id`) REFERENCES `faculty` (`f_id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_detail`
--

LOCK TABLES `student_detail` WRITE;
/*!40000 ALTER TABLE `student_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students_log`
--

DROP TABLE IF EXISTS `students_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `description` text NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_student_log_user_id` (`user_id`),
  CONSTRAINT `fk_student_log_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students_log`
--

LOCK TABLES `students_log` WRITE;
/*!40000 ALTER TABLE `students_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `students_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `syl_grp`
--

DROP TABLE IF EXISTS `syl_grp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `syl_grp` (
  `syl_id` int(11) NOT NULL,
  `grp_id` int(11) NOT NULL,
  PRIMARY KEY (`syl_id`,`grp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `syl_grp`
--

LOCK TABLES `syl_grp` WRITE;
/*!40000 ALTER TABLE `syl_grp` DISABLE KEYS */;
/*!40000 ALTER TABLE `syl_grp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `syllabus`
--

DROP TABLE IF EXISTS `syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `syllabus` (
  `syl_id` int(11) NOT NULL AUTO_INCREMENT,
  `commenced_year` year(4) NOT NULL,
  `expired_year` year(4) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`syl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `syllabus`
--

LOCK TABLES `syllabus` WRITE;
/*!40000 ALTER TABLE `syllabus` DISABLE KEYS */;
/*!40000 ALTER TABLE `syllabus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `short_code` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `seat_count` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue`
--

LOCK TABLES `venue` WRITE;
/*!40000 ALTER TABLE `venue` DISABLE KEYS */;
/*!40000 ALTER TABLE `venue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instruction`
--

DROP TABLE IF EXISTS `instruction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instruction` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(250) NOT NULL,
  `instruction` TEXT NOT NULL,
  PRIMARY KEY (`id`),
UNIQUE KEY `type` (`type`)

) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instruction`
--

LOCK TABLES `instruction` WRITE;
/*!40000 ALTER TABLE `instruction` DISABLE KEYS */;
INSERT INTO `instruction` VALUES (1,'payment','Please pay the above amount to the university account via the official payment portal before the deadline. Retain a copy of the receipt for future reference.');
/*!40000 ALTER TABLE `instruction` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping events for database 'exam_entry'
--

--
-- Dumping routines for database 'exam_entry'
--
/*!50003 DROP PROCEDURE IF EXISTS `AcceptMedicalResitStudents` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `AcceptMedicalResitStudents`(IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_s_id` INT, IN `p_exam_type` VARCHAR(50))
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



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddNewBatchStudentColumns` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `AddNewBatchStudentColumns`(IN `p_batch_id` INT, IN `p_subjects` JSON)
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







    -- Execute add column SQL

    SET @stmt = add_column_sql;



    PREPARE stmt FROM @stmt;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddStudentsToBatch` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `AddStudentsToBatch`(IN `p_batch_id` INT, IN `p_new_students` TEXT)
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

SET @stmt = insert_query;



    PREPARE stmt FROM @stmt;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ApplyExam` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `ApplyExam`(IN `p_user_id` INT, IN `p_removed_subjects` VARCHAR(255), OUT `out_batch_id` INT)
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



 -- FIXED: Check if student exists and get applied_to_exam status

 SET @p_applied_to_exam = NULL;

 SET @student_count = 0;

 

 SET @check_student_query = CONCAT(

 'SELECT COUNT(*) INTO @student_count FROM ', @table_name, ' WHERE s_id = ', p_s_id

 );

 PREPARE stmt FROM @check_student_query;

 EXECUTE stmt;

 DEALLOCATE PREPARE stmt;

 

 -- If student exists in batch table, check applied_to_exam status

 IF @student_count > 0 THEN

     SET @check_applied_query = CONCAT(

     'SELECT COALESCE(applied_to_exam, "false") INTO @p_applied_to_exam FROM ', @table_name, ' WHERE s_id = ', p_s_id

     );

     PREPARE stmt FROM @check_applied_query;

     EXECUTE stmt;

     DEALLOCATE PREPARE stmt;

     

     -- FIXED: Proper comparison and exit

     IF @p_applied_to_exam = 'true' THEN

         -- Student already applied, exit procedure

          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student already applied.';



         LEAVE ae;

     END IF;

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

 'SELECT COALESCE(', sub_col_name, ', 0) INTO @attendance_value 

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



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckForDuplicateDegree` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckForDuplicateDegree`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_deg_id` INT, OUT `p_exists` INT)
BEGIN



    SELECT COUNT(*) INTO p_exists



    FROM degree



    WHERE (deg_name = p_deg_name OR short = p_short) AND deg_id != p_deg_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckForDuplicateGroup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckForDuplicateGroup`(IN `p_grp_code` VARCHAR(255), IN `p_grp_id` INT, OUT `p_exists` INT)
BEGIN



    SELECT COUNT(*) INTO p_exists



    FROM grp



    WHERE grp_code = p_grp_code AND grp_id != p_grp_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckGroupExist` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckGroupExist`(IN `p_grp_id` VARCHAR(100), OUT `p_exists` BOOLEAN)
BEGIN



    SELECT COUNT(*) > 0 INTO p_exists 



    FROM grp g 



    WHERE g.grp_id = p_grp_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckIfDegreeExists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckIfDegreeExists`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), OUT `p_exists` INT)
BEGIN



    SELECT COUNT(*) INTO p_exists



    FROM degree



    WHERE deg_name = p_deg_name OR short = p_short;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckIfDepartmentExists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckIfDepartmentExists`(IN `p_d_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` INT)
BEGIN



    SELECT COUNT(*) INTO p_exists



    FROM department d



    LEFT JOIN user u ON d.user_id = u.user_id



    WHERE d.d_name = p_d_name OR u.user_name = p_email OR u.email = p_email;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckIfFacultyExists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckIfFacultyExists`(IN `p_f_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` INT)
BEGIN



    SELECT COUNT(*) INTO p_exists



    FROM faculty f



    LEFT JOIN user u ON f.user_id = u.user_id



    WHERE f.f_name = p_f_name OR u.user_name = p_email;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckIndexNoExists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckIndexNoExists`(IN `p_index_no` VARCHAR(255), OUT `p_exists` BOOLEAN)
BEGIN



    IF p_index_no = '' THEN



        SELECT FALSE INTO p_exists; 



    ELSE



        SELECT EXISTS (SELECT 1 FROM student_detail WHERE index_num = p_index_no) INTO p_exists;



    END IF;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckPendingMedicalResitRequests` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckPendingMedicalResitRequests`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckSubjectExist` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckSubjectExist`(IN `p_sub_code` VARCHAR(100), IN `p_syl_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN



    SELECT COUNT(*) > 0 INTO p_exists 



    FROM subject s 



    WHERE s.sub_code = p_sub_code AND s.syl_id = p_syl_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckSubjectExistOnBSL` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckSubjectExistOnBSL`(IN `p_batch_id` INT(11), IN `p_sub_id` INT(11), IN `p_user_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN



    SELECT COUNT(*) > 0 INTO p_exists 



    FROM batch_subject_lecturer bsl 



    JOIN lecturer l



    ON bsl.l_id=l.l_id



    WHERE bsl.batch_id = p_batch_id AND bsl.sub_id = p_sub_id AND l.user_id=p_user_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckSubjectExistOnDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckSubjectExistOnDepartment`(IN `p_sub_id` INT(11), IN `p_d_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN



    SELECT COUNT(*) > 0 INTO p_exists 



    FROM dep_sub 



    WHERE sub_id = p_sub_id AND d_id=p_d_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckSubjectExistOnFaculty` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckSubjectExistOnFaculty`( IN `p_sub_id` INT(11), IN `p_f_id` INT(11), OUT `p_exists` BOOLEAN)
BEGIN



    SELECT COUNT(*) > 0 INTO p_exists 



    FROM grp_sub gs 

    JOIN syl_grp sg ON gs.grp_id = sg.grp_id

    JOIN deg_syl ds ON sg.syl_id = ds.syl_id

    JOIN fac_deg fd ON ds.deg_id = fd.deg_id

    

    WHERE gs.sub_id = p_sub_id AND fd.f_id=p_f_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckSyllabusExist` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckSyllabusExist`(IN `p_deg_id` INT(11), IN `p_commenced_year` YEAR, OUT `p_exists` INT)
BEGIN



    SELECT COUNT(*) INTO p_exists



    FROM syllabus s



    JOIN deg_syl ds ON s.syl_id = ds.syl_id



    WHERE s.commenced_year = p_commenced_year AND ds.deg_id = p_deg_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckUserExists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CheckUserExists`(IN `p_user_name` VARCHAR(255), IN `p_email` VARCHAR(255), OUT `p_exists` BOOLEAN)
BEGIN



    SELECT COUNT(*) > 0 INTO p_exists 



    FROM user 



    WHERE user_name = p_user_name OR email = p_email;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateBatchStudentsTable` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateBatchStudentsTable`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN



    DECLARE i INT DEFAULT 0;



    DECLARE sub_id INT;



    DECLARE columns_sql TEXT;







    SET columns_sql = 'id INT AUTO_INCREMENT PRIMARY KEY, s_id INT(11) NOT NULL UNIQUE, applied_to_exam VARCHAR(50) DEFAULT "false"';







    WHILE i < JSON_LENGTH(p_subjects) DO



        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', i, '].sub_id')));



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



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateBatchSubjectTables` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateBatchSubjectTables`(IN `p_batch_id` INT, IN `p_subjects` JSON)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateDegree` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateDegree`(IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_levels` VARCHAR(255), IN `p_no_of_sem_per_year` VARCHAR(10), IN `p_status` VARCHAR(50), OUT `p_deg_id` INT)
BEGIN



    INSERT INTO degree(deg_name, short, levels, no_of_sem_per_year, status)



    VALUES (p_deg_name, p_short, p_levels, p_no_of_sem_per_year, p_status);



    SET p_deg_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateDepartment`(IN `p_d_name` VARCHAR(255), IN `p_user_id` INT, IN `p_contact_no` VARCHAR(50), IN `p_status` VARCHAR(50), OUT `p_d_id` INT)
BEGIN



    INSERT INTO department(d_name, user_id, contact_no, status)



    VALUES (p_d_name, p_user_id, p_contact_no, p_status);



    SET p_d_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateDepartmentUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateDepartmentUser`(IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), OUT `p_user_id` INT)
BEGIN



    INSERT INTO user(user_name, email, password, role_id)



    VALUES (p_email, p_email, p_password, '3');



    SET p_user_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateFaculty` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateFaculty`(IN `p_f_name` VARCHAR(255), IN `p_user_id` INT, IN `p_contact_no` VARCHAR(50), IN `p_status` VARCHAR(50))
BEGIN



    INSERT INTO faculty (f_name, user_id, contact_no, status)



    VALUES (p_f_name, p_user_id, p_contact_no, p_status);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateFacultyUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateFacultyUser`(IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), OUT `p_user_id` INT)
BEGIN



    INSERT INTO user(user_name, email, password, role_id)



    VALUES (p_email, p_email, p_password, '2');



    



    SET p_user_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateGroup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateGroup`(IN `p_grp_code` VARCHAR(255), IN `p_level` INT(11), IN `p_sem_no` INT(11), IN `p_status` VARCHAR(50), IN `p_custom_suffix` VARCHAR(250), IN `p_course_title` VARCHAR(500), OUT `p_grp_id` INT)
BEGIN



    INSERT INTO grp(grp_code, level, sem_no, status, custom_suffix, course_title)



    VALUES (p_grp_code, p_level, p_sem_no, p_status, p_custom_suffix, p_course_title);



    SET p_grp_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateNewBatchSubjectTables` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateNewBatchSubjectTables`(IN `p_batch_id` INT, IN `p_subjects` JSON)
BEGIN



    DECLARE i INT DEFAULT 0;



    DECLARE sub_id INT;



    DECLARE create_table_sql TEXT;







    WHILE i < JSON_LENGTH(p_subjects) DO



        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', i, '].sub_id')));



        



        SET create_table_sql = CONCAT(



            'CREATE TABLE batch_', 



            p_batch_id, 



            '_sub_', 



            sub_id, 



            ' (



                s_id INT(11) NOT NULL,



                eligibility VARCHAR(50) NOT NULL



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateSubject` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateSubject`(IN `p_sub_code` VARCHAR(100), IN `p_sub_name` VARCHAR(150), IN `p_sem_no` INT, IN `p_syl_id` INT, IN `p_d_id` INT, IN `p_level` INT, IN `p_status` VARCHAR(50), IN `p_pass_grade` INT)
BEGIN

	DECLARE p_sub_id INT(11);



    INSERT INTO subject (sub_code, sub_name, sem_no, syl_id, level, status, pass_grade)



    VALUES (p_sub_code, p_sub_name, p_sem_no, p_syl_id, p_level, p_status, p_pass_grade);



	SET p_sub_id = LAST_INSERT_ID();



	INSERT INTO dep_sub (d_id, sub_id) VALUES (p_d_id, p_sub_id);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateSyllabus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateSyllabus`(IN `p_deg_id` INT, IN `p_commenced_year` YEAR, IN `p_expired_year` YEAR, IN `p_status` VARCHAR(50))
BEGIN

	DECLARE v_syl_id INT;



    INSERT INTO syllabus(commenced_year, expired_year, status)



    VALUES (p_commenced_year, p_expired_year, p_status);

    

    SET v_syl_id = LAST_INSERT_ID();

    

    INSERT INTO deg_syl(deg_id, syl_id)



    VALUES (p_deg_id, v_syl_id);

    



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateVenue` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `CreateVenue`(IN `p_short_code` VARCHAR(100), IN `p_description` VARCHAR(500), IN `p_seat_count` INT)
BEGIN



    INSERT INTO venue (short_code, description, seat_count)



    VALUES (p_short_code, p_description, p_seat_count);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteBatchSubjectEntries` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `DeleteBatchSubjectEntries`(IN `p_batch_id` INT)
BEGIN



    DECLARE sub_id INT;



    DECLARE done INT DEFAULT FALSE;







    -- Cursor declaration



    DECLARE cursor_subjects CURSOR FOR 



        SELECT sub_id 



        FROM batch_subject_lecturer 



        WHERE batch_id = p_batch_id;







    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;







    -- Start transaction



    START TRANSACTION;







    -- Open cursor



    OPEN cursor_subjects;







    subject_loop: LOOP



        FETCH cursor_subjects INTO sub_id;







        IF done THEN



            LEAVE subject_loop;



        END IF;







        -- Construct the dynamic table name



        SET @table_name = CONCAT('batch_', p_batch_id, '_sub_', sub_id);







        -- Delete all rows from the dynamically constructed table



        SET @delete_query = CONCAT('DELETE FROM ', @table_name);



        PREPARE delete_stmt FROM @delete_query;



        EXECUTE delete_stmt;



        DEALLOCATE PREPARE delete_stmt;



    END LOOP;







    -- Close cursor



    CLOSE cursor_subjects;







    -- Commit transaction



    COMMIT;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteBatchSubjectLecturerRows` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `DeleteBatchSubjectLecturerRows`(IN `p_batch_id` INT)
BEGIN



    DELETE FROM batch_subject_lecturer WHERE batch_id = p_batch_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteGrpSubjects` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `DeleteGrpSubjects`(IN `p_grp_id` INT)
BEGIN



    DELETE FROM 

    

    grp_sub



    WHERE grp_id = p_grp_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DropOldBatchTablesAndColumns` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `DropOldBatchTablesAndColumns`(IN `p_batch_id` INT, IN `p_old_subjects` JSON)
BEGIN



    DECLARE i INT DEFAULT 0;



    DECLARE sub_id INT;



    DECLARE drop_table_sql TEXT;



    DECLARE drop_column_sql TEXT;







    SET drop_column_sql = CONCAT('ALTER TABLE batch_', p_batch_id, '_students ');







    WHILE i < JSON_LENGTH(p_old_subjects) DO



        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_old_subjects, CONCAT('$[', i, '].sub_id')));



        



        -- Drop old tables



        SET drop_table_sql = CONCAT('DROP TABLE IF EXISTS batch_', p_batch_id, '_sub_', sub_id);

        

        SET @stmt = drop_table_sql;



        PREPARE stmt FROM @stmt;



        EXECUTE stmt;



        DEALLOCATE PREPARE stmt;







        -- Prepare column drop SQL



        IF i > 0 THEN



            SET drop_column_sql = CONCAT(drop_column_sql, ',');



        END IF;



        SET drop_column_sql = CONCAT(drop_column_sql, ' DROP COLUMN sub_', sub_id);



        



        SET i = i + 1;



    END WHILE;







    -- Execute column drop SQL

    SET @stmt = drop_column_sql;



    PREPARE stmt FROM @stmt;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `FetchStudentEligibilityByBatchIdAndSId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `FetchStudentEligibilityByBatchIdAndSId`(IN `p_batch_id` INT, IN `p_s_id` INT)
BEGIN



    DECLARE done INT DEFAULT FALSE;



    DECLARE temp_sub_id INT;



    DECLARE cur CURSOR FOR



        SELECT sub_id



        FROM batch_subject_lecturer



        WHERE batch_id = p_batch_id;







    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;







    -- Temporary table to collect results



    CREATE TEMPORARY TABLE IF NOT EXISTS temp_eligibility_results (



        sub_id INT,



        eligibility VARCHAR(50)



    );







    -- Iterate over all subjects for the batch



    OPEN cur;







    subject_loop: LOOP



        FETCH cur INTO temp_sub_id;







        IF done THEN



            LEAVE subject_loop;



        END IF;







        -- Construct dynamic query to fetch eligibility



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







    -- Fetch all data from the temporary table



    SELECT * FROM temp_eligibility_results;







    -- Drop the temporary table



    DROP TEMPORARY TABLE temp_eligibility_results;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `FetchStudentsWithSubjects` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `FetchStudentsWithSubjects`(IN `p_batch_id` INT)
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







    -- Temporary table to collect results



    CREATE TEMPORARY TABLE IF NOT EXISTS temp_results (



        s_id INT,



        name VARCHAR(255),



        index_num VARCHAR(255),



        user_name VARCHAR(255),



        exam_type VARCHAR(50),



        sub_id INT,



        eligibility VARCHAR(50)



    );







    -- Iterate over all subjects for the batch



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







    -- Fetch all data from the temporary table



    SELECT * FROM temp_results ORDER BY index_num ASC;







    -- Drop the temporary table



    DROP TEMPORARY TABLE temp_results;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `FetchStudentWithSubjectsByUserId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `FetchStudentWithSubjectsByUserId`(IN `batch_id` INT, IN `user_id` INT)
BEGIN

  -- Declare variables

  DECLARE dynamic_students_table VARCHAR(255);

  DECLARE query_students TEXT;

  DECLARE query_subjects TEXT;

  DECLARE uid INT;

  DECLARE bid INT;



  -- Assign IN parameters to local variables for EXECUTE USING

  SET uid = user_id;

  SET bid = batch_id;



  -- Set the dynamic table name

  SET dynamic_students_table = CONCAT('batch_', batch_id, '_students');



  -- Query to get student details

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



  -- Query to get subjects and attendance

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `FillProperSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `FillProperSummary`(IN p_batch_id INT)
BEGIN



    DECLARE v_batch_code VARCHAR(100);



    DECLARE v_description VARCHAR(500);



    DECLARE v_deg_id INT;



    DECLARE v_no_of_sem_per_year VARCHAR(10);



    DECLARE v_academic_year VARCHAR(50);



    DECLARE v_sem VARCHAR(10);



    



    -- 1. Get batch information and extract academic_year and sem



    SELECT batch_code, deg_id, description 



    INTO v_batch_code, v_deg_id, v_description



    FROM batch 



    WHERE batch_id = p_batch_id;



    



    -- Get the number of semesters per year from degree table



    SELECT no_of_sem_per_year 



    INTO v_no_of_sem_per_year



    FROM degree 



    WHERE deg_id = v_deg_id;



    



    -- Extract academic_year (first four characters of batch_code)



    SET v_academic_year = LEFT(v_batch_code, 4);



    



    -- Extract sem based on no_of_sem_per_year



    IF CAST(v_no_of_sem_per_year AS UNSIGNED) < 10 THEN



        SET v_sem = RIGHT(v_batch_code, 1);



    ELSE



        SET v_sem = RIGHT(v_batch_code, 2);



    END IF;



    



    -- 2. First execute the INSERT operation



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



    



    -- 3. Then execute the UPDATE operation separately



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GenerateIndexNumbers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GenerateIndexNumbers`(IN `p_batch_id` INT, IN `p_course` VARCHAR(50), IN `p_batch` VARCHAR(50), IN `p_startsFrom` INT)
BEGIN



    DECLARE done INT DEFAULT FALSE;



    DECLARE student_s_id INT;



    DECLARE student_user_name VARCHAR(250);



    DECLARE index_counter INT DEFAULT p_startsFrom;



    DECLARE cursor_students CURSOR FOR SELECT s_id, user_name FROM temp_students;



    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;







    -- Temporary table to hold students without index numbers



    CREATE TEMPORARY TABLE IF NOT EXISTS temp_students (



        s_id INT,



        user_name VARCHAR(250)



    );







    -- Construct and execute the query to populate the temporary table



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







    -- Open cursor on the temporary table



    OPEN cursor_students;







    -- Iterate through the students and assign index numbers



    subject_loop: LOOP



        FETCH cursor_students INTO student_s_id, student_user_name;







        IF done THEN



            LEAVE subject_loop;



        END IF;







        -- Generate the new index number



        SET @new_index = CONCAT(p_course, " ", p_batch, LPAD(index_counter, 3, '0'));







        -- Update the student's index number



        UPDATE student_detail



        SET index_num = @new_index



        WHERE s_id = student_s_id;







        -- Increment the index counter



        SET index_counter = index_counter + 1;



    END LOOP;







    -- Close cursor



    CLOSE cursor_students;







    -- Fetch and return the updated students



    SELECT sd.s_id, sd.index_num, u.user_name



    FROM student_detail sd



    JOIN student st ON sd.s_id = st.s_id



    JOIN user u ON st.user_id = u.user_id



    WHERE sd.index_num LIKE CONCAT(p_course, " ", p_batch, "%")



    AND sd.index_num IS NOT NULL AND sd.index_num != ""



    ORDER BY sd.index_num ASC;







    -- Drop the temporary table



    DROP TEMPORARY TABLE IF EXISTS temp_students;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveBatches` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveBatches`(IN `p_deg_id` INT)
BEGIN



    SET @query = CONCAT(



        'SELECT b.batch_id, b.batch_code, g.course_title, b.level, b.sem, b.academic_year FROM batch b JOIN grp g ON b.grp_id = g.grp_id WHERE b.deg_id = ',p_deg_id,'  AND b.status = ''true'' ORDER BY b.batch_code DESC'



    );



    PREPARE stmt FROM @query;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveBatchesOfDegWithinDeadline` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveBatchesOfDegWithinDeadline`(IN `p_deg_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN



    DECLARE sql_query TEXT;





 

        -- Construct the SQL query



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







        -- Prepare, execute, and clean up the query

        SET @stmt = sql_query;



        PREPARE stmt FROM @stmt;



        EXECUTE stmt;



        DEALLOCATE PREPARE stmt;





END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveBatchesOfDep` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveBatchesOfDep`(IN `p_d_id` INT)
BEGIN



    DECLARE sql_query TEXT;





        -- Construct the SQL query



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







        -- Prepare, execute, and clean up the query

        SET @stmt = sql_query;



        PREPARE stmt FROM @stmt;



        EXECUTE stmt;



        DEALLOCATE PREPARE stmt;









END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveBatchesOfDepWithinDeadline` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveBatchesOfDepWithinDeadline`(IN `p_d_id` INT)
BEGIN



    DECLARE sql_query TEXT;



        -- Construct the SQL query



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







        -- Prepare, execute, and clean up the query

        SET @stmt = sql_query;



        PREPARE stmt FROM @stmt;



        EXECUTE stmt;



        DEALLOCATE PREPARE stmt;



  

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveDegrees` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveDegrees`(`department_ids` TEXT)
BEGIN



    SET @query = CONCAT('SELECT deg_id, short FROM dep_deg WHERE d_id IN (', department_ids, ') AND status = ''true''');



    PREPARE stmt FROM @query;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveDegreesInFaculty` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveDegreesInFaculty`(IN `p_f_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveDepartmentsWithDegreesCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveDepartmentsWithDegreesCount`(IN `p_f_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetActiveFacultiesWithDepartmentsCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetActiveFacultiesWithDepartmentsCount`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAdminDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAdminDetails`(IN `p_user_id` INT)
BEGIN



    SELECT 



        email, user_name, role_id



    FROM 



        user



    WHERE 



        user_id = p_user_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAdminSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAdminSummary`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllActiveBatchesProgesses` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllActiveBatchesProgesses`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllActiveLecturers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllActiveLecturers`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllBatchDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllBatchDetails`()
BEGIN



    DECLARE done INT DEFAULT 0;

    DECLARE batchId INT;

    DECLARE batchCode VARCHAR(100);

    DECLARE academicYear VARCHAR(50);

    DECLARE levelNo INT(11);

    DECLARE semNo INT(11);    

    DECLARE shortCode VARCHAR(50);

    DECLARE degName VARCHAR(500);

    DECLARE batchStatus VARCHAR(50);

    DECLARE studentCount INT DEFAULT 0; -- Default student count to 0



    -- Declare cursor to fetch all batches, including those without students

    DECLARE batch_cursor CURSOR FOR 

        SELECT batch_id, batch_code, status, academic_year, level, sem FROM batch;



    -- Declare continue handler for cursor

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;



    -- Drop the temporary table if it exists

    DROP TEMPORARY TABLE IF EXISTS temp_batch_details;



    -- Temporary table to store results

    CREATE TEMPORARY TABLE temp_batch_details (

        batch_id INT,

        batch_code VARCHAR(100),

        academic_year VARCHAR(50),

        level INT(11),

        sem INT(11),

        degree_name VARCHAR(500),

        student_count INT,

        batch_status VARCHAR(50)

    );



    -- Open the cursor

    OPEN batch_cursor;



    -- Start fetching batches

    read_loop: LOOP

        FETCH batch_cursor INTO batchId, batchCode, batchStatus, academicYear, levelNo, semNo;



        IF done THEN

            LEAVE read_loop;

        END IF;



        -- Get degree name

        SELECT deg_name INTO degName

        FROM degree d

        JOIN batch b ON d.deg_id = b.deg_id

        WHERE b.batch_id = batchId

        LIMIT 1;



        -- Count the number of students who applied to the exam from the specific batch students table

        SET @query = CONCAT('SELECT COUNT(*) INTO @studentCount FROM batch_', batchId, '_students');

        PREPARE stmt FROM @query;

        EXECUTE stmt;

        DEALLOCATE PREPARE stmt;



        -- Insert the results into the temporary table

        INSERT INTO temp_batch_details (batch_id, batch_code, academic_year, level, sem, degree_name, student_count, batch_status)

        VALUES (batchId, batchCode, academicYear, levelNo, semNo, degName, @studentCount, batchStatus);



    END LOOP;



    -- Close the cursor

    CLOSE batch_cursor;



    -- Return all results from the temporary table

    SELECT * FROM temp_batch_details ORDER BY batch_id DESC;



    -- Drop the temporary table

    DROP TEMPORARY TABLE IF EXISTS temp_batch_details;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllBatches` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllBatches`()
BEGIN



    SELECT * FROM batch;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllDegrees` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllDegrees`()
BEGIN



    SELECT * 



    FROM degree 



    WHERE status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllDegreesWithDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllDegreesWithDetails`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllDepartments` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllDepartments`()
BEGIN



    SELECT * 



    FROM department



    WHERE status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllDepartmentsWithDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllDepartmentsWithDetails`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllFaculties` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllFaculties`()
BEGIN



    SELECT * 



    FROM faculty 



    WHERE status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllFacultiesWithDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllFacultiesWithDetails`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllGroupsWithExtraDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllGroupsWithExtraDetails`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllInstructions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER $$
CREATE PROCEDURE `GetAllInstructions`()
BEGIN

  SELECT * FROM instruction;

END$$
DELIMITER ;

/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllLecturers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllLecturers`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllLevelsInDegree` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllLevelsInDegree`(IN `p_deg_id` INT)
BEGIN



    SELECT 



        deg.deg_id,



        deg.deg_name,



        deg.levels



    FROM degree deg



    WHERE deg.deg_id = p_deg_id AND deg.status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllPayments` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllPayments`()
BEGIN

  SELECT * FROM payment ORDER BY type;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllStudents` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllStudents`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllSubjects` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllSubjects`()
BEGIN



    SELECT * 



    FROM subject 



    WHERE status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllSubjectsForGroupCreation` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER $$
CREATE PROCEDURE `GetAllSubjectsForGroupCreation`(IN `p_syl_id` INT, IN `p_level` INT, IN `p_sem_no` INT)
BEGIN



    SELECT 



        subject.sub_id,

        subject.sub_code,

        subject.sub_name



    FROM subject


	WHERE subject.syl_id = p_syl_id  AND subject.level = p_level AND subject.sem_no = p_sem_no; 

END$$
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllSubjectsForLecturer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllSubjectsForLecturer`(IN `p_user_id` INT)
BEGIN



    DECLARE p_l_id INT;







    -- Step 1: Get lecturer ID (l_id) from user ID



    SELECT l_id INTO p_l_id



    FROM lecturer



    WHERE user_id = p_user_id;







    IF p_l_id IS NULL THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lecturer ID not found for the given user ID.';



    END IF;







    -- Step 2: Fetch all subjects (sub_id, sub_code, sub_name) for the lecturer's active batches



    -- but only if the lecturer deadline has not passed



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



        AND btp.user_type = '4' -- Lecturer user type



        AND btp.end_date > NOW() -- Deadline has not passed



        AND b.application_open < NOW(); -- open date has passed



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllSubjectsWithExtraDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllSubjectsWithExtraDetails`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllSyllabiWithExtraDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAllSyllabiWithExtraDetails`()
BEGIN



    SELECT 



        s.*,



        deg.deg_name AS degree_name



    FROM syllabus s

    JOIN deg_syl ds ON s.syl_id = ds.syl_id

    JOIN degree deg ON ds.deg_id = deg.deg_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAppliedMedicalStudentsByBatchAndSubject` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAppliedMedicalStudentsByBatchAndSubject`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN



    DECLARE p_l_id INT;



    DECLARE batch_status VARCHAR(50);



    DECLARE lecturer_deadline TIMESTAMP;





  -- Step 1: Check batch status



    SELECT status INTO batch_status



    FROM batch



    WHERE batch_id = p_batch_id;







    IF batch_status != 'true' THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';



    END IF;







    -- Step 2: Verify lecturer access and deadline



    IF p_role_id = '4' THEN -- Not an admin



        -- Retrieve lecturer ID for the user



        SELECT l_id INTO p_l_id



        FROM lecturer



        WHERE user_id = p_user_id;







        IF p_l_id IS NULL THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';



        END IF;







        -- Verify the user is assigned to the batch and subject



        SELECT COUNT(*)



        INTO @access_count



        FROM batch_subject_lecturer



        WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;







        IF @access_count = 0 THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';



        END IF;







        -- Check if the lecturer's deadline has passed



        SELECT end_date INTO lecturer_deadline



        FROM batch_time_periods



        WHERE batch_id = p_batch_id AND user_type = '4'; -- '4' is the lecturer user type







        IF NOW() > lecturer_deadline THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The deadline for accessing this batch has passed.';



        END IF;



    END IF;



  -- Step 2: Verify hod access and deadline

IF p_role_id = '3' THEN -- Not an admin



        -- Retrieve lecturer ID for the user



        SELECT d_id INTO p_l_id



        FROM department



        WHERE user_id = p_user_id;







        IF p_l_id IS NULL THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';



        END IF;







        -- Verify the user is assigned to the batch and subject



        SELECT COUNT(*)



        INTO @access_count



        FROM dep_sub



        WHERE d_id = p_l_id AND sub_id = p_sub_id;







        IF @access_count = 0 THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';



        END IF;





    END IF;



-- Step 2: Verify deen access and deadline

IF p_role_id = '2' THEN -- Not an admin



        -- Retrieve lecturer ID for the user



        SELECT f_id INTO p_l_id



        FROM faculty



        WHERE user_id = p_user_id;







        IF p_l_id IS NULL THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';



        END IF;







        -- Verify the user is assigned to the batch and subject



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





    -- Step 3: Retrieve applied student details



    -- Fetch batch students with attendance



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAppliedResitStudentsByBatchAndSubject` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAppliedResitStudentsByBatchAndSubject`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN



    DECLARE p_l_id INT;



    DECLARE batch_status VARCHAR(50);



    DECLARE lecturer_deadline TIMESTAMP;





-- Step 1: Check batch status



    SELECT status INTO batch_status



    FROM batch



    WHERE batch_id = p_batch_id;







    IF batch_status != 'true' THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';



    END IF;







    -- Step 2: Verify lecturer access and deadline



    IF p_role_id = '4' THEN -- Not an admin



        -- Retrieve lecturer ID for the user



        SELECT l_id INTO p_l_id



        FROM lecturer



        WHERE user_id = p_user_id;







        IF p_l_id IS NULL THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';



        END IF;







        -- Verify the user is assigned to the batch and subject



        SELECT COUNT(*)



        INTO @access_count



        FROM batch_subject_lecturer



        WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;







        IF @access_count = 0 THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';



        END IF;







        -- Check if the lecturer's deadline has passed



        SELECT end_date INTO lecturer_deadline



        FROM batch_time_periods



        WHERE batch_id = p_batch_id AND user_type = '4'; -- '4' is the lecturer user type







        IF NOW() > lecturer_deadline THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The deadline for accessing this batch has passed.';



        END IF;



    END IF;



  -- Step 2: Verify hod access and deadline

IF p_role_id = '3' THEN -- Not an admin



        -- Retrieve lecturer ID for the user



        SELECT d_id INTO p_l_id



        FROM department



        WHERE user_id = p_user_id;







        IF p_l_id IS NULL THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';



        END IF;







        -- Verify the user is assigned to the batch and subject



        SELECT COUNT(*)



        INTO @access_count



        FROM dep_sub



        WHERE d_id = p_l_id AND sub_id = p_sub_id;







        IF @access_count = 0 THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';



        END IF;



    END IF;



-- Step 2: Verify deen access and deadline

IF p_role_id = '2' THEN -- Not an admin



        -- Retrieve lecturer ID for the user



        SELECT f_id INTO p_l_id



        FROM faculty



        WHERE user_id = p_user_id;







        IF p_l_id IS NULL THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';



        END IF;







        -- Verify the user is assigned to the batch and subject



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





    -- Step 3: Retrieve applied student details



    -- Fetch batch students with attendance



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAppliedStudentsByBatchAndSubject` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAppliedStudentsByBatchAndSubject`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN



    DECLARE p_l_id INT;



    DECLARE batch_status VARCHAR(50);



    DECLARE lecturer_deadline TIMESTAMP;







    -- Step 1: Check batch status



    SELECT status INTO batch_status



    FROM batch



    WHERE batch_id = p_batch_id;







    IF batch_status != 'true' THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';



    END IF;







    -- Step 2: Verify lecturer access and deadline



    IF p_role_id != '1' THEN -- Not an admin



        -- Retrieve lecturer ID for the user



        SELECT l_id INTO p_l_id



        FROM lecturer



        WHERE user_id = p_user_id;







        IF p_l_id IS NULL THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not authorized to access this batch.';



        END IF;







        -- Verify the user is assigned to the batch and subject



        SELECT COUNT(*)



        INTO @access_count



        FROM batch_subject_lecturer



        WHERE l_id = p_l_id AND sub_id = p_sub_id AND batch_id = p_batch_id;







        IF @access_count = 0 THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not have permission to view this batch.';



        END IF;







        -- Check if the lecturer's deadline has passed



        SELECT end_date INTO lecturer_deadline



        FROM batch_time_periods



        WHERE batch_id = p_batch_id AND user_type = '4'; -- '4' is the lecturer user type







        IF NOW() > lecturer_deadline THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The deadline for accessing this batch has passed.';



        END IF;



    END IF;







    -- Step 3: Retrieve applied student details



    -- Fetch batch students with attendance



    SET @batch_students_query = CONCAT(



        'SELECT sd.name, sd.s_id, u.user_name, bs.sub_', p_sub_id, ' AS attendance, bsub.eligibility ',



        'FROM batch_', p_batch_id, '_students bs ',



        'JOIN batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ON bs.s_id = bsub.s_id ',



        'JOIN student_detail sd ON sd.s_id = bs.s_id ',



        'JOIN student st ON st.s_id = bs.s_id ',



        'JOIN user u ON st.user_id = u.user_id ',



        'WHERE bs.sub_', p_sub_id, ' IS NOT NULL AND bsub.eligibility IS NOT NULL'



    );







    -- Fetch medical/resit students with exam_type as "attendance"



    SET @non_batch_students_query = CONCAT(



        'SELECT sd.name, sd.s_id, u.user_name, bsub.exam_type AS attendance, bsub.eligibility ',



        'FROM batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ',



        'JOIN student_detail sd ON sd.s_id = bsub.s_id ',



        'JOIN student st ON st.s_id = bsub.s_id ',



        'JOIN user u ON st.user_id = u.user_id ',



        'WHERE bsub.s_id NOT IN (SELECT s_id FROM batch_', p_batch_id, '_students)'



    );







    -- Combine both queries



    SET @final_query = CONCAT('(', @batch_students_query, ') UNION ALL (', @non_batch_students_query, ')');







    PREPARE stmt FROM @final_query;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAppliedStudentsForSubjectOfFacOrDep` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetAppliedStudentsForSubjectOfFacOrDep`(IN `p_batch_id` INT, IN `p_sub_id` INT, IN `p_role_id` VARCHAR(50))
BEGIN



    DECLARE batch_status VARCHAR(50);



    DECLARE deadline TIMESTAMP;



    DECLARE previous_deadline TIMESTAMP;







    -- Step 1: Check batch status



    SELECT status INTO batch_status



    FROM batch



    WHERE batch_id = p_batch_id;







    IF batch_status != 'true' THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';



    END IF;







    -- Verify department access and deadline



    IF p_role_id = '3' THEN 



        SELECT end_date INTO previous_deadline



        FROM batch_time_periods



        WHERE batch_id = p_batch_id AND user_type = '4'; 







        IF NOW() < previous_deadline THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This is not a accessing period of this batch.';



        END IF;



    END IF;



    



    -- Verify faculty access and deadline



    IF p_role_id = '2' THEN 



        SELECT end_date INTO previous_deadline



        FROM batch_time_periods



        WHERE batch_id = p_batch_id AND user_type = '3'; 







        IF NOW() < previous_deadline THEN



            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This is not a accessing period of this batch.';



        END IF;



    END IF;







    -- Step 3: Retrieve applied student details



    -- Fetch batch students with attendance



    SET @batch_students_query = CONCAT(



        'SELECT sd.name, sd.s_id, u.user_name, bs.sub_', p_sub_id, ' AS attendance, bsub.eligibility ',



        'FROM batch_', p_batch_id, '_students bs ',



        'JOIN batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ON bs.s_id = bsub.s_id ',



        'JOIN student_detail sd ON sd.s_id = bs.s_id ',



        'JOIN student st ON st.s_id = bs.s_id ',



        'JOIN user u ON st.user_id = u.user_id ',



        'WHERE bs.sub_', p_sub_id, ' IS NOT NULL AND bsub.eligibility IS NOT NULL'



    );







    -- Fetch medical/resit students with exam_type as "attendance"



    SET @non_batch_students_query = CONCAT(



        'SELECT sd.name, sd.s_id, u.user_name, bsub.exam_type AS attendance, bsub.eligibility ',



        'FROM batch_', p_batch_id, '_sub_', p_sub_id, ' bsub ',



        'JOIN student_detail sd ON sd.s_id = bsub.s_id ',



        'JOIN student st ON st.s_id = bsub.s_id ',



        'JOIN user u ON st.user_id = u.user_id ',



        'WHERE bsub.s_id NOT IN (SELECT s_id FROM batch_', p_batch_id, '_students)'



    );







    -- Combine both queries



    SET @final_query = CONCAT('(', @batch_students_query, ') UNION ALL (', @non_batch_students_query, ')');







    PREPARE stmt FROM @final_query;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchAdmissionDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchAdmissionDetails`(IN `p_batch_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchApprovalAndDeadline` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchApprovalAndDeadline`(IN `p_batch_id` INT, IN `p_role_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchCount`()
BEGIN



    SELECT COUNT(*) AS batch_count FROM batch;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchDetails`(IN `p_batch_id` INT)
BEGIN



    SELECT * FROM batch WHERE batch_id = p_batch_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchDynamicTablesData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchDynamicTablesData`(IN `p_batch_id` INT, IN `p_sub_ids` VARCHAR(255))
BEGIN

    -- Variables for dynamic SQL

    DECLARE current_pos INT DEFAULT 1;

    DECLARE comma_pos INT;

    DECLARE current_sub_id VARCHAR(10);

    DECLARE dynamic_sql TEXT;

    DECLARE select_parts TEXT DEFAULT '';

    DECLARE from_part TEXT DEFAULT '';

    DECLARE join_parts TEXT DEFAULT '';

    DECLARE union_part TEXT DEFAULT '';

    

    -- Initialize the SELECT part with s_id and additional columns

    SET select_parts = 'SELECT all_s_ids.s_id, sd.name, sd.index_num, u.user_name';

    

    -- Process the sub_ids string manually

    sub_parsing: LOOP

        -- Find the next comma

        SET comma_pos = LOCATE(',', p_sub_ids, current_pos);

        

        -- Extract the current sub_id

        IF comma_pos > 0 THEN

            SET current_sub_id = SUBSTRING(p_sub_ids, current_pos, comma_pos - current_pos);

            SET current_pos = comma_pos + 1;

        ELSE

            -- Last or only sub_id

            SET current_sub_id = SUBSTRING(p_sub_ids, current_pos);

            

            -- Exit condition

            IF LENGTH(current_sub_id) = 0 THEN

                LEAVE sub_parsing;

            END IF;

        END IF;

        

        -- Trim whitespace

        SET current_sub_id = TRIM(current_sub_id);

        

        -- Add columns for this table to SELECT clause

        SET select_parts = CONCAT(select_parts, 

                           ', IFNULL(t', current_sub_id, '.eligibility, "") AS sub_', current_sub_id, '_eligibility',

                           ', IFNULL(t', current_sub_id, '.exam_type, "") AS sub_', current_sub_id, '_exam_type');

        

        -- Build the UNION part for all s_ids

        IF LENGTH(union_part) > 0 THEN

            SET union_part = CONCAT(union_part, ' UNION SELECT s_id FROM batch_', p_batch_id, '_sub_', current_sub_id);

        ELSE

            SET union_part = CONCAT('SELECT s_id FROM batch_', p_batch_id, '_sub_', current_sub_id);

        END IF;

        

        -- Add LEFT JOIN for this table

        SET join_parts = CONCAT(join_parts, 

                         ' LEFT JOIN batch_', p_batch_id, '_sub_', current_sub_id, ' AS t', current_sub_id, 

                         ' ON all_s_ids.s_id = t', current_sub_id, '.s_id');

        

        -- Check if we've reached the end of the string

        IF comma_pos = 0 THEN

            LEAVE sub_parsing;

        END IF;

    END LOOP;

    

    -- Complete the FROM clause with additional JOINs for student details and user info

    SET from_part = CONCAT('FROM (SELECT DISTINCT s_id FROM (', union_part, ') AS union_result) AS all_s_ids',

                          ' LEFT JOIN student_detail sd ON all_s_ids.s_id = sd.s_id',

                          ' LEFT JOIN student s ON all_s_ids.s_id = s.s_id',

                          ' LEFT JOIN user u ON s.user_id = u.user_id');

    

    -- Build the complete SQL query

    SET dynamic_sql = CONCAT(select_parts, ' ', from_part, ' ', join_parts);

    

    -- Prepare and execute the dynamic SQL

    SET @sql = dynamic_sql;

    PREPARE stmt FROM @sql;

    EXECUTE stmt;

    DEALLOCATE PREPARE stmt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchesByFacultyId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchesByFacultyId`(IN `p_f_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchFullDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchFullDetails`(IN `p_batch_id` INT)
BEGIN



    DECLARE query TEXT;







    -- Construct the query to fetch batch details



    SET query = CONCAT(



    'SELECT b.batch_id, b.batch_code, b.academic_year, b.level, b.sem, g.course_title, fac.f_name, a.exam_date ',



    'FROM batch b ',



    'JOIN grp g ON b.grp_id = g.grp_id ',



    'JOIN fac_deg fd ON b.deg_id = fd.deg_id ',



    'JOIN faculty fac ON fd.f_id = fac.f_id ',

        

    'LEFT JOIN attendance a ON b.batch_id = a.batch_id ',



    'WHERE b.batch_id = ', p_batch_id



);







    -- Execute the constructed query

    SET @stmt = query;



    PREPARE stmt FROM @stmt;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBatchOpenDate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetBatchOpenDate`(IN `p_batch_id` INT)
BEGIN



    SELECT



    	application_open, payment_end



    FROM



        batch



    WHERE



       	batch_id = p_batch_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDeadlinesForBatch` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER $$
CREATE PROCEDURE `GetDeadlinesForBatch`(IN `p_batch_id` INT)
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



END$$
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegFacDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegFacDetails`(IN `p_deg_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegreeById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegreeById`(IN `p_deg_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegreeByShort` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegreeByShort`(IN `p_short` VARCHAR(50))
BEGIN



    SELECT deg_name 



    FROM degree 



    WHERE short = p_short;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegreeCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegreeCount`(OUT `p_degree_count` INT)
BEGIN



    SELECT COUNT(*) INTO p_degree_count



    FROM degree;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegreeCountByDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegreeCountByDepartment`(IN `p_d_id` INT, OUT `p_degree_count` INT)
BEGIN



    SELECT COUNT(DISTINCT deg_id) INTO p_degree_count



    FROM dep_deg



    WHERE d_id = p_d_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegreeCountByLevel` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegreeCountByLevel`(IN `p_levels` VARCHAR(255), OUT `p_degree_count` INT)
BEGIN



    SELECT COUNT(*) INTO p_degree_count



    FROM degree



    WHERE levels = p_levels;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegreeDetailsByDegid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegreeDetailsByDegid`(IN `p_deg_id` INT, OUT `p_exists` INT)
BEGIN



    SELECT COUNT(*) INTO p_exists



    FROM degree



    WHERE deg_id = p_deg_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDegreesByFacultyId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDegreesByFacultyId`(IN `p_f_id` INT)
BEGIN



    SELECT 



        degree.* 



    FROM degree 



    INNER JOIN fac_deg ON degree.deg_id = fac_deg.deg_id 



    WHERE fac_deg.f_id = p_f_id 



      AND degree.status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDepartmentById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDepartmentById`(IN `p_d_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDepartmentCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDepartmentCount`(OUT `p_department_count` INT)
BEGIN



    SELECT COUNT(*) INTO p_department_count



    FROM department;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDepartmentCountByFaculty` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDepartmentCountByFaculty`(IN `p_f_id` INT, OUT `p_department_count` INT)
BEGIN



    SELECT COUNT(DISTINCT d_id) INTO p_department_count



    FROM fac_dep



    WHERE f_id = p_f_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDepartmentDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDepartmentDetails`(IN `p_user_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDepartmentDetailsByDid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDepartmentDetailsByDid`(IN `p_d_id` INT)
BEGIN



    SELECT d.d_id, d.user_id



    FROM department d



    WHERE d.d_id = p_d_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDepartmentsByFacultyId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDepartmentsByFacultyId`(IN `p_f_id` INT)
BEGIN



    SELECT 



        department.* 



    FROM department 



    INNER JOIN fac_dep ON department.d_id = fac_dep.d_id 



    WHERE fac_dep.f_id = p_f_id 



      AND department.status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetDynamicTableData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetDynamicTableData`(IN `batch_id` INT, IN `sub_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetEligibleMedicalBatches` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER $$
CREATE PROCEDURE `GetEligibleMedicalBatches`(IN `p_user_id` INT)
BEGIN

    DECLARE v_s_id INT;

    DECLARE v_syl_id INT;

    DECLARE v_batch_ids TEXT;

    DECLARE v_last_batch_id INT;

    DECLARE v_level INT;



    -- Get student ID from user_id

    SELECT s_id INTO v_s_id FROM student WHERE user_id = p_user_id;



    -- Get batch_ids and syl_id

    SELECT batch_ids, syl_id INTO v_batch_ids, v_syl_id FROM student_detail WHERE s_id = v_s_id;



    -- CASE 1: batch_ids is NULL or empty

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

    bt5.end_date AS deadline,         -- user_type = 5

    bt2.end_date AS dean_end,             -- user_type = 2

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





    -- CASE 2: batch_ids is NOT EMPTY

    ELSE

        -- Extract last batch_id from comma-separated string

        SET v_last_batch_id = CAST(SUBSTRING_INDEX(v_batch_ids, ',', -1) AS UNSIGNED);

		SELECT level, status INTO v_level, @last_batch_status FROM batch WHERE batch_id = v_last_batch_id;


        -- Now filter eligible batches

        SELECT 

    b.batch_id,

    b.batch_code,

    b.academic_year,

    b.level,

    b.sem,

    b.application_open,

    g.course_title,

    CASE WHEN a.batch_id IS NOT NULL THEN 'true' ELSE 'false' END AS admission_ready,

    bt5.end_date AS deadline,            -- user_type = '5' 

    bt2.end_date AS dean_end,        -- user_type = '2' 

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

END$$
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetEligibleMedicalSubjectsByBatchAndUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetEligibleMedicalSubjectsByBatchAndUser`(

  IN input_batch_id INT,

  IN input_user_id INT

)
BEGIN

  DECLARE studentId INT;

  DECLARE medicalId INT;



  -- Get s_id from student

  SELECT s_id INTO studentId FROM student WHERE user_id = input_user_id LIMIT 1;



  -- Get medical_id from medical_request

  SELECT medical_id INTO medicalId 

  FROM medical_request 

  WHERE batch_id = input_batch_id AND s_id = studentId LIMIT 1;



  -- Fetch eligible subjects

  SELECT 

    u.user_name,

    s.sub_code,

    s.sub_name,

    s.sub_id

  FROM medical_subject ms

  JOIN subject s ON s.sub_id = ms.sub_id

  JOIN student st ON st.s_id = studentId

  JOIN user u ON u.user_id = st.user_id

  WHERE ms.medical_id = medicalId AND ms.eligibility = 'true';

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetEligibleResitBatches` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER $$
CREATE PROCEDURE `GetEligibleResitBatches`(IN `p_user_id` INT)
BEGIN

    DECLARE v_s_id INT;

    DECLARE v_syl_id INT;

    DECLARE v_batch_ids TEXT;

    DECLARE v_last_batch_id INT;

    DECLARE v_level INT;



    -- Get student ID from user_id

    SELECT s_id INTO v_s_id FROM student WHERE user_id = p_user_id;



    -- Get batch_ids and syl_id

    SELECT batch_ids, syl_id INTO v_batch_ids, v_syl_id FROM student_detail WHERE s_id = v_s_id;



    -- CASE 1: batch_ids is NULL or empty

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

    bt5.end_date AS deadline,         -- Student deadline (user_type = 5)

    bt2.end_date AS dean_end,     -- (user_type = 2)

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

JOIN batch_time_periods bt5 ON bt5.batch_id = b.batch_id AND bt5.user_type = '5'    -- Student

LEFT JOIN batch_time_periods bt2 ON bt2.batch_id = b.batch_id AND bt2.user_type = '2' -- HOD/Dean

WHERE b.syl_id = v_syl_id 

  AND (

      (b.status = 'true' AND NOW() <= bt5.end_date)

      OR rr.resit_id IS NOT NULL

  ) ORDER BY b.batch_id DESC;



    -- CASE 2: batch_ids is NOT EMPTY

    ELSE

        -- Extract last batch_id from comma-separated string

        SET v_last_batch_id = CAST(SUBSTRING_INDEX(v_batch_ids, ',', -1) AS UNSIGNED);

		SELECT level, status INTO v_level, @last_batch_status FROM batch WHERE batch_id = v_last_batch_id;


        -- Now filter eligible batches

        SELECT 

    b.batch_id,

    b.batch_code,

    b.academic_year,

    b.level,

    b.sem,

    b.application_open,

    g.course_title,

    CASE WHEN a.batch_id IS NOT NULL THEN 'true' ELSE 'false' END AS admission_ready,

    bt5.end_date AS deadline,         -- Student (user_type = 5) deadline

    bt2.end_date AS dean_end,     --  (user_type = 2) deadline

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

JOIN batch_time_periods bt5 ON bt5.batch_id = b.batch_id AND bt5.user_type = '5'    -- Student

LEFT JOIN batch_time_periods bt2 ON bt2.batch_id = b.batch_id AND bt2.user_type = '2' -- HOD/Dean

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

END$$
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetEligibleResitSubjectsByBatchAndUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetEligibleResitSubjectsByBatchAndUser`(IN `input_batch_id` INT, IN `input_user_id` INT)
BEGIN

  DECLARE studentId INT;

  DECLARE resitId INT;



  -- Get s_id from student

  SELECT s_id INTO studentId FROM student WHERE user_id = input_user_id LIMIT 1;



  -- Get resit_id from medical_request

  SELECT resit_id INTO resitId 

  FROM resit_request 

  WHERE batch_id = input_batch_id AND s_id = studentId LIMIT 1;



  -- Fetch eligible subjects

  SELECT 

    u.user_name,

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

  JOIN user u ON u.user_id = st.user_id

  WHERE rs.resit_id = resitId AND rs.eligibility = 'true';

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetEligibleStudentsBySub` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetEligibleStudentsBySub`(IN `p_batch_id` INT, IN `p_sub_id` INT)
BEGIN



    -- Declare the dynamic table name



    DECLARE dynamic_table_name VARCHAR(255);







    -- Construct the table name dynamically



    SET dynamic_table_name = CONCAT('batch_', p_batch_id, '_sub_', p_sub_id);







    -- Check if the dynamic table exists



    SET @check_table_query = CONCAT(



        'SELECT COUNT(*) INTO @table_exists FROM information_schema.tables ',



        'WHERE table_schema = DATABASE() AND table_name = "', dynamic_table_name, '"'



    );



    PREPARE stmt FROM @check_table_query;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;







    -- If table does not exist, raise an error



    IF @table_exists = 0 THEN



        SIGNAL SQLSTATE '45000' 



        SET MESSAGE_TEXT = 'The dynamic table does not exist.';



    END IF;







    -- Construct the query to fetch data



    SET @query = CONCAT(



    'SELECT bs.s_id, bs.exam_type, sd.index_num ',



    'FROM ', dynamic_table_name, ' bs ',



    'JOIN student_detail sd ON bs.s_id = sd.s_id ',



    'WHERE bs.eligibility = "true"'



);











    -- Execute the constructed query



    PREPARE stmt FROM @query;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetFacStudentByBatchId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetFacStudentByBatchId`(IN `p_batch_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetFacultyById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetFacultyById`(IN `p_f_id` INT)
BEGIN



    SELECT 



        f.*, 



        u.user_name AS email 



    FROM faculty f 



    LEFT JOIN user u ON u.user_id = f.user_id 



    WHERE f.f_id = p_f_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetFacultyCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetFacultyCount`(OUT `p_faculty_count` INT)
BEGIN



    SELECT COUNT(*) INTO p_faculty_count



    FROM faculty;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetFacultyDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetFacultyDetails`(IN `p_user_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetFacultyDetailsByFid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetFacultyDetailsByFid`(IN `p_f_id` INT)
BEGIN



    SELECT f.f_id, f.user_id



    FROM faculty f



    WHERE f.f_id = p_f_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetGrades` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetGrades`()
BEGIN



    SELECT 



        *



    FROM 



        grade;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetGroupById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetGroupById`(IN `p_grp_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetGroupsBySylLevSem` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetGroupsBySylLevSem`(IN `p_syl_id` INT, IN `p_level` INT, IN `p_sem_no` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetLastAssignedIndexNumber` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetLastAssignedIndexNumber`(IN `p_course` VARCHAR(50), IN `p_batch` VARCHAR(50))
BEGIN



    DECLARE last_index_num VARCHAR(50);







    -- Fetch the last assigned index number for the given course and batch



    SELECT SUBSTRING_INDEX(index_num, ' ', -1) INTO last_index_num



    FROM student_detail



    WHERE index_num LIKE CONCAT(p_course, " ", p_batch, "%")



    ORDER BY index_num DESC



    LIMIT 1;







    -- If no index number is found, return 0



    IF last_index_num IS NULL THEN



        SELECT 0 AS last_assigned_index;



    ELSE



        SELECT CAST(last_index_num AS UNSIGNED) AS last_assigned_index;



    END IF;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetLatestAdmissionTemplate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetLatestAdmissionTemplate`(IN `p_batch_id` INT)
BEGIN



    DECLARE recordExists INT;







    -- Check if a record with the given batch_id exists



    SELECT COUNT(*) INTO recordExists



    FROM admission



    WHERE batch_id = p_batch_id;







    IF recordExists > 0 THEN



        -- If a record exists, return exist=true and the record data



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



        -- If no record exists, return exist=false and the latest template data



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetLatestAttendanceTemplate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetLatestAttendanceTemplate`(IN `p_batch_id` INT, IN `p_sub_id` INT)
BEGIN



    DECLARE recordExists INT;

    DECLARE subjectRecordExists INT;







    -- Check if a record with the given batch_id exists



    SELECT COUNT(*) INTO recordExists



    FROM attendance



    WHERE batch_id = p_batch_id;







    IF recordExists > 0 THEN



        -- If a record exists, return exist=true and the record data

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



        -- If no record exists, return exist=false and the latest template data



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetLecturerById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetLecturerById`(IN `p_user_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetLecturerDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetLecturerDetails`(IN `p_user_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetNonBatchStudentsByFaculty` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetNonBatchStudentsByFaculty`(IN `p_batch_id` INT)
BEGIN



    DECLARE p_f_id INT;



    DECLARE table_name VARCHAR(255);







    -- Step 1: Get the faculty ID (f_id) for the given batch_id



    SELECT fd.f_id INTO p_f_id



    FROM batch b



    JOIN degree deg ON b.batch_code REGEXP CONCAT('^[0-9]{4}', deg.short, '[0-9]{2}$')



    JOIN dep_deg dd ON deg.deg_id = dd.deg_id



    JOIN fac_dep fd ON fd.d_id = dd.d_id



    JOIN faculty f ON fd.f_id = f.f_id



    WHERE b.batch_id = p_batch_id



    LIMIT 1;







    -- Debug: Check faculty ID



    SELECT p_f_id AS faculty_id;







    IF p_f_id IS NULL THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Faculty ID not found for the given batch ID.';



    END IF;







    -- Step 2: Construct the batch_students table name dynamically



    SET table_name = CONCAT('batch_', p_batch_id, '_students');







    -- Debug: Check the dynamic table existence



    SET @check_table_query = CONCAT('SHOW TABLES LIKE "', table_name, '"');



    PREPARE check_stmt FROM @check_table_query;



    EXECUTE check_stmt;



    DEALLOCATE PREPARE check_stmt;







    -- Step 3: Fetch students not present in the batch_students table but belong to the same faculty



    SET @query = CONCAT(



        'SELECT u.user_name, sd.s_id 



         FROM student_detail sd 



         INNER JOIN student s ON sd.s_id = s.s_id 



         INNER JOIN user u ON s.user_id = u.user_id 



         WHERE sd.s_id NOT IN (SELECT s_id FROM ', table_name, ')



         AND sd.f_id = ', p_f_id



    );







    -- Debug: Log the constructed query



    SELECT @query AS constructed_query;







    PREPARE stmt FROM @query;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetNoOfGroups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetNoOfGroups`()
BEGIN



    SELECT COUNT(*) AS grp_count FROM grp;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetNoOfLecturers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetNoOfLecturers`()
BEGIN



    SELECT COUNT(*) AS lecturer_count FROM lecturer;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetNoOfStudents` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetNoOfStudents`()
BEGIN



    SELECT COUNT(*) AS student_count FROM student;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetNoOfSubjects` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetNoOfSubjects`()
BEGIN



    SELECT COUNT(*) AS subject_count FROM subject;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetNoOfSyllabi` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetNoOfSyllabi`()
BEGIN



    SELECT COUNT(*) AS syllabus_count FROM syllabus;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetRemarksForSubject` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetRemarksForSubject`(IN `p_batch_id` INT, IN `p_sub_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentApplicationDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentApplicationDetails`(IN `p_user_id` INT)
BEGIN



    DECLARE batch_id INT;



    DECLARE batch_end_date TIMESTAMP;







    -- Get the latest batch ID



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







    -- Check batch end date before proceeding



    SELECT end_date INTO batch_end_date



    FROM batch_time_periods



    WHERE batch_id = batch_id AND user_type = '5'



    ORDER BY end_date DESC



    LIMIT 1;







    IF batch_end_date IS NULL THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch end date not found';



    END IF;







    IF NOW() > batch_end_date THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch has already ended';



    END IF;







    -- Get student and faculty details



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







    -- Get subjects for the batch (including batch ID)



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentBatchDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentBatchDetails`(IN `p_batch_ids` TEXT, IN `p_s_id` INT)
BEGIN



    DECLARE batch_id VARCHAR(255);



    DECLARE temp_batch_ids TEXT;



    DECLARE query TEXT;



    DECLARE is_first BOOLEAN DEFAULT TRUE;







    -- Initialize temporary variable with batch_ids



    SET temp_batch_ids = p_batch_ids;







    -- Start constructing the query



    SET query = '';







    -- Loop through the comma-separated batch IDs



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



            '  WHEN s.applied_to_exam = "true" AND NOT EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "pending" ',



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







    -- Handle the last batch ID



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



        '  WHEN s.applied_to_exam = "true" AND NOT EXISTS (SELECT 1 FROM admission WHERE batch_id = ', batch_id, ') THEN "pending" ',



        '  WHEN NOW() > bt.end_date AND s.applied_to_exam = "false" THEN "expired" ',



        '  ELSE "active" ',



        'END AS status ',



        'FROM batch_', batch_id, '_students s ',



        'JOIN batch b ON b.batch_id = ', batch_id, ' ',



        'JOIN grp g ON b.grp_id = g.grp_id ',



        'LEFT JOIN batch_time_periods bt ON bt.batch_id = ', batch_id, ' AND bt.user_type = "5" ',



        'WHERE s.s_id = ', p_s_id, ' '



    );







    -- Execute the constructed query

    SET @stmt = query;



    PREPARE stmt FROM @stmt;



    EXECUTE stmt;



    DEALLOCATE PREPARE stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentBatchIds` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentBatchIds`(IN `p_user_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER $$
CREATE PROCEDURE `GetStudentById`(IN `p_user_id` INT)
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
END$$
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentDetails`(IN `p_user_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentDetailsWithSubjects` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentDetailsWithSubjects`(IN `batchId` INT, IN `userId` INT)
BEGIN



    -- Variable declarations



    DECLARE sub_id INT;



    DECLARE studentId INT DEFAULT NULL;



    DECLARE done INT DEFAULT FALSE;







    -- Cursor declaration



    DECLARE cursor_subjects CURSOR FOR 



        SELECT sub_id 



        FROM batch_subject_lecturer 



        WHERE batch_id = batchId;







    -- Handler for when the cursor reaches the end



    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;







    -- Fetch studentId for the given userId



    SELECT s_id INTO studentId



    FROM student 



    WHERE user_id = userId;







    -- If studentId is NULL, throw an error



    IF studentId IS NULL THEN



        SIGNAL SQLSTATE '45000' 



        SET MESSAGE_TEXT = 'Student ID not found for the provided user ID.';



    END IF;







    -- Create a temporary table to store subjects



    CREATE TEMPORARY TABLE IF NOT EXISTS temp_subjects (



        sub_id INT,



        eligibility VARCHAR(50)



    );







    -- Open the cursor to iterate over subjects



    OPEN cursor_subjects;







    subject_loop: LOOP



        FETCH cursor_subjects INTO sub_id;







        IF done THEN



            LEAVE subject_loop;



        END IF;







        -- Check if the dynamic table exists



        SET @table_name = CONCAT('batch_', batchId, '_sub_', sub_id);







        SET @exists_query = CONCAT(



            'SELECT COUNT(*) INTO @table_exists FROM information_schema.tables ',



            'WHERE table_name = "', @table_name, '" AND table_schema = DATABASE()'



        );







        PREPARE exists_stmt FROM @exists_query;



        EXECUTE exists_stmt;



        DEALLOCATE PREPARE exists_stmt;







        -- If the table exists, fetch eligibility for the student



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







    -- Retrieve final student details with subjects



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







    -- Cleanup temporary tables



    DROP TEMPORARY TABLE IF EXISTS temp_subjects;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentMedicalApplicationDetailsByBatch` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentMedicalApplicationDetailsByBatch`(IN `p_user_id` INT, IN `p_batch_id` INT)
BEGIN

    DECLARE v_s_id INT;

    DECLARE v_batch_id INT DEFAULT p_batch_id;

    DECLARE v_syl_id INT;

    DECLARE v_level INT;

    DECLARE v_sem INT;

    DECLARE v_batch_end_date TIMESTAMP;

    DECLARE v_accessible BOOLEAN DEFAULT FALSE;



    -- Get student ID and syllabus ID

    SELECT s.s_id, sd.syl_id

    INTO v_s_id, v_syl_id

    FROM student s

    INNER JOIN student_detail sd ON sd.s_id = s.s_id

    WHERE s.user_id = p_user_id;



    IF v_s_id IS NULL THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';

    END IF;



    -- Block if batch is already applied in medical_request

    IF EXISTS (

        SELECT 1 FROM medical_request 

        WHERE s_id = v_s_id AND batch_id = v_batch_id

    ) THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Medical already applied for this batch';

    END IF;



    -- Confirm access: check batch time period (user_type = '5')

    SELECT end_date INTO v_batch_end_date

    FROM batch_time_periods

    WHERE batch_id = v_batch_id AND user_type = '5'

    ORDER BY end_date DESC

    LIMIT 1;



    IF v_batch_end_date IS NULL OR NOW() > v_batch_end_date THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch access expired or not found';

    END IF;



    -- Check eligibility logic (similar to resit but using medical_request)

    IF EXISTS (

        SELECT 1 FROM batch b

        LEFT JOIN medical_request mr ON mr.batch_id = b.batch_id AND mr.s_id = v_s_id

        LEFT JOIN batch_time_periods bt ON bt.batch_id = b.batch_id AND bt.user_type = '5'

        WHERE b.batch_id = v_batch_id

        AND b.syl_id = v_syl_id

        AND b.status = 'true'

        AND (

            NOW() <= bt.end_date

            OR mr.medical_id IS NOT NULL

        )

    ) THEN

        SET v_accessible = TRUE;

    END IF;



    IF NOT v_accessible THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student does not have access to the requested batch';

    END IF;



    -- Get student and faculty details

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



    -- Get subjects for the batch

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

)

;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentMedicalResitApplications` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentMedicalResitApplications`()
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentResitApplicationDetailsByBatch` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentResitApplicationDetailsByBatch`(IN `p_user_id` INT, IN `p_batch_id` INT)
BEGIN

    DECLARE v_s_id INT;

    DECLARE v_batch_id INT DEFAULT p_batch_id;

    DECLARE v_syl_id INT;

    DECLARE v_level INT;

    DECLARE v_sem INT;

    DECLARE v_batch_end_date TIMESTAMP;

    DECLARE v_accessible BOOLEAN DEFAULT FALSE;



    -- Get student ID and syllabus ID

    SELECT s.s_id, sd.syl_id

    INTO v_s_id, v_syl_id

    FROM student s

    INNER JOIN student_detail sd ON sd.s_id = s.s_id

    WHERE s.user_id = p_user_id;



    IF v_s_id IS NULL THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';

    END IF;



    -- Block if batch is already applied in resit_request

    IF EXISTS (

        SELECT 1 FROM resit_request 

        WHERE s_id = v_s_id AND batch_id = v_batch_id

    ) THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Resit already applied for this batch';

    END IF;



    -- Confirm access: use GetEligibleBatches logic inline to verify access

    SELECT end_date INTO v_batch_end_date

    FROM batch_time_periods

    WHERE batch_id = v_batch_id AND user_type = '5'

    ORDER BY end_date DESC

    LIMIT 1;



    IF v_batch_end_date IS NULL OR NOW() > v_batch_end_date THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch access expired or not found';

    END IF;



    -- Check eligibility from GetEligibleBatches logic

    IF EXISTS (

        SELECT 1 FROM batch b

        LEFT JOIN resit_request rr ON rr.batch_id = b.batch_id AND rr.s_id = v_s_id

        LEFT JOIN batch_time_periods bt ON bt.batch_id = b.batch_id AND bt.user_type = '5'

        WHERE b.batch_id = v_batch_id

        AND b.syl_id = v_syl_id

        AND b.status = 'true'

        AND bt.end_date > NOW()

        AND (

            rr.resit_id IS NOT NULL

            OR b.batch_id NOT IN (

                SELECT batch_id FROM resit_request WHERE s_id = v_s_id

            )

        )

    ) THEN

        SET v_accessible = TRUE;

    END IF;



    IF NOT v_accessible THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student does not have access to the requested batch';

    END IF;



    -- Get student and faculty details

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



    -- Get subjects for the batch

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentsByDeg` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentsByDeg`(IN p_deg_id INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentSubjects` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentSubjects`(IN `p_batch_id` INT, IN `p_s_id` INT)
BEGIN



    DECLARE done INT DEFAULT FALSE;



    DECLARE sub_id INT;



    DECLARE temp_description TEXT;







    -- Cursor to loop through sub_ids extracted from the description field



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







    -- Temporary table to store valid subjects



    CREATE TEMPORARY TABLE IF NOT EXISTS temp_subjects (sub_id INT);







    -- Open the cursor



    OPEN sub_cursor;







    subject_loop: LOOP



        FETCH sub_cursor INTO sub_id;







        IF done THEN



            LEAVE subject_loop;



        END IF;







        -- Check if the student exists in the specific subject table



        SET @check_query = CONCAT(



            'SELECT COUNT(*) INTO @exists 



             FROM batch_', p_batch_id, '_sub_', sub_id, 



            ' WHERE s_id = ', p_s_id



        );







        PREPARE stmt FROM @check_query;



        EXECUTE stmt;



        DEALLOCATE PREPARE stmt;







        -- If the student exists, add the sub_id to the temporary table



        IF @exists > 0 THEN



            INSERT INTO temp_subjects VALUES (sub_id);



        END IF;



    END LOOP;







    CLOSE sub_cursor;







    -- Fetch the results



    SELECT * FROM temp_subjects;







    -- Drop the temporary table



    DROP TEMPORARY TABLE temp_subjects;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetStudentsWithoutIndexNumber` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetStudentsWithoutIndexNumber`(IN `p_batch_id` INT)
BEGIN



    DECLARE table_name_students VARCHAR(255);







    -- Construct the dynamic table name for the batch students



    SET table_name_students = CONCAT('batch_', p_batch_id, '_students');







    -- Check if the table exists



    SET @check_table_query = CONCAT('SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "', table_name_students, '"');



    PREPARE check_table_stmt FROM @check_table_query;



    EXECUTE check_table_stmt;



    DEALLOCATE PREPARE check_table_stmt;







    IF @exists = 0 THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The batch students table does not exist.';



    END IF;







    -- Fetch the count of students who applied to the exam and don't have an index number



    SET @query_count = CONCAT(



        'SELECT COUNT(*) AS students_without_index 



         FROM ', table_name_students, ' bs



         JOIN student_detail sd ON sd.s_id = bs.s_id 



         WHERE bs.applied_to_exam = "true" AND (sd.index_num IS NULL OR sd.index_num = "")'



    );







    PREPARE stmt_count FROM @query_count;



    EXECUTE stmt_count;



    DEALLOCATE PREPARE stmt_count;







    -- Fetch the user_name of students who don't have an index number



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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSubjectBybatchAndDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSubjectBybatchAndDepartment`(IN `p_batch_id` INT, IN `p_d_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSubjectByBatchId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSubjectByBatchId`(IN `p_batch_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSubjectById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSubjectById`(IN `p_sub_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSubjectsByDid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSubjectsByDid`(IN `p_hod_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSubjectsByGrp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSubjectsByGrp`(IN `p_grp_id` INT)
BEGIN



    SELECT s.sub_id, s.sub_code, s.sub_name

    FROM subject s 

    JOIN grp_sub gs ON s.sub_id= gs.sub_id

    WHERE gs.grp_id=p_grp_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSubjectsByLecId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSubjectsByLecId`(IN `p_l_id` INT)
BEGIN



    SELECT subject.* 



    FROM subject 



    JOIN batch_subject_lecturer 



    ON subject.sub_id = batch_subject_lecturer.sub_id 



    WHERE batch_subject_lecturer.l_id = p_l_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSubjectsForBatch` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSubjectsForBatch`(IN `batch_id` INT)
BEGIN



    SELECT bsl.sub_id, c.sub_code, c.sub_name FROM batch_subject_lecturer bsl JOIN subject c ON bsl.sub_id=c.sub_id  WHERE bsl.batch_id = batch_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSummarySubjectsData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSummarySubjectsData`(IN `p_batch_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSyllabiByDegreeId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSyllabiByDegreeId`(IN `p_deg_id` INT)
BEGIN



    SELECT 



        syllabus.* 



    FROM syllabus 



    INNER JOIN deg_syl ON syllabus.syl_id = deg_syl.syl_id

    

    WHERE deg_syl.deg_id = p_deg_id 



      AND syllabus.status = 'true';



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSyllabusById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetSyllabusById`(IN `p_syl_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserByCredentials` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetUserByCredentials`(IN `p_user_name_or_email` VARCHAR(255), OUT `p_user_id` INT, OUT `p_password` VARCHAR(255), OUT `p_role_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserByResetToken` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetUserByResetToken`(IN `p_token` TEXT)
BEGIN



    SELECT user_id



    FROM user



    WHERE reset_token = p_token



      AND token_expiration > NOW();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetVenueById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetVenueById`(IN `p_id` INT)
BEGIN



    SELECT 



        *



    FROM venue 

    WHERE id = p_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetVenues` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `GetVenues`()
BEGIN



    SELECT 



        *



    FROM venue;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertBatch` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertBatch`(IN `p_batch_code` VARCHAR(100), IN `p_description` VARCHAR(500), IN `p_status` VARCHAR(50), IN `p_deg_id` INT, IN `p_syl_id` INT, IN `p_application_open` TIMESTAMP, IN `p_academic_year` VARCHAR(50), IN `p_level` INT(11), IN `p_sem_no` INT(11), IN `p_payment_end` TIMESTAMP, IN `p_grp_id` INT, IN `p_admin_end` TIMESTAMP, OUT `p_batch_id` INT)
BEGIN



    INSERT INTO batch (batch_code, description, status, deg_id, syl_id, application_open, payment_end, academic_year, level, sem, grp_id, admin_end)



    VALUES (p_batch_code, p_description, p_status, p_deg_id, p_syl_id, p_application_open, p_payment_end, p_academic_year, p_level, p_sem_no,p_grp_id, p_admin_end);



    SET p_batch_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertBatchSubjectLecturer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertBatchSubjectLecturer`(IN `p_batch_id` INT, IN `p_subjects` TEXT)
BEGIN



    DECLARE json_length INT;



    DECLARE counter INT DEFAULT 0;



    DECLARE sub_id INT;



    DECLARE l_id INT;







    -- Calculate the number of elements in the JSON array



    SET json_length = JSON_LENGTH(p_subjects);







    -- Loop through each element in the JSON array



    WHILE counter < json_length DO



        -- Extract sub_id and l_id from the JSON array



        SET sub_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', counter, '].sub_id')));



        SET l_id = JSON_UNQUOTE(JSON_EXTRACT(p_subjects, CONCAT('$[', counter, '].l_id')));







        -- Insert into batch_subject_lecturer



        INSERT INTO batch_subject_lecturer (batch_id, sub_id, l_id)



        VALUES (p_batch_id, sub_id, l_id);







        -- Increment counter



        SET counter = counter + 1;



    END WHILE;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertLecturer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertLecturer`(IN `p_user_id` INT, IN `p_l_id` INT)
BEGIN



    INSERT INTO lecturer(user_id, l_id) 



    VALUES (p_user_id,p_l_id);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertLecturerDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertLecturerDetail`(IN `p_name` VARCHAR(255), IN `p_contact_no` VARCHAR(20), IN `p_status` VARCHAR(255), OUT `p_l_id` INT)
BEGIN



    INSERT INTO lecturer_detail(name, contact_no, status) 



    VALUES (p_name, p_contact_no, p_status);



    SET p_l_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertMedicalApplication` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertMedicalApplication`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_subjects_string` TEXT)
BEGIN

    DECLARE v_s_id INT;

    DECLARE v_batch_end_date TIMESTAMP;

    DECLARE v_accessible BOOLEAN DEFAULT FALSE;

    DECLARE v_medical_id INT;



    -- Variables for splitting

    DECLARE v_subjects_left TEXT;

    DECLARE v_sub_id_text TEXT;

    DECLARE v_pos INT;

    DECLARE v_sub_id INT;

    DECLARE v_sub_exists INT;



    -- Get student ID

    SELECT s.s_id INTO v_s_id

    FROM student s

    WHERE s.user_id = p_user_id;



    IF v_s_id IS NULL THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';

    END IF;



    -- Confirm access (user_type = 2 for medical)

    SELECT end_date INTO v_batch_end_date

    FROM batch_time_periods

    WHERE batch_id = p_batch_id AND user_type = '5'

    ORDER BY end_date DESC

    LIMIT 1;



    IF v_batch_end_date IS NULL OR NOW() > v_batch_end_date THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch access expired or not found';

    END IF;



    -- Check eligibility

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



    -- Insert into medical_request

    INSERT INTO medical_request(batch_id, s_id)

    VALUES (p_batch_id, v_s_id);



    SET v_medical_id = LAST_INSERT_ID();



    -- Begin parsing p_subjects_string (comma-separated sub_ids)

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



        -- Validate subject exists for batch

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



        -- Insert into medical_subject

        INSERT INTO medical_subject(medical_id, sub_id)

        VALUES (v_medical_id, v_sub_id);



        IF v_subjects_left = '' THEN

            LEAVE subject_loop;

        END IF;

    END LOOP subject_loop;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertResitApplication` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertResitApplication`(IN `p_user_id` INT, IN `p_batch_id` INT, IN `p_subjects_string` TEXT)
BEGIN

    DECLARE v_s_id INT;

    DECLARE v_batch_end_date TIMESTAMP;

    DECLARE v_accessible BOOLEAN DEFAULT FALSE;

    DECLARE v_resit_id INT;



    -- Variables for splitting

    DECLARE v_subject_entry TEXT;

    DECLARE v_subjects_left TEXT;

    DECLARE v_pos INT;



    DECLARE v_sub_id INT;

    DECLARE v_attempts TEXT;

    DECLARE v_attempt_1 VARCHAR(50);

    DECLARE v_attempt_2 VARCHAR(50);

    DECLARE v_attempt_3 VARCHAR(50);

    DECLARE v_sub_exists INT;



    -- Get student ID

    SELECT s.s_id INTO v_s_id

    FROM student s

    WHERE s.user_id = p_user_id;



    IF v_s_id IS NULL THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found for the user ID';

    END IF;



    -- Confirm access

    SELECT end_date INTO v_batch_end_date

    FROM batch_time_periods

    WHERE batch_id = p_batch_id AND user_type = '5'

    ORDER BY end_date DESC

    LIMIT 1;



    IF v_batch_end_date IS NULL OR NOW() > v_batch_end_date THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch access expired or not found';

    END IF;



    -- Check eligibility

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



    -- Insert into resit_request

    INSERT INTO resit_request(batch_id, s_id)

    VALUES (p_batch_id, v_s_id);



    SET v_resit_id = LAST_INSERT_ID();



    -- Begin parsing p_subjects_string

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



        -- Parse subject entry into sub_id and attempts

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



        -- Insert into resit_subject

        INSERT INTO resit_subject(resit_id, sub_id, attempt_1, attempt_2, attempt_3)

        VALUES (v_resit_id, v_sub_id, v_attempt_1, v_attempt_2, v_attempt_3);



        IF v_subjects_left = '' THEN

            LEAVE subject_loop;

        END IF;

    END LOOP subject_loop;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertStudent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertStudent`(IN `p_user_id` INT, IN `p_s_id` INT)
BEGIN



    INSERT INTO student(user_id,s_id) 



    VALUES (p_user_id, p_s_id);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertStudentDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertStudentDetail`(IN `p_name` VARCHAR(255), IN `p_f_id` INT, IN `p_syl_id` INT, IN `p_status` VARCHAR(255), IN `p_index_num` VARCHAR(50), IN `p_contact_no` VARCHAR(100), OUT `p_s_id` INT)
BEGIN



    INSERT INTO student_detail(name, f_id, syl_id, status, index_num, contact_no) 



    VALUES (p_name, p_f_id, p_syl_id, p_status,p_index_num,p_contact_no);



    SET p_s_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `InsertUser`(IN `p_user_name` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_role_id` INT, OUT `p_user_id` INT)
BEGIN



    INSERT INTO user(user_name, email, password, role_id) 



    VALUES (p_user_name, p_email, p_password, p_role_id);



    SET p_user_id = LAST_INSERT_ID();



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `LinkDegreeWithFaculty` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `LinkDegreeWithFaculty`(IN `p_f_id` INT, IN `p_deg_id` INT)
BEGIN



    INSERT INTO fac_deg(f_id, deg_id)



    VALUES (p_f_id, p_deg_id);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `LinkFacultyDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `LinkFacultyDepartment`(IN `p_f_id` INT, IN `p_d_id` INT)
BEGIN



    INSERT INTO fac_dep(f_id, d_id)



    VALUES (p_f_id, p_d_id);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `LinkGroupWithSyllabus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `LinkGroupWithSyllabus`(IN `p_grp_id` INT, IN `p_syl_id` INT)
BEGIN



    INSERT INTO syl_grp(grp_id, syl_id)



    VALUES (p_grp_id, p_syl_id);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `LinkSubjectWithGroup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `LinkSubjectWithGroup`(IN `p_sub_id` INT, IN `p_grp_id` INT)
BEGIN



    INSERT INTO grp_sub(sub_id, grp_id)



    VALUES (p_sub_id, p_grp_id);



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `LogAdminAction` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `LogAdminAction`(IN `p_description` TEXT)
BEGIN



    INSERT INTO admin_log (description, date_time)



    VALUES (p_description, CURRENT_TIMESTAMP());



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `LogEligibilityChange` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `LogEligibilityChange`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_exam` INT, IN `p_sub_id` INT, IN `p_status_from` VARCHAR(50), IN `p_status_to` VARCHAR(50), IN `p_remark` TEXT)
BEGIN



    INSERT INTO eligibility_log (user_id, s_id, exam, sub_id, status_from, status_to, remark, date_time)



    VALUES (p_user_id, p_s_id, p_exam, p_sub_id, p_status_from, p_status_to, p_remark, CURRENT_TIMESTAMP());



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `LogStudentAction` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `LogStudentAction`(IN `p_user_id` INT, IN `p_exam` INT, IN `p_description` TEXT)
BEGIN



    INSERT INTO students_log (user_id, exam, description, date_time)



    VALUES (p_user_id, p_exam, p_description, CURRENT_TIMESTAMP());



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MoveToMedical` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `MoveToMedical`(IN p_resit_subject_id INT)
BEGIN

    DECLARE v_batch_id INT;

    DECLARE v_s_id INT;

    DECLARE v_sub_id INT;

    DECLARE v_medical_id INT;



    -- Retrieve batch_id, s_id, and sub_id from resit_subject

    SELECT rr.batch_id, rr.s_id, rs.sub_id

    INTO v_batch_id, v_s_id, v_sub_id

    FROM resit_subject rs

    JOIN resit_request rr ON rs.resit_id = rr.resit_id

    WHERE rs.id = p_resit_subject_id;



    -- Check if a medical_request exists for the same batch and student

    SELECT medical_id INTO v_medical_id

    FROM medical_request

    WHERE batch_id = v_batch_id AND s_id = v_s_id

    LIMIT 1;



    -- If not found, insert a new medical_request

    IF v_medical_id IS NULL THEN

        INSERT INTO medical_request (batch_id, s_id, subjects_verified, payment_verified, status)

        VALUES (v_batch_id, v_s_id, 'false', 'false', '');



        SET v_medical_id = LAST_INSERT_ID();

    END IF;



    -- Insert into medical_subject

    INSERT INTO medical_subject (medical_id, sub_id, eligibility)

    VALUES (v_medical_id, v_sub_id, 'true');



    -- Delete the original resit_subject

    DELETE FROM resit_subject WHERE id = p_resit_subject_id;



    -- Update subjects_verified in both request tables

    UPDATE medical_request SET subjects_verified = 'false' WHERE medical_id = v_medical_id;

    UPDATE resit_request SET subjects_verified = 'false' WHERE batch_id = v_batch_id AND s_id = v_s_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MoveToResit` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `MoveToResit`(IN p_medical_subject_id INT)
BEGIN

    DECLARE v_batch_id INT;

    DECLARE v_s_id INT;

    DECLARE v_sub_id INT;

    DECLARE v_resit_id INT;



    -- Retrieve batch_id, s_id, and sub_id from medical_subject

    SELECT mr.batch_id, mr.s_id, ms.sub_id

    INTO v_batch_id, v_s_id, v_sub_id

    FROM medical_subject ms

    JOIN medical_request mr ON ms.medical_id = mr.medical_id

    WHERE ms.id = p_medical_subject_id;



    -- Check if a resit_request exists for the same batch and student

    SELECT resit_id INTO v_resit_id

    FROM resit_request

    WHERE batch_id = v_batch_id AND s_id = v_s_id

    LIMIT 1;



    -- If not found, insert a new resit_request

    IF v_resit_id IS NULL THEN

        INSERT INTO resit_request (batch_id, s_id, subjects_verified, payment_verified, status)

        VALUES (v_batch_id, v_s_id, 'false', 'false', '');



        SET v_resit_id = LAST_INSERT_ID();

    END IF;



	-- Insert into resit_subject

    INSERT INTO resit_subject (resit_id, sub_id, attempt_1, attempt_2, attempt_3, eligibility)

    VALUES (v_resit_id, v_sub_id, 'F', '', '', 'true');



    -- Delete the original medical_subject

    DELETE FROM medical_subject WHERE id = p_medical_subject_id;



    -- Update subjects_verified in both request tables

    UPDATE resit_request SET subjects_verified = 'false' WHERE resit_id = v_resit_id;

    UPDATE medical_request SET subjects_verified = 'false' WHERE batch_id = v_batch_id AND s_id = v_s_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `RejectMedicalResitApplication` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `RejectMedicalResitApplication`(

    IN p_batch_id INT,

    IN p_s_id INT

)
BEGIN

    -- Update resit_request

    UPDATE resit_request

    SET status = 'false'

    WHERE batch_id = p_batch_id AND s_id = p_s_id;



    -- Update medical_request

    UPDATE medical_request

    SET status = 'false'

    WHERE batch_id = p_batch_id AND s_id = p_s_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `RemoveStudentsFromBatch` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `RemoveStudentsFromBatch`(IN `p_batch_id` INT, IN `p_removed_students` TEXT)
BEGIN



    DECLARE drop_query TEXT;







    -- Update student_detail to remove the batch_id for each student



    SET @update_query = CONCAT(



        'UPDATE student_detail SET batch_ids = CASE ',



        'WHEN TRIM(BOTH \',\' FROM REPLACE(CONCAT(\',\', batch_ids, \',\'), CONCAT(\',\', ', p_batch_id, ', \',\'), \',\')) = \'\' THEN \'\' ',



        'ELSE TRIM(BOTH \',\' FROM REPLACE(CONCAT(\',\', batch_ids, \',\'), CONCAT(\',\', ', p_batch_id, ', \',\'), \',\')) ',



        'END WHERE s_id IN (', p_removed_students, ')'



    );







    PREPARE update_stmt FROM @update_query;



    EXECUTE update_stmt;



    DEALLOCATE PREPARE update_stmt;







    -- Delete students from the batch_{batch_id}_students table



    SET drop_query = CONCAT(



        'DELETE FROM batch_', p_batch_id, '_students WHERE s_id IN (', p_removed_students, ')'



    );





    SET @stmt = drop_query;



    PREPARE drop_stmt FROM @stmt;



    EXECUTE drop_stmt;



    DEALLOCATE PREPARE drop_stmt;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `RequestedStudents` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `RequestedStudents`(IN `p_batch_id` INT, IN `p_sub_id` INT)
BEGIN

    -- Return students with pending eligibility in both resit and medical

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SetApproval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `SetApproval`(IN `p_batch_id` INT, IN `p_role_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `StoreResetToken` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `StoreResetToken`(IN `p_user_id` INT, IN `p_hashed_token` TEXT, IN `p_expiration` TIMESTAMP)
BEGIN



    UPDATE user



    SET reset_token = p_hashed_token,



        token_expiration = p_expiration



    WHERE user_id = p_user_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateAdmissionData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateAdmissionData`(IN `p_batch_id` INT, IN `p_generated_date` VARCHAR(250), IN `p_subject_list` VARCHAR(250), IN `p_exam_date` VARCHAR(250), IN `p_exam_held_date` VARCHAR(250), IN `p_description` TEXT, IN `p_instructions` TEXT, IN `p_provider` TEXT)
BEGIN



    -- Check if the batch_id already exists in the admission table



    IF EXISTS (SELECT 1 FROM admission WHERE batch_id = p_batch_id) THEN



        -- Update existing row



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



        -- Insert new row



        INSERT INTO admission (batch_id, generated_date, subject_list, exam_date, exam_held_date, description, instructions, provider)



        VALUES (p_batch_id, p_generated_date, p_subject_list, p_exam_date, p_exam_held_date, p_description, p_instructions, p_provider);



    END IF;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateAttendanceData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateAttendanceData`(IN `p_batch_id` INT, IN `p_exam_date` VARCHAR(250), IN `p_exam_held_date` VARCHAR(250), IN `p_description` TEXT, IN `p_no_of_groups` INT, IN `p_venues` TEXT, IN `p_dates` VARCHAR(250), IN `p_times` VARCHAR(250), IN `p_student_detail` TEXT, IN `p_sub_id` INT)
BEGIN

	DECLARE p_attendance_id INT(11);



    -- Check if the batch_id already exists in the attendance table



    IF EXISTS (SELECT 1 FROM attendance WHERE batch_id = p_batch_id) THEN



        -- Update existing row



UPDATE attendance



        SET 



            exam_date = p_exam_date,

            exam_held_date=p_exam_held_date,



            description = p_description

            

        WHERE batch_id = p_batch_id;



    ELSE



        -- Insert new row



        INSERT INTO attendance (batch_id, exam_date, exam_held_date, description)



        VALUES (p_batch_id, p_exam_date,p_exam_held_date, p_description);



    END IF;

    

    select id into p_attendance_id from attendance where batch_id=p_batch_id;

    

     IF EXISTS (SELECT 1 FROM attendance_subject WHERE attendance_id = p_attendance_id) THEN



        -- Update existing row



UPDATE attendance_subject



        SET 

        no_of_groups=p_no_of_groups,



            venues = p_venues,



            dates = p_dates,



            times = p_times,

            

            student_detail = p_student_detail



        WHERE attendance_id = p_attendance_id;



    ELSE



        -- Insert new row



        INSERT INTO attendance_subject (attendance_id, sub_id, venues, dates, times, student_detail,no_of_groups)



        VALUES (p_attendance_id, p_sub_id, p_venues, p_dates, p_times, p_student_detail,p_no_of_groups);



    END IF;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateBatchDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateBatchDetails`(IN `p_batch_id` INT, IN `p_batch_code` VARCHAR(100), IN `p_description` VARCHAR(500), IN `p_deg_id` INT, IN `p_syl_id` INT, IN `p_application_open` TIMESTAMP, IN `p_academic_year` VARCHAR(50), IN `p_level` INT(11), IN `p_sem_no` INT(11), IN `p_payment_end` TIMESTAMP, IN `p_grp_id` INT, IN `p_admin_end` TIMESTAMP)
BEGIN



    UPDATE batch



    SET batch_code = p_batch_code, description = p_description, deg_id = p_deg_id, syl_id = p_syl_id, application_open = p_application_open, payment_end = p_payment_end, academic_year= p_academic_year, level = p_level, sem = p_sem_no, grp_id=p_grp_id, admin_end=p_admin_end



    WHERE batch_id = p_batch_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateBatchStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateBatchStatus`(IN `p_batch_id` INT, IN `p_status` VARCHAR(50))
BEGIN



    UPDATE batch



    SET status = p_status



    WHERE batch_id = p_batch_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateDegreeDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateDegreeDetails`(IN `p_deg_id` INT, IN `p_deg_name` VARCHAR(255), IN `p_short` VARCHAR(50), IN `p_levels` VARCHAR(255), IN `p_no_of_sem_per_year` VARCHAR(10))
BEGIN



    UPDATE degree



    SET deg_name = p_deg_name,



        short = p_short,



        levels = p_levels,



        no_of_sem_per_year = p_no_of_sem_per_year



    WHERE deg_id = p_deg_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateDegreeStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateDegreeStatus`(IN `p_deg_id` INT, IN `p_status` VARCHAR(50))
BEGIN



    UPDATE degree



    SET 



        status = p_status



    WHERE deg_id = p_deg_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateDepartmentDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateDepartmentDetails`(IN `p_d_id` INT, IN `p_d_name` VARCHAR(255), IN `p_contact_no` VARCHAR(50))
BEGIN



    UPDATE department



    SET d_name = p_d_name,



        contact_no = p_contact_no



    WHERE d_id = p_d_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateDepartmentStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateDepartmentStatus`(IN `p_d_id` INT, IN `p_status` VARCHAR(50))
BEGIN



    UPDATE department



    SET 



        status = p_status



    WHERE d_id = p_d_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateDepartmentUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateDepartmentUser`(IN `p_user_id` INT, IN `p_email` VARCHAR(255))
BEGIN



    UPDATE user



    SET user_name = p_email,



        email = p_email



    WHERE user_id = p_user_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateEligibility` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateEligibility`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_sub_id` INT, IN `p_batch_id` INT, IN `p_eligibility` VARCHAR(50), IN `p_role_id` VARCHAR(50))
BEGIN

    DECLARE p_l_id INT;

    DECLARE batch_status VARCHAR(50);



    -- Step 1: Check batch status

    SELECT status INTO batch_status

    FROM batch

    WHERE batch_id = p_batch_id;



    IF batch_status != 'true' THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';

    END IF;



    -- Step 2: Verify user access

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



    -- Step 3: Update eligibility

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateFacDeg` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateFacDeg`(IN `p_f_id` INT, IN `p_deg_id` INT)
BEGIN



    UPDATE fac_deg



    SET f_id = p_f_id



    WHERE deg_id = p_deg_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateFacultyDepartmentLink` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateFacultyDepartmentLink`(IN `p_f_id` INT, IN `p_d_id` INT)
BEGIN



    UPDATE fac_dep



    SET f_id = p_f_id



    WHERE d_id = p_d_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateFacultyDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateFacultyDetails`(IN `p_f_id` INT, IN `p_f_name` VARCHAR(255), IN `p_contact_no` VARCHAR(50))
BEGIN



    UPDATE faculty



    SET f_name = p_f_name,



        contact_no = p_contact_no



    WHERE f_id = p_f_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateFacultyStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateFacultyStatus`(IN `p_f_id` INT, IN `p_status` VARCHAR(50))
BEGIN



    UPDATE faculty



    SET 



        status = p_status



    WHERE f_id = p_f_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateGroup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateGroup`(IN `p_grp_id` INT, IN `p_grp_code` VARCHAR(250), IN `p_level` INT, IN `p_sem_no` INT, IN `p_custom_suffix` VARCHAR(250), IN `p_course_title` VARCHAR(500))
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateGroupStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateGroupStatus`(IN `p_grp_id` INT, IN `p_status` VARCHAR(50))
BEGIN



    UPDATE grp



    SET 



        status = p_status



    WHERE grp_id = p_grp_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateLecturer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateLecturer`(IN `p_name` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_user_name` VARCHAR(255), IN `p_contact_no` VARCHAR(50), IN `p_l_id` INT)
BEGIN



    -- Check if email or user_name already exists for another user



    IF EXISTS (



        SELECT 1 FROM user u



        INNER JOIN lecturer l ON u.user_id = l.user_id



        WHERE (u.email = p_email OR u.user_name = p_user_name) AND l.l_id != p_l_id



    ) THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email or username already exists';



    END IF;







    -- Update lecturer detail



    UPDATE lecturer_detail 



    SET 



        name = p_name, 



        contact_no = p_contact_no



    WHERE l_id = p_l_id;







    -- Update user email and username



    UPDATE user u 



    INNER JOIN lecturer l ON u.user_id = l.user_id 



    SET 



        u.email = p_email,



        u.user_name = p_user_name



    WHERE l.l_id = p_l_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateLecturerStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateLecturerStatus`(IN `p_status` VARCHAR(50), IN `p_l_id` INT)
BEGIN



    -- Update lecturer detail



    UPDATE lecturer_detail 



    SET 



        status = p_status 



    WHERE l_id = p_l_id;







END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateMedicalEligibility` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateMedicalEligibility`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_sub_id` INT, IN `p_batch_id` INT, IN `p_eligibility` VARCHAR(50), IN `p_role_id` VARCHAR(50))
BEGIN

    DECLARE p_l_id INT;

    DECLARE batch_status VARCHAR(50);



    -- Step 1: Check batch status

    SELECT status INTO batch_status

    FROM batch

    WHERE batch_id = p_batch_id;



    IF batch_status != 'true' THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';

    END IF;



    -- Step 2: Verify user access

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



    -- Step 3: Update eligibility

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateMedicalPaymentVerified` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateMedicalPaymentVerified`(

    IN p_medical_id INT,

    IN p_verified VARCHAR(50)

)
BEGIN

    UPDATE medical_request

    SET payment_verified = p_verified

    WHERE medical_id = p_medical_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateMedicalReference` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateMedicalReference`(

    IN p_medical_id INT,

    IN p_reference VARCHAR(500)

)
BEGIN

    UPDATE medical_request

    SET reference = p_reference

    WHERE medical_id = p_medical_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateMedicalSubjectsVerified` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateMedicalSubjectsVerified`(

    IN p_medical_id INT,

    IN p_verified VARCHAR(50)

)
BEGIN

    UPDATE medical_request

    SET subjects_verified = p_verified

    WHERE medical_id = p_medical_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateRequestReference` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateRequestReference`(

    IN in_user_id INT,

    IN in_batch_id INT,

    IN in_type VARCHAR(50),

    IN in_reference TEXT

)
BEGIN

    DECLARE student_id INT;



    -- Get s_id from student table

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateResitEligibility` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateResitEligibility`(IN `p_user_id` INT, IN `p_s_id` INT, IN `p_sub_id` INT, IN `p_batch_id` INT, IN `p_eligibility` VARCHAR(50), IN `p_role_id` VARCHAR(50))
BEGIN

    DECLARE p_l_id INT;

    DECLARE batch_status VARCHAR(50);



    -- Step 1: Check batch status

    SELECT status INTO batch_status

    FROM batch

    WHERE batch_id = p_batch_id;



    IF batch_status != 'true' THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batch is not active.';

    END IF;



    -- Step 2: Verify user access

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



    -- Step 3: Update eligibility

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateResitPaymentVerified` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateResitPaymentVerified`(

    IN p_resit_id INT,

    IN p_verified VARCHAR(50)

)
BEGIN

    UPDATE resit_request

    SET payment_verified = p_verified

    WHERE resit_id = p_resit_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateResitReference` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateResitReference`(

    IN p_resit_id INT,

    IN p_reference VARCHAR(500)

)
BEGIN

    UPDATE resit_request

    SET reference = p_reference

    WHERE resit_id = p_resit_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateResitSubjectsVerified` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateResitSubjectsVerified`(

    IN p_resit_id INT,

    IN p_verified VARCHAR(50)

)
BEGIN

    UPDATE resit_request

    SET subjects_verified = p_verified

    WHERE resit_id = p_resit_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateStudent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateStudent`(IN `p_name` VARCHAR(255), IN `p_f_id` INT, IN `p_s_id` INT, IN `p_email` VARCHAR(255), IN `p_user_name` VARCHAR(255), IN `p_contact_no` VARCHAR(100), IN `p_index_num` VARCHAR(50))
BEGIN



    DECLARE exit handler FOR SQLEXCEPTION



    BEGIN



        -- Rollback the transaction if any error occurs



        ROLLBACK;



        SIGNAL SQLSTATE '45000' 



        SET MESSAGE_TEXT = 'An unexpected error occurred';



    END;







    -- Start a transaction



    START TRANSACTION;







    -- Check if email or user_name already exists for another user



    IF EXISTS (



        SELECT 1 



        FROM user u



        INNER JOIN student s ON u.user_id = s.user_id



        WHERE (u.email = p_email OR u.user_name = p_user_name) AND s.s_id != p_s_id



    ) THEN



        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email or username already exists';



    END IF;



    



    -- Check if index number already exists for another user



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







    -- Update student detail



    UPDATE student_detail 



    SET 



        name = p_name, 



        f_id = p_f_id,



        contact_no = p_contact_no,



        index_num = p_index_num



    WHERE s_id = p_s_id;







    -- Update user email and username



    UPDATE user u 



    INNER JOIN student s ON u.user_id = s.user_id 



    SET 



        u.email = p_email,



        u.user_name = p_user_name



    WHERE s.s_id = p_s_id;







    -- Commit the transaction



    COMMIT;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateStudentBatchIds` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateStudentBatchIds`(IN `p_batch_id` INT, IN `p_s_id` INT)
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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateStudentStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateStudentStatus`(IN `p_status` VARCHAR(50), IN `p_s_id` INT)
BEGIN



    -- Update student detail



    UPDATE student_detail 



    SET 



        status = p_status 



    WHERE s_id = p_s_id;







END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateSubject` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateSubject`(IN `p_sub_id` INT, IN `p_sub_code` VARCHAR(100), IN `p_sub_name` VARCHAR(150), IN `p_sem_no` INT, IN `p_syl_id` INT, IN `p_d_id` INT, IN `p_level` INT, IN `p_pass_grade` INT)
BEGIN



    UPDATE subject



    SET 



        sub_code = p_sub_code,



        sub_name = p_sub_name,



        sem_no = p_sem_no,



        syl_id = p_syl_id,

        

        pass_grade = p_pass_grade,

        

        level = p_level



    WHERE sub_id = p_sub_id;

    

    update dep_sub

    

    SET

    

    	d_id = p_d_id

        

    WHERE sub_id = p_sub_id;   

    

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateSubjectStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateSubjectStatus`(IN `p_sub_id` INT, IN `p_status` VARCHAR(50))
BEGIN



    UPDATE subject



    SET 



        status = p_status



    WHERE sub_id = p_sub_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateSylGrp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateSylGrp`(IN `p_syl_id` INT, IN `p_grp_id` INT)
BEGIN



    UPDATE syl_grp



    SET syl_id = p_syl_id



    WHERE grp_id = p_grp_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateSyllabus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateSyllabus`(IN `p_deg_id` INT, IN `p_commenced_year` YEAR, IN `p_expired_year` YEAR, IN `p_syl_id` INT)
BEGIN



    -- Update the syllabus table (excluding deg_id)

    UPDATE syllabus

    SET 

        commenced_year = p_commenced_year,

        expired_year = p_expired_year

    WHERE syl_id = p_syl_id;



    -- Update the deg_syl junction table

    UPDATE deg_syl

    SET 

        deg_id = p_deg_id

    WHERE syl_id = p_syl_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateSyllabusStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `updateSyllabusStatus`(IN `p_syl_id` INT, IN `p_status` VARCHAR(50))
BEGIN



    UPDATE syllabus



    SET 



        status = p_status



    WHERE syl_id = p_syl_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateUserDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateUserDetails`(IN `p_user_id` INT, IN `p_email` VARCHAR(255))
BEGIN



    UPDATE user



    SET user_name = p_email,



        email = p_email



    WHERE user_id = p_user_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateUserPassword` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateUserPassword`(IN `p_user_id` INT, IN `p_hashed_password` TEXT)
BEGIN



    UPDATE user



    SET password = p_hashed_password,



        reset_token = NULL,



        token_expiration = NULL



    WHERE user_id = p_user_id;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateVenue` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `UpdateVenue`(

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
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpsertPayment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpsertPayment`(IN `p_type` VARCHAR(250), IN `p_amount` DECIMAL(18,2))
BEGIN

	INSERT INTO payment (type, amount)
VALUES (p_type, p_amount)
ON DUPLICATE KEY UPDATE
  amount = VALUES(amount);

END$$
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpsertInstruction` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER $$
CREATE PROCEDURE `UpsertInstruction`(IN `p_type` VARCHAR(250), IN `p_instruction` TEXT)
BEGIN

	INSERT INTO instruction (type, instruction)
VALUES (p_type, p_instruction)
ON DUPLICATE KEY UPDATE
  instruction = VALUES(instruction);

END$$
DELIMITER ;

/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 19:09:00
