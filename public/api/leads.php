<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

function validate_lead(array $lead): array
{
    $errors = [];
    $cleanPhone = preg_replace('/\D/', '', $lead['phone'] ?? '') ?? '';

    if (($lead['fullName'] ?? '') === '') {
        $errors['fullName'] = 'נא להזין שם מלא';
    } elseif (!preg_match('/^[א-תa-zA-Z\s.\'"-]{2,80}$/u', $lead['fullName'])) {
        $errors['fullName'] = 'שם מלא מכיל תווים לא תקינים';
    }

    if ($cleanPhone === '') {
        $errors['phone'] = 'נא להזין מספר טלפון';
    } elseif (!preg_match('/^05\d{8}$/', $cleanPhone)) {
        $errors['phone'] = 'מספר טלפון לא תקין';
    }

    if (($lead['email'] ?? '') === '') {
        $errors['email'] = 'נא להזין כתובת אימייל';
    } elseif (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'כתובת אימייל לא תקינה';
    }

    if (($lead['organization'] ?? '') === '') {
        $errors['organization'] = 'נא להזין שם רשות / ארגון';
    } elseif (!preg_match('/^[א-תa-zA-Z0-9\s.\'",()\/\-]{2,120}$/u', $lead['organization'])) {
        $errors['organization'] = 'שם הרשות / הארגון מכיל תווים לא תקינים';
    }

    return [
        'isValid' => count($errors) === 0,
        'errors' => $errors,
        'cleanPhone' => $cleanPhone,
    ];
}

function send_lead_email(array $lead): void
{
    if (EMAIL_TO === 'your-email@example.com') {
        return;
    }

    $subject = 'פנייה חדשה מ-' . $lead['fullName'];
    $body = implode("\n", [
        'פנייה חדשה מהאתר',
        '',
        'שם: ' . $lead['fullName'],
        'טלפון: ' . $lead['phone'],
        'אימייל: ' . $lead['email'],
        'רשות / ארגון: ' . $lead['organization'],
        'מסלול נבחר: ' . service_plan_label($lead['servicePlan'] ?? ''),
        'תאריך: ' . $lead['createdAt'],
    ]);

    $headers = [
        'From: ' . EMAIL_FROM_NAME . ' <' . EMAIL_FROM . '>',
        'Reply-To: ' . $lead['email'],
        'Content-Type: text/plain; charset=UTF-8',
    ];

    @mail(EMAIL_TO, $subject, $body, implode("\r\n", $headers));
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin();

    $leads = read_leads();
    $mapped = array_map(static fn(array $lead): array => [
        'id' => (string) ($lead['id'] ?? ''),
        'name' => (string) ($lead['fullName'] ?? ''),
        'phone' => (string) ($lead['phone'] ?? ''),
        'email' => (string) ($lead['email'] ?? ''),
        'organization' => (string) ($lead['organization'] ?? ''),
        'servicePlan' => service_plan_label($lead['servicePlan'] ?? ''),
        'status' => (string) ($lead['status'] ?? 'חדשה'),
        'createdAt' => substr((string) ($lead['createdAt'] ?? ''), 0, 10),
    ], $leads);

    json_response(['leads' => $mapped]);
}

if ($method === 'POST') {
    $body = read_json_body();

    $fullName = sanitize_input($body['fullName'] ?? '', 80);
    $phone = sanitize_input($body['phone'] ?? '', 20);
    $email = strtolower(sanitize_input($body['email'] ?? '', 120));
    $organization = sanitize_input($body['organization'] ?? '', 120);
    $servicePlan = normalize_service_plan($body['servicePlan'] ?? '');

    $validation = validate_lead([
        'fullName' => $fullName,
        'phone' => $phone,
        'email' => $email,
        'organization' => $organization,
    ]);

    if (!$validation['isValid']) {
        json_response([
            'error' => 'יש שדות שדורשים תיקון',
            'errors' => $validation['errors'],
        ], 400);
    }

    $lead = [
        'id' => (string) time() . '-' . bin2hex(random_bytes(3)),
        'fullName' => $fullName,
        'phone' => $validation['cleanPhone'],
        'email' => $email,
        'organization' => $organization,
        'servicePlan' => $servicePlan,
        'createdAt' => gmdate('c'),
        'status' => 'חדשה',
    ];

    $leads = read_leads();
    array_unshift($leads, $lead);
    write_leads($leads);
    send_lead_email($lead);

    json_response([
        'success' => true,
        'message' => 'הפנייה נשלחה בהצלחה. נחזור אליך בהקדם.',
        'lead' => [
            'id' => $lead['id'],
            'fullName' => $lead['fullName'],
            'organization' => $lead['organization'],
            'servicePlan' => $lead['servicePlan'],
            'createdAt' => $lead['createdAt'],
            'status' => $lead['status'],
        ],
    ]);
}

if ($method === 'PATCH') {
    require_admin();
    $body = read_json_body();
    $id = sanitize_input($body['id'] ?? '', 80);
    $status = sanitize_input($body['status'] ?? '', 30);
    $allowedStatuses = ['חדשה', 'בטיפול', 'נסגרה', 'לא רלוונטית'];

    if ($id === '' || !in_array($status, $allowedStatuses, true)) {
        json_response(['error' => 'בקשה לא תקינה'], 400);
    }

    $leads = read_leads();
    foreach ($leads as &$lead) {
        if (($lead['id'] ?? '') === $id) {
            $lead['status'] = $status;
            break;
        }
    }

    write_leads($leads);
    json_response(['success' => true]);
}

if ($method === 'DELETE') {
    require_admin();
    $body = read_json_body();
    $id = sanitize_input($body['id'] ?? '', 80);

    if ($id === '') {
        json_response(['error' => 'בקשה לא תקינה'], 400);
    }

    $leads = array_values(array_filter(
        read_leads(),
        static fn(array $lead): bool => ($lead['id'] ?? '') !== $id
    ));

    write_leads($leads);
    json_response(['success' => true]);
}

json_response(['error' => 'Method not allowed'], 405);

