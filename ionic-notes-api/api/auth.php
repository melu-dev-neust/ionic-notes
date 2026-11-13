<?php
// Development CORS allow-list (same as notes.php)
$allowedOrigins = [
    'http://localhost',
    'http://localhost:8100',
    'http://127.0.0.1:8100',
    'http://localhost:4200',
    'https://localhost',
    'capacitor://localhost',
    'ionic://localhost',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

require_once '../config/db.php';
require_once '../config/auth_helper.php';

function body() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function fail($code, $message) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed');
}

try {
    $type = $_GET['type'] ?? '';
    $b = body();

    if ($type === 'register') {
        $username = trim($b['username'] ?? '');
        $email    = strtolower(trim($b['email'] ?? ''));
        $password = $b['password'] ?? '';

        if ($username === '' || $email === '' || $password === '') {
            fail(400, 'Please fill in all fields');
        }
        if (strlen($username) > 50) {
            fail(400, 'Username must be 50 characters or less');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 100) {
            fail(400, 'Please enter a valid email address');
        }
        if (strlen($password) < 6) {
            fail(400, 'Password must be at least 6 characters');
        }

        $c = $conn->prepare('SELECT 1 FROM users WHERE username = :u');
        $c->execute([':u' => $username]);
        if ($c->fetchColumn()) {
            fail(409, 'That username is already taken');
        }

        $c = $conn->prepare('SELECT 1 FROM users WHERE email = :e');
        $c->execute([':e' => $email]);
        if ($c->fetchColumn()) {
            fail(409, 'That email is already registered');
        }

        $s = $conn->prepare('INSERT INTO users (username, email, password) VALUES (:u, :e, :p)');
        $s->execute([
            ':u' => $username,
            ':e' => $email,
            ':p' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        $newId = (int)$conn->lastInsertId();
        echo json_encode([
            'user_id'  => $newId,
            'username' => $username,
            'email'    => $email,
            'token'    => issue_token($conn, $newId),
        ]);

    } elseif ($type === 'login') {
        $email    = strtolower(trim($b['email'] ?? ''));
        $password = $b['password'] ?? '';

        if ($email === '' || $password === '') {
            fail(400, 'Please enter your email and password');
        }

        $s = $conn->prepare('SELECT user_id, username, email, password FROM users WHERE email = :e');
        $s->execute([':e' => $email]);
        $user = $s->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            fail(401, 'Invalid email or password');
        }

       echo json_encode([
    'user_id'  => (int)$user['user_id'],
    'username' => $user['username'],
    'email'    => $user['email'],
    'token'    => issue_token($conn, (int)$user['user_id']),
]);

    }elseif ($type === 'logout') {
    $token = bearer_token();
    if ($token) revoke_token($conn, $token);
    echo json_encode(['loggedOut' => true]);

} else {
        fail(400, 'Unknown type');
    }
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        fail(409, 'Username or email is already in use');
    }
    fail(500, 'Server error');
}
?>