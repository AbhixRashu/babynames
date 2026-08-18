# Generates favicon PNGs, apple-touch-icon and the Open Graph image.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/generate-assets.ps1
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$out = Join-Path $PSScriptRoot '..\public'

function New-RoundedRectPath([int]$x, [int]$y, [int]$w, [int]$h, [int]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function New-HeartIcon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)

  $pink = [System.Drawing.ColorTranslator]::FromHtml('#ec7ba0')
  $blue = [System.Drawing.ColorTranslator]::FromHtml('#5f9be0')
  $white = [System.Drawing.ColorTranslator]::FromHtml('#ffffff')

  $pathObj = New-RoundedRectPath 0 0 $size $size ([int]($size * 0.30))
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, $size, $size)), $pink, $blue, 45)
  $g.FillPath($brush, $pathObj)

  # heart centered ~48% of canvas
  $cx = $size * 0.5
  $cy = $size * 0.52
  $h = $size * 0.46
  $w = $size * 0.52
  $x = $cx - $w / 2
  $y = $cy - $h / 2

  $heart = New-Object System.Drawing.Drawing2D.GraphicsPath
  $heart.StartFigure()
  $heart.AddArc($x, $y, $w / 2, $h / 2, 128, 244)
  $heart.AddArc($x + $w / 2, $y, $w / 2, $h / 2, 168, 244)
  $heart.AddLine($cx + $w / 2, $y + $h / 2 + $h * 0.06, $cx, $y + $h)
  $heart.AddLine($cx, $y + $h, $x + $w / 2, $y + $h / 2 + $h * 0.06)
  $heart.CloseFigure()
  $g.FillPath((New-Object System.Drawing.SolidBrush($white)), $heart)

  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

function New-OgImage([string]$path) {
  $w = 1200; $h = 630
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#faf6f0'))

  $pink = [System.Drawing.ColorTranslator]::FromHtml('#ec7ba0')
  $blue = [System.Drawing.ColorTranslator]::FromHtml('#5f9be0')
  $ink = [System.Drawing.ColorTranslator]::FromHtml('#3a3129')
  $muted = [System.Drawing.ColorTranslator]::FromHtml('#8a7d6f')

  # soft radial glow
  $glow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, 236, 123, 160))
  $g.FillEllipse($glow, -200, -260, 700, 700)
  $glowBlue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 95, 155, 224))
  $g.FillEllipse($glowBlue, 760, -180, 700, 700)

  # heart graphic centered above text
  $hs = 210
  $hx = $w / 2 - $hs / 2
  $hy = 40
  $heartBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle($hx, $hy, $hs, $hs)), $pink, $blue, 45)
  $heart = New-Object System.Drawing.Drawing2D.GraphicsPath
  $heart.StartFigure()
  $heart.AddArc($hx, $hy, $hs / 2, $hs / 2, 128, 244)
  $heart.AddArc($hx + $hs / 2, $hy, $hs / 2, $hs / 2, 168, 244)
  $heart.AddLine($hx + $hs / 2, $hy + $hs / 2 + $hs * 0.06, $hx + $hs / 2, $hy + $hs)
  $heart.AddLine($hx + $hs / 2, $hy + $hs, $hx + $hs / 2, $hy + $hs / 2 + $hs * 0.06)
  $heart.CloseFigure()
  $g.FillPath($heartBrush, $heart)

  # title
  $fontTitle = New-Object System.Drawing.Font('Segoe UI', 56, [System.Drawing.FontStyle]::Bold)
  $fontSub = New-Object System.Drawing.Font('Segoe UI', 24)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near

  $titleRect = New-Object System.Drawing.RectangleF(0, 290, $w, 80)
  $g.DrawString('BabyNames', $fontTitle, (New-Object System.Drawing.SolidBrush($ink)), $titleRect, $format)

  $subRect = New-Object System.Drawing.RectangleF(0, 396, $w, 50)
  $g.DrawString('Find the perfect baby name — meanings, origins & more', $fontSub, (New-Object System.Drawing.SolidBrush($muted)), $subRect, $format)

  # footer pills
  $pillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#f6efe6'))
  $pillFmt = New-Object System.Drawing.StringFormat
  $pillFmt.Alignment = [System.Drawing.StringAlignment]::Center
  $pillFmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $fontPill = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Bold)
  $items = @('Boy names', 'Girl names', 'Unisex names', '100% free')
  $totalW = 680
  $x0 = $w / 2 - $totalW / 2
  $pw = 155; $gap = 20
  for ($i = 0; $i -lt $items.Count; $i++) {
    $px = $x0 + $i * ($pw + $gap)
    $g.FillRectangle($pillBrush, $px, 480, $pw, 52)
    $rect = New-Object System.Drawing.RectangleF($px, 480, $pw, 52)
    $g.DrawString($items[$i], $fontPill, (New-Object System.Drawing.SolidBrush($ink)), $rect, $pillFmt)
  }

  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

New-HeartIcon 32 (Join-Path $out 'icon-32.png')
New-HeartIcon 96 (Join-Path $out 'icon-96.png')
New-HeartIcon 512 (Join-Path $out 'icon-512.png')
New-HeartIcon 180 (Join-Path $out 'apple-touch-icon.png')
New-OgImage (Join-Path $out 'og.png')

Write-Output 'Assets generated: icon-32.png, icon-96.png, icon-512.png, apple-touch-icon.png, og.png'