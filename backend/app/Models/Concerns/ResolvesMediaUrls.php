<?php

namespace App\Models\Concerns;

trait ResolvesMediaUrls
{
    protected function resolveMediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        return url('storage/'.$path);
    }

    public function buildWhatsappUrl(?string $number, string $message): ?string
    {
        if (! $number) {
            return null;
        }

        $sanitized = preg_replace('/\D+/', '', $number) ?? '';

        if ($sanitized === '') {
            return null;
        }

        return 'https://wa.me/'.$sanitized.'?text='.rawurlencode($message);
    }
}
