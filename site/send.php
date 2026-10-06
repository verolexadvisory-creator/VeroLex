<?php
/* ============================================================
   VeroLex Advisory — murojaat formasi backendi
   Telegram bot orqali xabar yuboradi (ixtiyoriy: Google Sheets).

   SOZLASH — kodga hech narsa yozmang, `.env` faylidan foydalaning.
   Skript `.env` ni ikki joydan qidiradi:
     1) sayt ildizidan bitta YUQORIDA  (tavsiya etiladi, xavfsizroq)
     2) sayt ildizining OʻZIDA        (agar birinchisi imkonsiz boʻlsa)
   Shuningdek server muhit oʻzgaruvchilari ham oʻqiladi.

   .env namunasi:
     TELEGRAM_BOT_TOKEN=8123456789:AAH...xyz
     TELEGRAM_CHAT_ID=123456789
     GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/...   (ixtiyoriy)
   ============================================================ */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

/* ---------- 1. Sozlamalarni yuklash ---------- */
function vl_load_env(): void
{
    foreach ([dirname(__DIR__) . '/.env', __DIR__ . '/.env'] as $path) {
        if (!is_readable($path)) continue;
        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
            [$k, $v] = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v);
            if (strlen($v) > 1 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) {
                $v = substr($v, 1, -1);
            }
            if ($k !== '' && !isset($_ENV[$k])) $_ENV[$k] = $v;
        }
    }
}

function vl_env(string $key): string
{
    if (!empty($_ENV[$key])) return (string)$_ENV[$key];
    $v = getenv($key);
    return $v === false ? '' : (string)$v;
}

vl_load_env();

/* ---------- 2. Soʻrovni tekshirish ---------- */
function vl_out(bool $ok, string $error = ''): void
{
    echo json_encode($error === '' ? ['success' => $ok] : ['success' => $ok, 'error' => $error],
        JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    vl_out(false, 'method');
}

$raw = file_get_contents('php://input');
$input = json_decode((string)$raw, true);
if (!is_array($input)) $input = $_POST;

/* mbstring moduli barcha hostinglarda ham boʻlavermaydi — mustaqil variant */
function vl_len(string $s): int
{
    if (function_exists('mb_strlen')) return mb_strlen($s, 'UTF-8');
    return (int)preg_match_all('/./us', $s);
}

function vl_cut(string $s, int $max): string
{
    if (function_exists('mb_substr')) return mb_substr($s, 0, $max, 'UTF-8');
    preg_match('/^.{0,' . $max . '}/us', $s, $m);
    return $m[0] ?? '';
}

$clean = static function ($v, int $max = 1500): string {
    $v = is_scalar($v) ? (string)$v : '';
    $v = strip_tags($v);
    $v = str_replace(["\r", "\0"], '', $v);
    return vl_cut(trim($v), $max);
};

$name    = $clean($input['name']    ?? '', 80);
$phone   = $clean($input['phone']   ?? '', 40);
$email   = $clean($input['email']   ?? '', 100);
$message = $clean($input['message'] ?? '', 1500);
$page    = $clean($input['page']    ?? '', 120);
$lang    = $clean($input['lang']    ?? '', 5);

/* spam-bot tuzogʻi: yashirin maydon toʻldirilgan boʻlsa — jimgina "ok" */
if (trim((string)($input['website'] ?? '')) !== '') vl_out(true);

/* ---------- 3. Maydonlarni tasdiqlash ---------- */
if (vl_len($name) < 2) vl_out(false, 'validation');
if (preg_match_all('/\d/u', $phone) < 7) vl_out(false, 'validation');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) vl_out(false, 'validation');

/* ---------- 4. Oddiy tezlik cheklovi (daqiqasiga 5 ta murojaat) ---------- */
$ipKey = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '0') . date('YmdHi'));
$rateFile = sys_get_temp_dir() . '/vl_' . $ipKey;
$hits = is_file($rateFile) ? (int)file_get_contents($rateFile) : 0;
if ($hits >= 5) { http_response_code(429); vl_out(false, 'rate'); }
@file_put_contents($rateFile, (string)($hits + 1));

/* ---------- 5. Telegramga yuborish ---------- */
$token  = vl_env('TELEGRAM_BOT_TOKEN');
$chatId = vl_env('TELEGRAM_CHAT_ID');

if ($token === '' || $chatId === '' || strpos($token, 'BU_YERGA') === 0) {
    vl_out(false, 'config');
}

$text  = "📩 Saytdan yangi murojaat\n\n";
$text .= "👤 Ism: {$name}\n";
$text .= "📞 Telefon: {$phone}\n";
if ($email   !== '') $text .= "📧 Email: {$email}\n";
if ($message !== '') $text .= "💬 Xabar: {$message}\n";
if ($page    !== '') $text .= "🌐 Sahifa: {$page}\n";
if ($lang    !== '') $text .= "🗣 Til: {$lang}\n";
$text .= "\n🕒 " . date('d.m.Y H:i');

function vl_post(string $url, array $data, int $timeout = 8): string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($data),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => $timeout,
        ]);
        $res = curl_exec($ch);
        curl_close($ch);
        return $res === false ? '' : (string)$res;
    }
    $ctx = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => "Content-type: application/x-www-form-urlencoded\r\n",
        'content'       => http_build_query($data),
        'timeout'       => $timeout,
        'ignore_errors' => true,
    ]]);
    $res = @file_get_contents($url, false, $ctx);
    return $res === false ? '' : (string)$res;
}

$res = vl_post("https://api.telegram.org/bot{$token}/sendMessage", [
    'chat_id'                  => $chatId,
    'text'                     => $text,
    'disable_web_page_preview' => 'true',
]);
$ok = $res !== '' && strpos($res, '"ok":true') !== false;

/* ---------- 6. Google Sheets (ixtiyoriy, natijaga taʼsir qilmaydi) ---------- */
$sheet = vl_env('GOOGLE_SHEET_WEBHOOK_URL');
if ($sheet !== '') {
    vl_post($sheet, [
        'name'    => $name,
        'phone'   => "'" . $phone,   // jadvalda matn sifatida saqlanishi uchun
        'email'   => $email,
        'message' => $message,
        'page'    => $page,
        'lang'    => $lang,
    ], 4);
}

vl_out($ok, $ok ? '' : 'telegram');
