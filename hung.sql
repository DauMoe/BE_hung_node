-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2021 at 08:15 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.2.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hung`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `eventID` int(6) NOT NULL,
  `comment` text DEFAULT NULL,
  `managerID` int(6) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`eventID`, `comment`, `managerID`, `timestamp`) VALUES
(24, 'fddfgdfg', 72, '2021-10-20 17:20:31'),
(26, 'asdasd', 72, '2021-10-21 00:02:03'),
(27, 'hi', 79, '2021-10-21 23:33:42'),
(28, 'gggv', 79, '2021-10-21 23:40:53'),
(29, 'gggv', 79, '2021-10-21 23:40:59'),
(30, 'bhnn', 79, '2021-10-21 23:58:07'),
(31, 'bhnn', 79, '2021-10-21 23:58:30'),
(32, 'bhnn', 79, '2021-10-21 23:59:05'),
(33, 'sd', 79, '2021-10-22 00:17:06'),
(34, 'sd', 79, '2021-10-22 00:17:18'),
(35, 'Ok ddaay', 79, '2021-10-22 00:27:11'),
(36, 'Ok ddaay', 79, '2021-10-22 00:28:03'),
(37, 'Ok ddaay', 79, '2021-10-22 00:28:17');

-- --------------------------------------------------------

--
-- Table structure for table `manager_topic`
--

CREATE TABLE `manager_topic` (
  `managerID` int(4) NOT NULL,
  `teacherID` int(4) NOT NULL,
  `studentID` int(4) NOT NULL,
  `topicID` int(4) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `status` varchar(10) NOT NULL,
  `doc_link` text NOT NULL,
  `deadline` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `manager_topic`
--

INSERT INTO `manager_topic` (`managerID`, `teacherID`, `studentID`, `topicID`, `timestamp`, `status`, `doc_link`, `deadline`) VALUES
(72, 10, 10, 15, '2021-10-20 17:02:55', 'PENDING', 'fdsfsd', '2021-10-29'),
(79, 10, 12, 14, '2021-10-20 17:02:55', 'ON', 'http://doc.google.com/Anfs3rnA9', '2021-10-30');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `postID` int(4) NOT NULL,
  `post_title` text NOT NULL,
  `post_content` longtext NOT NULL,
  `post_thum` text NOT NULL,
  `create_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`postID`, `post_title`, `post_content`, `post_thum`, `create_time`) VALUES
(7, 'test', 'adasd', 'picture/1634577071353', '2021-10-19 00:11:11'),
(8, 'test', 'adasd', 'picture/1634725359642', '2021-10-20 17:22:39'),
(9, 'test', 'adasd', 'picture/1634725420024', '2021-10-20 17:23:40'),
(10, 'test', 'adasd', 'picture/1634725445811', '2021-10-20 17:24:05'),
(11, 'test', 'adasd', 'picture/1634725459127', '2021-10-20 17:24:19'),
(12, 'Test Post', 'test post', 'picture/1634725511920', '2021-10-20 17:25:11');

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE `rating` (
  `ratingID` int(4) NOT NULL,
  `managerID` int(4) NOT NULL,
  `timetamp` datetime NOT NULL DEFAULT current_timestamp(),
  `comment` text NOT NULL,
  `rating` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `topicID` int(4) NOT NULL,
  `authorID` int(4) NOT NULL,
  `topic_name` varchar(255) NOT NULL,
  `topic_desc` text NOT NULL,
  `topic_images` text DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`topicID`, `authorID`, `topic_name`, `topic_desc`, `topic_images`, `status`, `create_time`) VALUES
(13, 10, 'moe', 'nothing', 'picture/1634573847197', 'ON', '2021-10-18 23:17:27'),
(14, 10, 'topic2', 'test topic2', 'picture/1634654647089', 'ON', '2021-10-19 21:44:07'),
(15, 10, 'topic3', 'test topic3', 'picture/1634654657132', 'ON', '2021-10-19 21:44:17'),
(16, 10, 'Test topic', 'Topic for test', 'picture/1634725590681', 'ON', '2021-10-20 17:26:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(4) NOT NULL,
  `email` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `ava_url` text DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `about` text DEFAULT NULL,
  `roles` varchar(10) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `one` int(5) NOT NULL DEFAULT 0,
  `two` int(5) NOT NULL DEFAULT 0,
  `three` int(5) NOT NULL DEFAULT 0,
  `four` int(5) NOT NULL DEFAULT 0,
  `five` int(5) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `email`, `code`, `password`, `ava_url`, `dob`, `address`, `about`, `roles`, `gender`, `one`, `two`, `three`, `four`, `five`) VALUES
(10, 'a', 'STU3912@kma.edu.vn', '123', NULL, NULL, NULL, NULL, 'TEACHER', NULL, 0, 0, 0, 0, 0),
(11, 'teacher1', 'TEACHER342@kma.edu.vn', '123', NULL, NULL, NULL, NULL, 'TEACHER', NULL, 0, 0, 0, 0, 0),
(12, 'user2', 'STU24@kma.edu.vn', '123', NULL, NULL, NULL, NULL, 'STUDENT', NULL, 0, 0, 0, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eventID`),
  ADD KEY `fo_managerID` (`managerID`);

--
-- Indexes for table `manager_topic`
--
ALTER TABLE `manager_topic`
  ADD PRIMARY KEY (`managerID`),
  ADD UNIQUE KEY `studentID` (`studentID`),
  ADD UNIQUE KEY `topicID` (`topicID`),
  ADD KEY `teaccher_mana_topic` (`teacherID`),
  ADD KEY `mana_topicid` (`topicID`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postID`);

--
-- Indexes for table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`ratingID`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`topicID`),
  ADD KEY `author_topic` (`authorID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `eventID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `manager_topic`
--
ALTER TABLE `manager_topic`
  MODIFY `managerID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `postID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `rating`
--
ALTER TABLE `rating`
  MODIFY `ratingID` int(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `topicID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fo_managerID` FOREIGN KEY (`managerID`) REFERENCES `manager_topic` (`managerID`) ON DELETE CASCADE,
  ADD CONSTRAINT `managerID_fo` FOREIGN KEY (`managerID`) REFERENCES `manager_topic` (`managerID`);

--
-- Constraints for table `manager_topic`
--
ALTER TABLE `manager_topic`
  ADD CONSTRAINT `mana_topicid` FOREIGN KEY (`topicID`) REFERENCES `topics` (`topicID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `student_mana_topic` FOREIGN KEY (`studentID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `teaccher_mana_topic` FOREIGN KEY (`teacherID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `author_topic` FOREIGN KEY (`authorID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
