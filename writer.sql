-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2024 at 09:07 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `writer`
--

-- --------------------------------------------------------

--
-- Table structure for table `counters`
--

CREATE TABLE `counters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `seq` int(11) DEFAULT 100000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `counters`
--

INSERT INTO `counters` (`id`, `name`, `seq`) VALUES
(1, 'orderId', 100001);

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `feedbackText` text NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `createdAt` datetime DEFAULT current_timestamp(),
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `orderId`, `feedbackText`, `rating`, `createdAt`, `userId`) VALUES
(1, 'dd', 'dd', 5, '2024-08-24 20:06:34', 1),
(2, 'dd', 'csdc', 5, '2024-08-25 19:43:23', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `serviceType` varchar(255) DEFAULT NULL,
  `paperType` varchar(255) DEFAULT NULL,
  `subjectArea` varchar(255) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `paperDetails` text DEFAULT NULL,
  `paperFormat` varchar(255) DEFAULT NULL,
  `referenceCount` int(11) DEFAULT NULL,
  `academicLevel` varchar(255) DEFAULT NULL,
  `pageCount` int(11) DEFAULT NULL,
  `spacing` varchar(255) DEFAULT NULL,
  `urgency` varchar(255) DEFAULT NULL,
  `additionalInstructions` text DEFAULT NULL,
  `additionalServices` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additionalServices`)),
  `notifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notifications`)),
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `preferredContactMethod` varchar(255) DEFAULT NULL,
  `totalPrice` decimal(10,2) DEFAULT NULL,
  `files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`files`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `paymentStatus` enum('Paid','Not Paid') DEFAULT 'Not Paid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `userId`, `serviceType`, `paperType`, `subjectArea`, `topic`, `paperDetails`, `paperFormat`, `referenceCount`, `academicLevel`, `pageCount`, `spacing`, `urgency`, `additionalInstructions`, `additionalServices`, `notifications`, `email`, `phoneNumber`, `fullName`, `preferredContactMethod`, `totalPrice`, `files`, `createdAt`, `paymentStatus`) VALUES
(1, 1, 'essay', 'doctoral', NULL, NULL, 'dfvdvcd', 'APA', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 08:27:09', 'Not Paid'),
(2, 1, 'essay', 'doctoral', NULL, NULL, 'dfvdvcd', 'APA', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 08:34:56', 'Not Paid'),
(3, 1, 'essay', 'doctoral', NULL, NULL, 'dfvdvcd', 'APA', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 08:51:33', 'Not Paid'),
(4, 1, 'essay', 'doctoral', NULL, NULL, 'efefefe', 'MLA', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 08:52:00', 'Not Paid'),
(5, 1, 'essay', 'doctoral', NULL, NULL, 'dddd', 'MLA', 0, 'Junior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 14:12:21', 'Not Paid'),
(6, 1, 'essay', 'doctoral', NULL, NULL, 'dccd', 'Chicago', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 17:19:02', 'Not Paid'),
(7, 1, 'essay', 'doctoral', NULL, NULL, 'dccd', 'Chicago', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 17:24:15', 'Not Paid'),
(8, 1, 'essay', 'doctoral', NULL, NULL, 'gggg', 'MLA', 0, '', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 17:42:54', 'Not Paid'),
(9, 1, 'essay', 'doctoral', NULL, NULL, 'vvvx', 'APA', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 17:47:58', 'Not Paid'),
(10, 1, 'essay', 'doctoral', NULL, NULL, 'vvvx', 'APA', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstyluoon@gmail.com', '0568900', 'him', 'email', '18.90', '[]', '2024-08-25 17:48:31', 'Not Paid'),
(11, 1, 'essay', 'doctoral', NULL, NULL, 'ggg', 'APA', 0, 'Senior', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstylioon2@gmail.com', '0797660649', 'gggggggg', 'email', '18.90', '[]', '2024-08-25 17:50:04', 'Not Paid'),
(12, 1, 'essay', 'doctoral', NULL, NULL, '', 'MLA', 0, '', 1, 'Double', '', '', '{}', '\"OrderApproved\"', 'thirstylioon2@gmail.com', '0797660649', 'gggggggg', 'email', '18.90', '[]', '2024-08-26 06:56:32', 'Not Paid');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('AxgKD8M1A4NVc6F0q635_rhFBwhk5Cw0', 1724741859, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"userId\":1,\"user\":{\"id\":1,\"username\":\"stunna\",\"email\":\"thirstylioon2@gmail.com\",\"password\":\"$2a$10$wInb1yotN7Dmw/U1dQ2GhejQnaAV1weeQLhWrKetptSmeN6wiVsGm\",\"role\":\"customer\",\"created_at\":\"2024-08-24T16:16:52.000Z\"}}'),
('_MawSFxXDmwaoaUvpiIuX0opRMP5GJCE', 1724681648, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"userId\":1,\"user\":{\"id\":1,\"username\":\"stunna\",\"email\":\"thirstylioon2@gmail.com\",\"password\":\"$2a$10$wInb1yotN7Dmw/U1dQ2GhejQnaAV1weeQLhWrKetptSmeN6wiVsGm\",\"role\":\"customer\",\"created_at\":\"2024-08-24T16:16:52.000Z\"}}'),
('fYpqSp-DJj5GotVfz1YsD1nlx5mtSj3U', 1724741628, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"userId\":1,\"user\":{\"id\":1,\"username\":\"stunna\",\"email\":\"thirstylioon2@gmail.com\",\"password\":\"$2a$10$wInb1yotN7Dmw/U1dQ2GhejQnaAV1weeQLhWrKetptSmeN6wiVsGm\",\"role\":\"customer\",\"created_at\":\"2024-08-24T16:16:52.000Z\"}}'),
('qxgNvCNomzV26kPUBvmtd1VXF9Mot5XW', 1724683949, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"userId\":1,\"user\":{\"id\":1,\"username\":\"stunna\",\"email\":\"thirstylioon2@gmail.com\",\"password\":\"$2a$10$wInb1yotN7Dmw/U1dQ2GhejQnaAV1weeQLhWrKetptSmeN6wiVsGm\",\"role\":\"customer\",\"created_at\":\"2024-08-24T16:16:52.000Z\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `CheckoutRequestID` varchar(255) DEFAULT NULL,
  `ResultCode` int(11) DEFAULT NULL,
  `ResultDesc` varchar(255) DEFAULT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `MpesaReceiptNumber` varchar(255) DEFAULT NULL,
  `Balance` varchar(255) DEFAULT NULL,
  `TransactionDate` datetime NOT NULL,
  `PhoneNumber` varchar(255) DEFAULT NULL,
  `paypalDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paypalDetails`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'stunna', 'thirstylioon2@gmail.com', '$2a$10$wInb1yotN7Dmw/U1dQ2GhejQnaAV1weeQLhWrKetptSmeN6wiVsGm', 'customer', '2024-08-24 16:16:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `counters`
--
ALTER TABLE `counters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `counters`
--
ALTER TABLE `counters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
