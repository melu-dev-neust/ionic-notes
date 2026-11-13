-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2026 at 08:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ionic_notes`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_tokens`
--

CREATE TABLE `auth_tokens` (
  `token_hash` char(64) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_tokens`
--

INSERT INTO `auth_tokens` (`token_hash`, `user_id`, `created_at`, `expires_at`) VALUES
('e99169c762fbb1a43547fbf0d264ead97b7bad04f2303d19d34dc3f83a38b989', 3, '2026-11-12 15:09:13', '2026-12-12 23:09:13');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `user_id`, `category_name`) VALUES
(4, 3, 'Capstone'),
(3, 3, 'Grocery'),
(2, 3, 'Projects'),
(1, 3, 'School');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `note_title` varchar(255) NOT NULL,
  `note_content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`note_id`, `user_id`, `category_id`, `note_title`, `note_content`, `created_at`) VALUES
(6, 3, 4, 'Project Proposal', 'Prepare the initial project proposal and outline the main objectives.', '2026-11-12 14:40:00'),
(7, 3, 4, 'Meeting Notes', 'Discuss project requirements, deadlines, and task assignments.', '2026-11-12 14:40:00'),
(8, 3, NULL, 'Study Schedule', 'Review database management, Angular, PHP, and software engineering.', '2026-11-12 14:40:00'),
(9, 3, NULL, 'Shopping List', 'Buy notebooks, pens, headphones, and other school supplies.', '2026-11-12 14:40:00'),
(10, 3, NULL, 'Personal Goals', 'Improve programming skills and complete pending academic projects.', '2026-11-12 14:40:00'),
(11, 4, NULL, 'Web Development Tips', 'Always write reusable code, follow MVC principles, and maintain clean project structures.', '2026-11-12 14:40:00'),
(12, 4, NULL, 'Database Design Guide', 'Use primary keys, foreign keys, appropriate data types, and database normalization.', '2026-11-12 14:40:00'),
(13, 4, NULL, 'Programming Resources', 'Explore documentation, GitHub repositories, and online programming tutorials.', '2026-11-12 14:40:00'),
(14, 3, NULL, 'try notes', 'note content', '2026-11-12 15:09:24');

-- --------------------------------------------------------

--
-- Table structure for table `shared_notes`
--

CREATE TABLE `shared_notes` (
  `sharedNote_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `received_from_id` int(11) DEFAULT NULL,
  `source_note_id` int(11) DEFAULT NULL,
  `sharedNote_title` varchar(255) NOT NULL,
  `sharedNote_content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shared_notes`
--

INSERT INTO `shared_notes` (`sharedNote_id`, `user_id`, `received_from_id`, `source_note_id`, `sharedNote_title`, `sharedNote_content`, `created_at`) VALUES
(1, 3, 4, 11, 'Web Development Tips', 'Always write reusable code, follow MVC principles, and maintain clean project structures.', '2026-11-12 14:41:34'),
(2, 3, 4, 12, 'Database Design Guide', 'Use primary keys, foreign keys, appropriate data types, and database normalization.', '2026-11-12 14:41:34'),
(3, 3, 4, 13, 'Programming Resources', 'Explore documentation, GitHub repositories, and online programming tutorials.', '2026-11-12 14:41:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`) VALUES
(3, 'user_1', 'user1@gmail.com', '$2y$10$RBdDM2lDGCaxq1govD.W1.WAuWcaIg9Nv923V7Bv.nITXjlifn2IG'),
(4, 'user_2', 'user2@gmail.com', '$2y$10$y/2t3U6R9hiPr9D4SMy68.gWYf.fsffEDtvK35ZiGc64P7OLaCF6y');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD PRIMARY KEY (`token_hash`),
  ADD KEY `fk_auth_tokens_user` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`category_name`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`note_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `shared_notes`
--
ALTER TABLE `shared_notes`
  ADD PRIMARY KEY (`sharedNote_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `received_from_id` (`received_from_id`),
  ADD KEY `fk_shared_notes_source_note` (`source_note_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `shared_notes`
--
ALTER TABLE `shared_notes`
  MODIFY `sharedNote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD CONSTRAINT `fk_auth_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `shared_notes`
--
ALTER TABLE `shared_notes`
  ADD CONSTRAINT `fk_shared_notes_source_note` FOREIGN KEY (`source_note_id`) REFERENCES `notes` (`note_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `shared_notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shared_notes_ibfk_2` FOREIGN KEY (`received_from_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `shared_notes_ibfk_3` FOREIGN KEY (`source_note_id`) REFERENCES `notes` (`note_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
