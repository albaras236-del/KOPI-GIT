<?php
session_start();

// 1. Hancurkan semua data session
session_unset();
session_destroy();

// 2. Hapus cookie session (jika ada)
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// 3. Redirect LANGSUNG ke halaman login
header("Location: login.php");
exit;
?>