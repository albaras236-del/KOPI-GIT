<?php
session_start();
require_once 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Cek user dan verifikasi password
        if ($user && password_verify($password, $user['password'])) {
            // Set session jika berhasil
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Redirect ke halaman utama (sesuaikan nama file beranda Anda)
            header("Location: index.php"); 
            exit;
        } else {
            $_SESSION['error'] = "Email atau password salah!";
            header("Location: login.php");
            exit;
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    header("Location: login.php");
    exit;
}
?>