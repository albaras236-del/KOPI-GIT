<?php
$host     = 'localhost';
$dbname   = 'db_auth'; 
$username = 'root';    
$password = '11111111';        

try {
    // Pastikan nama variabel di bawah ini adalah $pdo
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}
?>