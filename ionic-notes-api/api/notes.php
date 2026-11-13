<?php
// Development CORS allow-list. Add your app's exact origin if needed.
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

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle CORS preflight request (browsers send this WITHOUT the token)
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

function fetchNote($conn, $id) {
    $s = $conn->prepare('SELECT * FROM notes WHERE note_id = :id');
    $s->execute([':id' => $id]);
    return $s->fetch(PDO::FETCH_ASSOC);
}

/** A note that exists AND belongs to this user, otherwise a 404 */
function ownNoteOr404($conn, $noteId, $userId) {
    $note = fetchNote($conn, $noteId);
    if (!$note || (int)$note['user_id'] !== $userId) {
        fail(404, 'Note not found');
    }
    return $note;
}

/** true when no category is given, or when it belongs to this user */
function ownsCategory($conn, $categoryId, $userId) {
    if ($categoryId === null || $categoryId === '') return true;
    $s = $conn->prepare('SELECT 1 FROM categories WHERE category_id = :c AND user_id = :u');
    $s->execute([':c' => $categoryId, ':u' => $userId]);
    return (bool)$s->fetchColumn();
}

try {
    // every request below needs a valid token
    $userId = require_auth($conn);

    $method = $_SERVER['REQUEST_METHOD'];
    $type   = $_GET['type'] ?? '';

    switch ($method) {

        case 'GET':
            if ($type === 'my-notes') {
                $s = $conn->prepare('SELECT * FROM notes
                                     WHERE user_id = :u
                                     ORDER BY created_at DESC');
            } elseif ($type === 'shared-notes') {
                $s = $conn->prepare('SELECT sn.*, u.username AS received_from_username
                                     FROM shared_notes sn
                                     LEFT JOIN users u ON u.user_id = sn.received_from_id
                                     WHERE sn.user_id = :u
                                     ORDER BY sn.created_at DESC');
            } elseif ($type === 'categories') {
                $s = $conn->prepare('SELECT * FROM categories WHERE user_id = :u ORDER BY category_name');
            } else {
                fail(400, 'Unknown type');
            }
            $s->execute([':u' => $userId]);
            echo json_encode($s->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            $b = body();

            if ($type === 'note') {
                $categoryId = $b['category_id'] ?? null;
                if (!ownsCategory($conn, $categoryId, $userId)) {
                    fail(404, 'Folder not found');
                }
                $s = $conn->prepare('INSERT INTO notes (user_id, category_id, note_title, note_content)
                                     VALUES (:u, :c, :t, :n)');
                $s->execute([
                    ':u' => $userId,
                    ':c' => $categoryId,
                    ':t' => ($b['note_title'] ?? '') !== '' ? $b['note_title'] : 'Untitled',
                    ':n' => $b['note_content'] ?? '',
                ]);
                echo json_encode(fetchNote($conn, $conn->lastInsertId()));

            } elseif ($type === 'category') {
                $name = trim($b['category_name'] ?? '');
                if ($name === '') fail(400, 'Folder name is required');

                $s = $conn->prepare('INSERT INTO categories (user_id, category_name) VALUES (:u, :n)');
                $s->execute([':u' => $userId, ':n' => $name]);
                echo json_encode([
                    'category_id'   => (int)$conn->lastInsertId(),
                    'user_id'       => $userId,
                    'category_name' => $name,
                ]);

            } elseif ($type === 'share') {
                $note   = ownNoteOr404($conn, $b['note_id'] ?? 0, $userId);
                $target = trim($b['target_username'] ?? '');

                $u = $conn->prepare('SELECT user_id FROM users WHERE username = :n');
                $u->execute([':n' => $target]);
                $recipient = $u->fetchColumn();
                if (!$recipient) {
                    fail(404, 'User not found');
                }
                if ((int)$recipient === $userId) {
                    fail(400, 'You cannot share a note with yourself');
                }

                // Already sent this exact note to this person?
                $dup = $conn->prepare('SELECT 1 FROM shared_notes
                                       WHERE user_id = :to AND source_note_id = :src AND received_from_id = :from');
                $dup->execute([':to' => $recipient, ':src' => $note['note_id'], ':from' => $userId]);
                if ($dup->fetchColumn()) {
                    fail(409, 'Already shared with this user');
                }

                $s = $conn->prepare('INSERT INTO shared_notes
                    (user_id, received_from_id, source_note_id, sharedNote_title, sharedNote_content)
                    VALUES (:to, :from, :src, :t, :c)');
                $s->execute([
                    ':to'   => $recipient,
                    ':from' => $userId,
                    ':src'  => $note['note_id'],
                    ':t'    => $note['note_title'],
                    ':c'    => $note['note_content'],
                ]);
                echo json_encode(['shared' => true]);

            } else {
                fail(400, 'Unknown type');
            }
            break;

        case 'PUT':
            $b  = body();
            $id = (int)($_GET['id'] ?? 0);

            if ($type === 'note') {
                ownNoteOr404($conn, $id, $userId);

                $categoryId = $b['category_id'] ?? null;
                if (!ownsCategory($conn, $categoryId, $userId)) {
                    fail(404, 'Folder not found');
                }

                $s = $conn->prepare('UPDATE notes
                                     SET note_title = :t, note_content = :n, category_id = :c
                                     WHERE note_id = :id AND user_id = :u');
                $s->execute([
                    ':t'  => $b['note_title'],
                    ':n'  => $b['note_content'],
                    ':c'  => $categoryId,
                    ':id' => $id,
                    ':u'  => $userId,
                ]);
                echo json_encode(fetchNote($conn, $id));
            } else {
                fail(400, 'Unknown type');
            }
            break;

        case 'DELETE':
            $id = (int)($_GET['id'] ?? 0);

            if ($type === 'note') {
                ownNoteOr404($conn, $id, $userId);
                try {
                    $s = $conn->prepare('DELETE FROM notes WHERE note_id = :id AND user_id = :u');
                    $s->execute([':id' => $id, ':u' => $userId]);
                    echo json_encode(['deleted' => true]);
                } catch (PDOException $e) {
                    if ($e->getCode() === '23000') {
                        fail(409, 'This note has been shared and cannot be deleted yet');
                    }
                    throw $e;
                }

            } elseif ($type === 'shared-note') {
                $s = $conn->prepare('DELETE FROM shared_notes WHERE sharedNote_id = :id AND user_id = :u');
                $s->execute([':id' => $id, ':u' => $userId]);
                echo json_encode(['deleted' => true]);

            } elseif ($type === 'category') {
                // ?type=category&ids=1,2,3
                $ids = array_values(array_filter(
                    array_map('intval', explode(',', $_GET['ids'] ?? '')),
                    fn($i) => $i > 0
                ));
                if (!$ids) fail(400, 'No folders selected');

                $in = implode(',', array_fill(0, count($ids), '?'));
                try {
                    $conn->beginTransaction();

                    $dn = $conn->prepare("DELETE FROM notes WHERE user_id = ? AND category_id IN ($in)");
                    $dn->execute(array_merge([$userId], $ids));

                    $dc = $conn->prepare("DELETE FROM categories WHERE user_id = ? AND category_id IN ($in)");
                    $dc->execute(array_merge([$userId], $ids));

                    $conn->commit();
                    echo json_encode([
                        'deleted' => true,
                        'categories' => $dc->rowCount(),
                        'notes' => $dn->rowCount(),
                    ]);
                } catch (PDOException $e) {
                    if ($conn->inTransaction()) $conn->rollBack();
                    if ($e->getCode() === '23000') {
                        fail(409, 'A note in this folder was shared, so the folder cannot be deleted yet');
                    }
                    throw $e;
                }

            } else {
                fail(400, 'Unknown type');
            }
            break;

        default:
            fail(405, 'Method not allowed');
    }
} catch (PDOException $e) {
    error_log($e->getMessage()); // real error goes to the server log, not to the user
    fail(500, 'Server error');
}
?>