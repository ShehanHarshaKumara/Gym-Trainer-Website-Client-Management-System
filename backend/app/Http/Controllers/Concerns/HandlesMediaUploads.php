<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HandlesMediaUploads
{
    protected function syncMedia(
        Request $request,
        string $fileKey,
        string $urlKey,
        ?string $currentPath,
        string $directory
    ): ?string {
        if ($request->hasFile($fileKey)) {
            $this->deleteStoredMedia($currentPath);

            return $this->storeUploadedFile($request->file($fileKey), $directory);
        }

        if ($request->filled($urlKey)) {
            $this->deleteStoredMedia($currentPath);

            return (string) $request->string($urlKey);
        }

        if ($request->boolean('remove_'.$fileKey)) {
            $this->deleteStoredMedia($currentPath);

            return null;
        }

        return $currentPath;
    }

    protected function storeUploadedFile(?UploadedFile $file, string $directory): ?string
    {
        if (! $file) {
            return null;
        }

        return $file->store($directory, 'public');
    }

    protected function deleteStoredMedia(?string $path): void
    {
        if (! $path || filter_var($path, FILTER_VALIDATE_URL)) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
