-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2024 at 12:01 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employeetest`
--
CREATE DATABASE IF NOT EXISTS `employeetest` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `employeetest`;

-- --------------------------------------------------------

--
-- Table structure for table `details`
--

CREATE TABLE `details` (
  `detail_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `turn_id` int(11) NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT 'U'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
-- to use need to mockup this data

CREATE TABLE `employees` (
  `emp_id` int(11) NOT NULL,
  `emp_name` varchar(100) NOT NULL DEFAULT 'tmp',
  `empID` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'tmp',
  `contain_date` date DEFAULT NULL,
  `emp_type` varchar(20) NOT NULL DEFAULT 'tmp',
  `emp_level` varchar(5) NOT NULL DEFAULT 'tmp',
  `duty` varchar(20) NOT NULL DEFAULT 'tmp',
  `affiliation` varchar(60) DEFAULT 'tmp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'tmp'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `indicators`
--

CREATE TABLE `indicators` (
  `idt_id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'tmp',
  `type_access` varchar(125) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'tmp',
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `indicators`
--

INSERT INTO `indicators` (`idt_id`, `title`, `type_access`, `group_id`) VALUES
(1, 'ເຊື່ອມຊຶມ ແລະ ເຊື່ອໝັ້ນ ຕໍ່ກັບອຸດົມການຂອງພັກ, ຫຼັກໝັ້ນມິດສັດຕູ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(2, 'ຮູ້ແນວທາງນະໂຍບາຍ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(3, 'ຮັບຜິດຊອບວຽກງານທີ່ໄດ້ຮັບມອບໝາຍ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(4, 'ເຊື່ອໝັ້ນຕໍ່ກໍາລັງແຮງ ຂອງມະຫາຊົນ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(5, 'ເຄົາລົບ, ປະຕິບັດ ກົດໝາຍ ແລະ ລະບຽບການຂອງລັດ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(6, 'ເສຍສະຫຼະເພື່ອສ່ວນລວມ ແລະ ການຈັດຕັ້ງ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(7, 'ດຸໝັ່ນ, ພາກພຽນ, ສັດຊື່, ປະຢັດ, ປອດໃສ ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(8, 'ມີລະບຽບວິໄນ ແລະ ເຄົາລົບການຈັດຕັ້ງ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(9, 'ມີນໍ້າໃຈຮັກຊາດ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(10, 'ສຸພາບຮຽບຮ້ອຍ, ເຮັດແທ້ທໍາຈິງ ຮຽນຮູ້ພັດທະນາຕົນເອງ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 1),
(11, 'ພາວະຄວາມເປັນຜູ້ນໍາ', 'ບໍລິຫານ', 2),
(12, 'ການແກ້ໄຂບັນຫາ ແລະ ການ ຕັດສິນໃຈ', 'ບໍລິຫານ', 2),
(13, 'ວິໄສທັດໃນວຽກງານ ເພື່ອການ ກໍານົດຍຸດທະສາດ', 'ບໍລິຫານ', 2),
(14, 'ການບໍລິຫານການປ່ຽນແປງ ເພື່ອພັດທະນາການຈັດຕັ້ງຕົນ', 'ບໍລິຫານ', 2),
(15, 'ຄວາມຫ້າວຫັນໃນການປະຕິບັດ ໜ້າທີ່ວຽກງານ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 2),
(16, 'ຄວາມຄິດລິເລີ່ມ ແລະ ຫົວຄິດ ປະດິດສ້າງ ໃນການເຮັດວຽກ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 2),
(17, 'ການເຮັດວຽກເປັນໝູ່ຄະນະ', 'ບໍລິຫານ,ວິຊາການ', 2),
(18, 'ຈັນຍາບັນ', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 2),
(19, 'ການນໍາໃຊ້ເຄື່ອງມືແລະ ເທັກໂນໂລຊ', 'ບໍລິຫານ,ວິຊາການ', 2),
(20, 'ການໃຫ້ບໍລິການ', 'ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 2),
(21, 'ການພົວພັນປະສານງານ', 'ຊ່ວຍວຽກບໍລິຫານ', 2),
(22, 'ການນໍາໃຊ້ເຄື່ອງມືວິຊາຊີບ ໃນການປະຕິບັດໜ້າທີ່ວຽກງານ', 'ຊ່ວຍວຽກບໍລິຫານ', 2),
(23, 'ດ້ານການນໍານົດນະໂຍບາຍ', 'ບໍລິຫານ', 3),
(24, 'ດ້ານການບໍລິຫານວຽກງານ', 'ບໍລິຫານ', 3),
(25, 'ດ້ານການຄຸ້ມຄອງພະນັກງານ', 'ບໍລິຫານ', 3),
(26, 'ດ້ານການຄຸ້ມຄອງງົບປະມານ', 'ບໍລິຫານ', 3),
(27, 'ຄວາມສາມາດໃນການປະຕິບັດ', 'ວິຊາການ', 3),
(28, 'ດ້ານການປະສານງານ', 'ວິຊາການ', 3),
(29, 'ດ້ານການບໍລິການ', 'ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 3),
(30, 'ດ້ານການປະຕິບັດຕາມແຜນການ ແລະ ການມອບໝາຍ', 'ຊ່ວຍວຽກບໍລິຫານ', 3),
(31, 'kkgg', 'ບໍລິຫານ,ວິຊາການ,ຊ່ວຍວຽກບໍລິຫານ', 4);

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `scr_id` int(11) NOT NULL,
  `score` varchar(255) NOT NULL DEFAULT '[]',
  `emp_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `turn_id` int(11) NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT 'U'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `score_levels`
--

CREATE TABLE `score_levels` (
  `sl_id` int(11) NOT NULL,
  `emp_type` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'tmp',
  `scr_g1` varchar(5) NOT NULL DEFAULT 'tmp',
  `scr_g2` varchar(5) NOT NULL DEFAULT 'tmp',
  `scr_g3` varchar(5) NOT NULL DEFAULT 'tmp'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `score_levels`
--

INSERT INTO `score_levels` (`sl_id`, `emp_type`, `scr_g1`, `scr_g2`, `scr_g3`) VALUES
(1, 'ບໍລິຫານລະດັບສູງ', '30%', '30%', '40%'),
(2, 'ບໍລິຫານລະດັບກາງ', '25%', '30%', '45%'),
(3, 'ບໍລິຫານລະດັບຕົ້ນ', '20%', '25%', '55%'),
(4, 'ລັດຖະກອນວິຊາການ', '15%', '25%', '60%'),
(5, 'ລັດຖະກອນຊ່ວຍວຽກບໍລິຫານ', '10%', '20%', '70%');

-- --------------------------------------------------------

--
-- Table structure for table `score_types`
--

CREATE TABLE `score_types` (
  `st_id` int(11) NOT NULL,
  `s_range` varchar(15) NOT NULL DEFAULT 'tmp',
  `s_type` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'tmp'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `score_types`
--

INSERT INTO `score_types` (`st_id`, `s_range`, `s_type`) VALUES
(1, '9.00,10', 'ດີຫຼາຍ'),
(2, '8.00,8.99', 'ດີ'),
(3, '5.00,7.99', 'ກາງ'),
(4, '3.00,4.99', 'ອ່ອນ'),
(5, '1.00,2.99', 'ອ່ອນຫຼາຍ');

-- --------------------------------------------------------

--
-- Table structure for table `turns`
--

CREATE TABLE `turns` (
  `turn_id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'tmp',
  `idt_ids` varchar(255) NOT NULL DEFAULT '[]',
  `st_id` varchar(255) NOT NULL,
  `sl_id` varchar(255) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_email` varchar(100) NOT NULL DEFAULT 'tmp',
  `user_password` varchar(255) NOT NULL DEFAULT 'tmp',
  `access` varchar(1) NOT NULL DEFAULT '0',
  `emp_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `details`
--
ALTER TABLE `details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `turn_id` (`turn_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `indicators`
--
ALTER TABLE `indicators`
  ADD PRIMARY KEY (`idt_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`scr_id`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `turn_id` (`turn_id`),
  ADD KEY `traget_id` (`target_id`);

--
-- Indexes for table `score_levels`
--
ALTER TABLE `score_levels`
  ADD PRIMARY KEY (`sl_id`);

--
-- Indexes for table `score_types`
--
ALTER TABLE `score_types`
  ADD PRIMARY KEY (`st_id`);

--
-- Indexes for table `turns`
--
ALTER TABLE `turns`
  ADD PRIMARY KEY (`turn_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `details`
--
ALTER TABLE `details`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `indicators`
--
ALTER TABLE `indicators`
  MODIFY `idt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `scr_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `score_levels`
--
ALTER TABLE `score_levels`
  MODIFY `sl_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `score_types`
--
ALTER TABLE `score_types`
  MODIFY `st_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `turns`
--
ALTER TABLE `turns`
  MODIFY `turn_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `details`
--
ALTER TABLE `details`
  ADD CONSTRAINT `details_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`),
  ADD CONSTRAINT `details_ibfk_2` FOREIGN KEY (`turn_id`) REFERENCES `turns` (`turn_id`);

--
-- Constraints for table `indicators`
--
ALTER TABLE `indicators`
  ADD CONSTRAINT `indicators_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`);

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`),
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`target_id`) REFERENCES `employees` (`emp_id`),
  ADD CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`turn_id`) REFERENCES `turns` (`turn_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
