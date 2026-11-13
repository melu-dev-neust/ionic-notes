<?php
function unauthorized() {
    http_response_code(401);
    echo json_encode(['error' => 'Please log in again']);
    exit;
}

function bearer_token() {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($h === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'authorization') $h = $v;
        }
    }
    return preg_match('/^Bearer\s+(\S+)$/i', $h, $m) ? $m[1] : null;
}

function issue_token($conn, $userId) {
    // tidy up expired tokens whenever someone logs in
    $conn->exec('DELETE FROM auth_tokens WHERE expires_at < NOW()');

    $token = bin2hex(random_bytes(32));
    $s = $conn->prepare('INSERT INTO auth_tokens (token_hash, user_id, expires_at)
                         VALUES (:h, :u, DATE_ADD(NOW(), INTERVAL 30 DAY))');
    $s->execute([':h' => hash('sha256', $token), ':u' => $userId]);
    return $token;
}

/** Returns the logged-in user's id, or sends a 401 and stops */
function require_auth($conn) {
    $token = bearer_token();
    if (!$token) unauthorized();

    $s = $conn->prepare('SELECT user_id FROM auth_tokens WHERE token_hash = :h AND expires_at > NOW()');
    $s->execute([':h' => hash('sha256', $token)]);
    $userId = $s->fetchColumn();
    if (!$userId) unauthorized();

    return (int)$userId;
}

function revoke_token($conn, $token) {
    $s = $conn->prepare('DELETE FROM auth_tokens WHERE token_hash = :h');
    $s->execute([':h' => hash('sha256', $token)]);
}
?>