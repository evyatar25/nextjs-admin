<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = read_json_body();
$password = sanitize_input($body['password'] ?? '', 200);

if (ADMIN_PASSWORD === 'change-this-password') {
    json_response(['error' => 'סיסמת אדמין לא הוגדרה בשרת'], 500);
}

if (!hash_equals(ADMIN_PASSWORD, $password)) {
    json_response(['error' => 'סיסמה שגויה'], 401);
}

start_admin_session();
session_regenerate_id(true);
$_SESSION['admin_authenticated'] = true;

json_response([
    'success' => true,
    'message' => 'התחברת בהצלחה',
]);

