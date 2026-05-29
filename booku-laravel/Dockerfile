# Gunakan image PHP 8.1 dengan Apache (Sangat stabil untuk Laravel 8)
FROM php:8.1-apache

# Install dependencies sistem yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    libonig-dev \
    curl

# Install ekstensi PHP untuk MySQL dan Laravel
RUN docker-php-ext-install pdo_mysql mbstring zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Aktifkan mod_rewrite Apache (wajib agar routing Laravel berfungsi)
RUN a2enmod rewrite

# Set folder kerja di dalam server
WORKDIR /var/www/html

# Copy seluruh file project lokal kamu ke dalam server
COPY . .

# Ubah settingan Apache agar membaca folder /public milik Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install package Laravel via Composer
RUN composer install --no-dev --optimize-autoloader

# Berikan akses write untuk folder storage dan cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Buka port 80
EXPOSE 80