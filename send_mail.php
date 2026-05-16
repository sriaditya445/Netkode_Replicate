<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// NOTE: This assumes you have installed PHPMailer via Composer.
// If you downloaded PHPMailer manually, include the required files instead:
// require 'path/to/PHPMailer/src/Exception.php';
// require 'path/to/PHPMailer/src/PHPMailer.php';
// require 'path/to/PHPMailer/src/SMTP.php';
if (file_exists('vendor/autoload.php')) {
    require 'vendor/autoload.php';
} else {
    // If PHPMailer is not found, force an error to trigger Web3Forms fallback in JS
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "PHPMailer not installed."]);
    exit;
}

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $message = $_POST['message'] ?? '';

    if (empty($name) || empty($email) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Required fields are missing."]);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // SERVER SETTINGS
        // Uncomment and configure the following lines to use an SMTP server
        // $mail->isSMTP();
        // $mail->Host       = 'smtp.example.com';
        // $mail->SMTPAuth   = true;
        // $mail->Username   = 'your_email@example.com';
        // $mail->Password   = 'your_password';
        // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // or PHPMailer::ENCRYPTION_STARTTLS
        // $mail->Port       = 465; // or 587

        // RECIPIENTS
        $mail->setFrom('no-reply@netkode.in', 'NetKode Website');
        $mail->addAddress('sriadityadurgaram@gmail.com'); // Where the emails will be sent
        $mail->addReplyTo($email, $name);

        // CONTENT
        $mail->isHTML(true);
        $mail->Subject = 'New NetKode Networks Enquiry from ' . htmlspecialchars($name);
        $mail->Body    = "
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                <h3 style='color: #6366f1;'>New Contact Request</h3>
                <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
                <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
                <p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>
                <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
            </div>
        ";
        $mail->AltBody = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message";

        $mail->send();
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Message has been sent successfully."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
