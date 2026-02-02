# Phase 3 Quick Verification Script
# Run this to verify Phase 3 implementation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Phase 3 Verification Checklist" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check files exist
Write-Host "📁 Checking files..." -ForegroundColor Yellow
$files = @(
    "src\utils\xmlBuilder.ts",
    "src\utils\bpmnConverter.ts",
    "src\components\toolbar\Toolbar.tsx",
    "src\components\toolbar\Toolbar.css",
    "src\components\toolbar\XmlPreviewModal.tsx",
    "src\components\toolbar\XmlPreviewModal.css",
    "PHASE3_COMPLETE.md",
    "PHASE3_TECHNICAL_REPORT.md",
    "PHASE3_TESTING_GUIDE.md",
    "PHASE3_SUMMARY.md"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file MISSING" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Check build
Write-Host "🔨 Checking build..." -ForegroundColor Yellow
$buildResult = & npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Build successful" -ForegroundColor Green
    # Extract bundle size
    $bundleSize = ($buildResult | Select-String "assets/index-.*\.js\s+(\d+\.\d+ [kK][bB])").Matches[0].Groups[1].Value
    Write-Host "  📦 Bundle size: $bundleSize" -ForegroundColor Cyan
} else {
    Write-Host "  ❌ Build failed" -ForegroundColor Red
    $allFilesExist = $false
}

Write-Host ""

# Check dependencies
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$hasSyntaxHighlighter = $packageJson.dependencies.'react-syntax-highlighter' -ne $null
if ($hasSyntaxHighlighter) {
    Write-Host "  ✅ react-syntax-highlighter installed" -ForegroundColor Green
} else {
    Write-Host "  ❌ react-syntax-highlighter missing" -ForegroundColor Red
    $allFilesExist = $false
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allFilesExist -and $LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Phase 3 Implementation: VERIFIED" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run: npm run dev" -ForegroundColor White
    Write-Host "  2. Open: http://localhost:5173/" -ForegroundColor White
    Write-Host "  3. Test: Follow PHASE3_TESTING_GUIDE.md" -ForegroundColor White
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor Yellow
    Write-Host "  - PHASE3_COMPLETE.md         (User guide)" -ForegroundColor White
    Write-Host "  - PHASE3_TECHNICAL_REPORT.md (Technical details)" -ForegroundColor White
    Write-Host "  - PHASE3_TESTING_GUIDE.md    (Test cases)" -ForegroundColor White
    Write-Host "  - PHASE3_SUMMARY.md          (Overview)" -ForegroundColor White
} else {
    Write-Host "  ❌ Phase 3 Implementation: ISSUES FOUND" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please review the errors above." -ForegroundColor Yellow
}
Write-Host ""
