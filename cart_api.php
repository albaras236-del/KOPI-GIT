<?php
session_start();
require_once 'koneksi.php';

header('Content-Type: application/json; charset=utf-8');

function jsonResponse($payload, $status = 200)
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function requireLogin()
{
    if (empty($_SESSION['user_id'])) {
        jsonResponse([
            'success' => false,
            'message' => 'Silakan login terlebih dahulu.'
        ], 401);
    }

    return (int) $_SESSION['user_id'];
}

function requestData()
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return $_POST;
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function intInput($data, $key, $default = 0)
{
    if (!isset($data[$key])) {
        return $default;
    }

    return (int) $data[$key];
}

function getCartItems($pdo, $userId)
{
    $stmt = $pdo->prepare("
        SELECT
            ci.product_id,
            ci.qty,
            p.name,
            p.price,
            p.image_url,
            COALESCE(NULLIF(p.alt_text, ''), p.name) AS alt_text
        FROM cart_items ci
        INNER JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = :user_id
          AND p.is_active = 1
        ORDER BY ci.created_at ASC, ci.id ASC
    ");
    $stmt->execute([':user_id' => $userId]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(function ($item) {
        return [
            'product_id' => (int) $item['product_id'],
            'name' => $item['name'],
            'price' => (int) $item['price'],
            'qty' => (int) $item['qty'],
            'image' => $item['image_url'],
            'alt' => $item['alt_text']
        ];
    }, $items);
}

$userId = requireLogin();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        jsonResponse([
            'success' => true,
            'cart' => getCartItems($pdo, $userId)
        ]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse([
            'success' => false,
            'message' => 'Metode request tidak didukung.'
        ], 405);
    }

    $data = requestData();
    $action = isset($data['action']) ? $data['action'] : '';

    if ($action === 'add') {
        $productId = intInput($data, 'product_id');
        $qty = max(1, min(99, intInput($data, 'qty', 1)));

        if ($productId <= 0) {
            jsonResponse([
                'success' => false,
                'message' => 'Produk tidak valid.'
            ], 422);
        }

        $product = $pdo->prepare("SELECT id FROM products WHERE id = :id AND is_active = 1 LIMIT 1");
        $product->execute([':id' => $productId]);

        if (!$product->fetchColumn()) {
            jsonResponse([
                'success' => false,
                'message' => 'Produk tidak ditemukan.'
            ], 404);
        }

        $stmt = $pdo->prepare("
            INSERT INTO cart_items (user_id, product_id, qty)
            VALUES (:user_id, :product_id, :qty)
            ON DUPLICATE KEY UPDATE
              qty = LEAST(qty + VALUES(qty), 99),
              updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([
            ':user_id' => $userId,
            ':product_id' => $productId,
            ':qty' => $qty
        ]);

        jsonResponse([
            'success' => true,
            'cart' => getCartItems($pdo, $userId)
        ]);
    }

    if ($action === 'set_qty') {
        $productId = intInput($data, 'product_id');
        $qty = intInput($data, 'qty');

        if ($productId <= 0) {
            jsonResponse([
                'success' => false,
                'message' => 'Produk tidak valid.'
            ], 422);
        }

        if ($qty <= 0) {
            $stmt = $pdo->prepare("DELETE FROM cart_items WHERE user_id = :user_id AND product_id = :product_id");
            $stmt->execute([
                ':user_id' => $userId,
                ':product_id' => $productId
            ]);
        } else {
            $stmt = $pdo->prepare("
                UPDATE cart_items
                SET qty = :qty
                WHERE user_id = :user_id
                  AND product_id = :product_id
            ");
            $stmt->execute([
                ':qty' => min(99, $qty),
                ':user_id' => $userId,
                ':product_id' => $productId
            ]);
        }

        jsonResponse([
            'success' => true,
            'cart' => getCartItems($pdo, $userId)
        ]);
    }

    if ($action === 'remove') {
        $productId = intInput($data, 'product_id');
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE user_id = :user_id AND product_id = :product_id");
        $stmt->execute([
            ':user_id' => $userId,
            ':product_id' => $productId
        ]);

        jsonResponse([
            'success' => true,
            'cart' => getCartItems($pdo, $userId)
        ]);
    }

    if ($action === 'clear') {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $userId]);

        jsonResponse([
            'success' => true,
            'cart' => []
        ]);
    }

    jsonResponse([
        'success' => false,
        'message' => 'Aksi tidak dikenal.'
    ], 400);
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Terjadi kesalahan database. Pastikan tabel products dan cart_items sudah dibuat.'
    ], 500);
}
