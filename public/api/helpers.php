<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name(SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 8,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function sanitize_input($value, int $maxLength = 120): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = preg_replace('/[<>\x00-\x1F\x7F]/u', '', $value) ?? '';
    $value = trim($value);

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function normalize_service_plan($value): string
{
    $plan = sanitize_input($value, 30);
    return in_array($plan, ['basic', 'professional', 'full'], true) ? $plan : '';
}

function service_plan_label(?string $plan): string
{
    switch ($plan) {
        case 'basic':
            return 'מסלול בסיסי';
        case 'professional':
            return 'מסלול מקצועי';
        case 'full':
            return 'מסלול מלא';
        default:
            return 'לא נבחר';
    }
}

function data_file_path(): string
{
    return __DIR__ . '/data/leads.json';
}

function ensure_data_file(): void
{
    $dir = dirname(data_file_path());
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    if (!file_exists(data_file_path())) {
        file_put_contents(data_file_path(), '[]');
    }
}

function read_leads(): array
{
    ensure_data_file();
    $raw = file_get_contents(data_file_path());
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function write_leads(array $leads): void
{
    ensure_data_file();
    file_put_contents(
        data_file_path(),
        json_encode($leads, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
        LOCK_EX
    );
}

function require_admin(): void
{
    start_admin_session();
    if (empty($_SESSION['admin_authenticated'])) {
        json_response(['error' => 'לא מחובר'], 401);
    }
}
