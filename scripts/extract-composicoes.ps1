Add-Type -AssemblyName System.IO.Compression.FileSystem

$UF = "PR"
$OutputCsv = "scripts/composicoes_temp.csv"
$UF_COL = @{
    AC="E"; AL="G"; AM="I"; AP="K"; BA="M"; CE="O"; DF="Q"; ES="S"
    GO="U"; MA="W"; MG="Y"; MS="AA"; MT="AC"; PA="AE"; PB="AG"; PE="AI"
    PI="AK"; PR="AM"; RJ="AO"; RN="AQ"; RO="AS"; RR="AU"; RS="AW"; SC="AY"
    SE="BA"; SP="BC"; TO="BE"
}
$priceCol = $UF_COL[$UF]

$xlsxFile = (Get-ChildItem "scripts\*.xlsx" | Select-Object -First 1).FullName
Write-Host "File: $xlsxFile | UF: $UF | PriceCol: $priceCol"

$zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxFile)

# Load shared strings
$ssEntry = $zip.GetEntry("xl/sharedStrings.xml")
$ssReader = New-Object System.IO.StreamReader($ssEntry.Open())
$ssXml = $ssReader.ReadToEnd(); $ssReader.Close()
$strings = [System.Collections.Generic.List[string]]::new()
foreach ($m in ([regex]'<t[^>]*>([^<]*)<\/t>').Matches($ssXml)) { $strings.Add($m.Groups[1].Value) }
Write-Host "Shared strings: $($strings.Count)"

# Load full sheet XML
$sheetEntry = $zip.GetEntry("xl/worksheets/sheet6.xml")
$sheetReader = New-Object System.IO.StreamReader($sheetEntry.Open())
$sheetXml = $sheetReader.ReadToEnd(); $sheetReader.Close()
$zip.Dispose()
Write-Host "Sheet XML: $([Math]::Round($sheetXml.Length/1MB,1)) MB. Splitting rows..."

$writer = New-Object System.IO.StreamWriter($OutputCsv, $false, [System.Text.Encoding]::UTF8)
$writer.WriteLine("codigo,descricao,unidade,preco")

$cellRegex = [regex]'<c r="([A-Z]+)\d+"([^>]*)>(.*?)<\/c>'
$fRegex    = [regex]'<f[^>]*>([^<]*)<\/f>'
$vRegex    = [regex]'<v>([^<]*)<\/v>'
$codeRegex = [regex]',\s*(\d{4,7})\s*\)'

# Split on </row> to get individual row chunks
$rowChunks = $sheetXml -split '</row>'
Write-Host "Row chunks: $($rowChunks.Count)"
$written = 0

foreach ($chunk in $rowChunks) {
    # Find where <row starts
    $rowStart = $chunk.IndexOf('<row ')
    if ($rowStart -lt 0) { continue }
    $rowXml = $chunk.Substring($rowStart) + '</row>'

    if ($rowXml -notmatch '<row r="(\d+)"') { continue }
    $rowNum = [int]$Matches[1]
    if ($rowNum -le 10) { continue }

    $cells = @{}
    foreach ($cm in $cellRegex.Matches($rowXml)) {
        $col = $cm.Groups[1].Value
        $attrs = $cm.Groups[2].Value
        $inner = $cm.Groups[3].Value
        $fMatch = $fRegex.Match($inner)
        $vMatch = $vRegex.Match($inner)
        $rawVal = if ($vMatch.Success) { $vMatch.Groups[1].Value } else { "" }
        if ($fMatch.Success) { $cells["${col}_f"] = $fMatch.Groups[1].Value }
        if ($attrs -match 't="s"' -and $rawVal -match '^\d+$') {
            $cells[$col] = $strings[[int]$rawVal]
        } else {
            $cells[$col] = $rawVal
        }
    }

    $formula = $cells["B_f"]
    $codigo = ""
    if ($formula) {
        $cm2 = $codeRegex.Match($formula)
        if ($cm2.Success) { $codigo = $cm2.Groups[1].Value }
    }

    $descricao = if ($cells["C"]) { $cells["C"].Replace('"','""').Trim() } else { "" }
    $unidade   = if ($cells["D"]) { $cells["D"].Trim() } else { "" }
    $preco     = if ($cells[$priceCol]) { $cells[$priceCol] } else { "0" }

    if (-not $codigo -or -not $descricao -or $codigo -notmatch '^\d') { continue }

    $writer.WriteLine("""$codigo"",""$descricao"",""$unidade"",""$preco""")
    $written++
    if ($written % 1000 -eq 0) { Write-Host "  $written rows written..." }
}

$writer.Close()
Write-Host "Done! $written rows -> $OutputCsv"
