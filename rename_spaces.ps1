 "c:\Users\Mostafa\OneDrive\Attachments\New folder\images"
Get-ChildItem -File | Where-Object {$_.Name -match ' '} | ForEach-Object {
    $new = $_.Name -replace ' ', '-'
    Rename-Item -Path $_.FullName -NewName $new -ErrorAction SilentlyContinue
}
