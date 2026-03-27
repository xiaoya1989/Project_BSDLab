Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

function New-SolidBrush([string]$color) {
    [System.Windows.Media.SolidColorBrush]([System.Windows.Media.ColorConverter]::ConvertFromString($color))
}

function Draw-RoundedSquare($ctx, [double]$x, [double]$y, [double]$size, [double]$radius, [string]$fill, [string]$stroke) {
    $rect = [System.Windows.Rect]::new($x, $y, $size, $size)
    $pen = [System.Windows.Media.Pen]::new((New-SolidBrush $stroke), 1)
    $ctx.DrawRoundedRectangle((New-SolidBrush $fill), $pen, $rect, $radius, $radius)
}

function Draw-Path($ctx, [string]$pathData, [string]$color, [double]$thickness) {
    $pen = [System.Windows.Media.Pen]::new((New-SolidBrush $color), $thickness)
    $pen.StartLineCap = [System.Windows.Media.PenLineCap]::Round
    $pen.EndLineCap = [System.Windows.Media.PenLineCap]::Round
    $pen.LineJoin = [System.Windows.Media.PenLineJoin]::Round
    $geometry = [System.Windows.Media.Geometry]::Parse($pathData)
    $ctx.DrawGeometry($null, $pen, $geometry)
}

function Draw-Text($ctx, [string]$text, [double]$x, [double]$y, [double]$fontSize, [string]$weight, [string]$color, [string]$align = "Left") {
    $typeface = [System.Windows.Media.Typeface]::new("Segoe UI")
    $formatted = [System.Windows.Media.FormattedText]::new(
        $text,
        [System.Globalization.CultureInfo]::InvariantCulture,
        [System.Windows.FlowDirection]::LeftToRight,
        $typeface,
        $fontSize,
        (New-SolidBrush $color),
        1.0
    )
    if ($weight -eq "SemiBold") {
        $formatted.SetFontWeight([System.Windows.FontWeights]::SemiBold)
    } elseif ($weight -eq "Medium") {
        $formatted.SetFontWeight([System.Windows.FontWeights]::Medium)
    }
    if ($align -eq "Center") {
        $x -= $formatted.Width / 2
    }
    $ctx.DrawText($formatted, [System.Windows.Point]::new($x, $y))
}

function Save-Visual($visual, [int]$width, [int]$height, [string]$outputPath) {
    $bitmap = [System.Windows.Media.Imaging.RenderTargetBitmap]::new($width, $height, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $bitmap.Render($visual)
    $encoder = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
    $stream = [System.IO.File]::Open($outputPath, [System.IO.FileMode]::Create)
    try {
        $encoder.Save($stream)
    } finally {
        $stream.Dispose()
    }
}

function New-Visual([scriptblock]$drawBlock) {
    $visual = [System.Windows.Media.DrawingVisual]::new()
    $ctx = $visual.RenderOpen()
    try {
        & $drawBlock $ctx
    } finally {
        $ctx.Close()
    }
    $visual
}

function Draw-MarkShape($ctx, [string]$primary, [string]$secondary, [string]$tertiary, [double]$offsetX, [double]$offsetY, [double]$scale) {
    Draw-Path $ctx ("M{0} {1}C{2} {3} {4} {5} {6} {7}C{8} {9} {10} {11} {12} {13}" -f (124*$scale+$offsetX), (286*$scale+$offsetY), (124*$scale+$offsetX), (198*$scale+$offsetY), (193*$scale+$offsetX), (130*$scale+$offsetY), (283*$scale+$offsetX), (130*$scale+$offsetY), (331*$scale+$offsetX), (130*$scale+$offsetY), (374*$scale+$offsetX), (148*$scale+$offsetY), (406*$scale+$offsetX), (180*$scale+$offsetY)) $primary (34*$scale)
    Draw-Path $ctx ("M{0} {1}C{2} {3} {4} {5} {6} {7}C{8} {9} {10} {11} {12} {13}" -f (388*$scale+$offsetX), (228*$scale+$offsetY), (388*$scale+$offsetX), (316*$scale+$offsetY), (319*$scale+$offsetX), (384*$scale+$offsetY), (229*$scale+$offsetX), (384*$scale+$offsetY), (181*$scale+$offsetX), (384*$scale+$offsetY), (138*$scale+$offsetX), (366*$scale+$offsetY), (106*$scale+$offsetX), (334*$scale+$offsetY)) $secondary (34*$scale)
    Draw-Path $ctx ("M{0} {1}C{2} {3} {4} {5} {6} {7}C{8} {9} {10} {11} {12} {13}" -f (146*$scale+$offsetX), (200*$scale+$offsetY), (176*$scale+$offsetX), (170*$scale+$offsetY), (218*$scale+$offsetX), (152*$scale+$offsetY), (264*$scale+$offsetX), (152*$scale+$offsetY), (357*$scale+$offsetX), (152*$scale+$offsetY), (432*$scale+$offsetX), (227*$scale+$offsetY), (432*$scale+$offsetX), (320*$scale+$offsetY)) $tertiary (18*$scale)
}

$root = Split-Path -Parent $PSScriptRoot
$pngDir = Join-Path $root "assets\logo\png"
[System.IO.Directory]::CreateDirectory($pngDir) | Out-Null

$lightBg = "#F8FAFC"
$lightBorder = "#E2E8F0"
$white = "#FFFFFF"
$darkBg = "#020817"
$darkBorder = "#1E293B"
$ink = "#0F172A"
$inkSoft = "#334155"
$muted = "#475569"
$mutedLight = "#94A3B8"
$trace = "#CBD5E1"
$mono = "#111827"

$markLight = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 96 96 320 92 $lightBg $lightBorder
    Draw-MarkShape $ctx $ink $inkSoft $trace 0 0 1
}
Save-Visual $markLight 512 512 (Join-Path $pngDir "bsd-mark.png")

$markDark = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 96 96 320 92 $darkBg $darkBorder
    Draw-MarkShape $ctx "#F8FAFC" $trace $muted 0 0 1
}
Save-Visual $markDark 512 512 (Join-Path $pngDir "bsd-mark-dark.png")

$markMono = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 96 96 320 92 $white "#D4DCE6"
    Draw-MarkShape $ctx $mono $mono $mutedLight 0 0 1
}
Save-Visual $markMono 512 512 (Join-Path $pngDir "bsd-mark-mono.png")

$markRaw = New-Visual {
    param($ctx)
    Draw-MarkShape $ctx $ink $inkSoft $trace 0 0 1
}
Save-Visual $markRaw 512 512 (Join-Path $pngDir "bsd-mark-raw.png")

$markRawDark = New-Visual {
    param($ctx)
    Draw-MarkShape $ctx "#F8FAFC" $trace $muted 0 0 1
}
Save-Visual $markRawDark 512 512 (Join-Path $pngDir "bsd-mark-raw-dark.png")

$horizontalLight = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 32 32 224 68 $lightBg $lightBorder
    Draw-MarkShape $ctx $ink $inkSoft $trace -50 -54 0.59
    Draw-Text $ctx "BSD Lab" 324 86 92 "SemiBold" $ink
    Draw-Text $ctx "Brain State Dynamics Lab" 326 178 28 "Medium" $muted
}
Save-Visual $horizontalLight 1180 320 (Join-Path $pngDir "bsd-lockup-horizontal.png")

$horizontalDark = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 32 32 224 68 $darkBg $darkBorder
    Draw-MarkShape $ctx "#F8FAFC" $trace $muted -50 -54 0.59
    Draw-Text $ctx "BSD Lab" 324 86 92 "SemiBold" "#F8FAFC"
    Draw-Text $ctx "Brain State Dynamics Lab" 326 178 28 "Medium" $mutedLight
}
Save-Visual $horizontalDark 1180 320 (Join-Path $pngDir "bsd-lockup-horizontal-dark.png")

$horizontalMono = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 32 32 224 68 $white "#D4DCE6"
    Draw-MarkShape $ctx $mono $mono $mutedLight -50 -54 0.59
    Draw-Text $ctx "BSD Lab" 324 86 92 "SemiBold" $mono
    Draw-Text $ctx "Brain State Dynamics Lab" 326 178 28 "Medium" $muted
}
Save-Visual $horizontalMono 1180 320 (Join-Path $pngDir "bsd-lockup-horizontal-mono.png")

$stackedLight = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 180 48 400 124 $lightBg $lightBorder
    Draw-MarkShape $ctx $ink $inkSoft $trace 56 22 0.88
    Draw-Text $ctx "BSD Lab" 380 520 108 "SemiBold" $ink "Center"
    Draw-Text $ctx "Brain State Dynamics Lab" 380 620 32 "Medium" $muted "Center"
}
Save-Visual $stackedLight 760 860 (Join-Path $pngDir "bsd-lockup-stacked.png")

$stackedDark = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 180 48 400 124 $darkBg $darkBorder
    Draw-MarkShape $ctx "#F8FAFC" $trace $muted 56 22 0.88
    Draw-Text $ctx "BSD Lab" 380 520 108 "SemiBold" "#F8FAFC" "Center"
    Draw-Text $ctx "Brain State Dynamics Lab" 380 620 32 "Medium" $mutedLight "Center"
}
Save-Visual $stackedDark 760 860 (Join-Path $pngDir "bsd-lockup-stacked-dark.png")

$stackedMono = New-Visual {
    param($ctx)
    Draw-RoundedSquare $ctx 180 48 400 124 $white "#D4DCE6"
    Draw-MarkShape $ctx $mono $mono $mutedLight 56 22 0.88
    Draw-Text $ctx "BSD Lab" 380 520 108 "SemiBold" $mono "Center"
    Draw-Text $ctx "Brain State Dynamics Lab" 380 620 32 "Medium" $muted "Center"
}
Save-Visual $stackedMono 760 860 (Join-Path $pngDir "bsd-lockup-stacked-mono.png")
