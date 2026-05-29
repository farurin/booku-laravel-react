<?php
// clear.php V2 - Menghapus file cache secara fisik
$cacheFiles = [
    __DIR__ . '/bootstrap/cache/config.php',
    __DIR__ . '/bootstrap/cache/routes.php',
    __DIR__ . '/bootstrap/cache/services.php',
    __DIR__ . '/bootstrap/cache/packages.php',
];

echo "<h3>Memulai pembersihan Cache Laravel...</h3>";

foreach ($cacheFiles as $file) {
    if (file_exists($file)) {
        if (unlink($file)) {
            echo "<p style='color:green;'>✅ Berhasil menghapus: " . basename($file) . "</p>";
        } else {
            echo "<p style='color:red;'>❌ Gagal menghapus: " . basename($file) . " (Cek permission)</p>";
        }
    } else {
        echo "<p style='color:gray;'>⏭️ Sudah bersih (tidak ada): " . basename($file) . "</p>";
    }
}

echo "<hr><p><b>Selesai!</b> Cache konfigurasi lama sudah dihancurkan. Silakan tes API-nya.</p>";
?>