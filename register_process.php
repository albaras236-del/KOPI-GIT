<?php
session_start();
require_once 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $password = $_POST['password'];

    // Validasi sederhana
    if (empty($username) || empty($email) || empty($password)) {
        $_SESSION['error'] = "Semua kolom harus diisi!";
        header("Location: register.php");
        exit;
    }

    // Hash password demi keamanan
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Cek apakah email sudah terdaftar di database
        $check = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $check->bindParam(':email', $email);
        $check->execute();

        if ($check->rowCount() > 0) {
            $_SESSION['error'] = "Email sudah terdaftar! Silakan gunakan email lain atau login.";
            header("Location: register.php");
            exit;
        }

        // Jika email belum ada, masukkan data ke tabel users
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);
        
        if ($stmt->execute()) {
            // Jika berhasil disimpan, lemparkan ke halaman login dan kasih pesan sukses
            $_SESSION['error'] = "Pendaftaran berhasil! Silakan login dengan akun baru kamu."; // Pakai variabel error agar format kotaknya sama
            header("Location: login.php");
            exit;
        } else {
            $_SESSION['error'] = "Gagal mendaftar. Terjadi kesalahan sistem.";
            header("Location: register.php");
            exit;
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    // Tendang ke register kalau akses file ini langsung lewat URL
    header("Location: register.php");
    exit;
}
?>