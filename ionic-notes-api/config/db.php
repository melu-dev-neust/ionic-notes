<?php
$host ="localhost";
$dbname = "ionic_notes";
$user ="root";
$password ="";

try {
    $options = [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
		];

    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password, $options);
    // $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

?>