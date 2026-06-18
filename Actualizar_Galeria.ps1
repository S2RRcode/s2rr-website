$mediaFolder = "media\gallery"
$outputFile = "js\gallery-data.js"

if (-Not (Test-Path $mediaFolder)) {
    Write-Host "Error: La carpeta $mediaFolder no existe." -ForegroundColor Red
    exit
}

$files = Get-ChildItem -Path $mediaFolder -File | Sort-Object Name

$jsonArray = @()

foreach ($file in $files) {
    $ext = $file.Extension.ToLower()
    $type = "photo"
    if ($ext -match "\.(mp4|webm|ogg|mov)$") {
        $type = "video"
    }

    $title = $file.BaseName -replace "_", " "
    
    $obj = [PSCustomObject]@{
        type = $type
        src = "media/gallery/$($file.Name)"
        title = $title
    }
    
    $jsonArray += $obj
}

$jsonString = $jsonArray | ConvertTo-Json -Depth 2 -Compress
if ($jsonString -eq $null) { $jsonString = "[]" }
$jsContent = "const GALLERY_MEDIA = $jsonString;"

Set-Content -Path $outputFile -Value $jsContent -Encoding UTF8
Write-Host "Generado $outputFile con $($jsonArray.Count) elementos." -ForegroundColor Green

# Procesar Tramos
$tramosFolder = "media\tramos"
$tramosOutputFile = "js\tramos-data.js"

if (-Not (Test-Path $tramosFolder)) {
    New-Item -ItemType Directory -Path $tramosFolder | Out-Null
}

$tFiles = Get-ChildItem -Path $tramosFolder -File | Sort-Object Name
$tArray = @()
foreach ($f in $tFiles) {
    $tArray += "media/tramos/$($f.Name)"
}
$tJson = $tArray | ConvertTo-Json -Compress
if ($tJson -eq $null) { $tJson = "[]" }
Set-Content -Path $tramosOutputFile -Value "const TRAMOS_MEDIA = $tJson;" -Encoding UTF8
Write-Host "Generado $tramosOutputFile con $($tArray.Count) elementos." -ForegroundColor Green

# Procesar Fabricamos
$fabFolder = "media\fabricamos"
$fabOutputFile = "js\fabricamos-data.js"
if (-Not (Test-Path $fabFolder)) {
    New-Item -ItemType Directory -Path $fabFolder | Out-Null
}
$fFiles = Get-ChildItem -Path $fabFolder -File | Sort-Object Name
$fArray = @()
foreach ($f in $fFiles) {
    $fArray += "media/fabricamos/$($f.Name)"
}
$fJson = $fArray | ConvertTo-Json -Compress
if ($fJson -eq $null) { $fJson = "[]" }
Set-Content -Path $fabOutputFile -Value "const FABRICAMOS_MEDIA = $fJson;" -Encoding UTF8
Write-Host "Generado $fabOutputFile con $($fArray.Count) elementos." -ForegroundColor Green
