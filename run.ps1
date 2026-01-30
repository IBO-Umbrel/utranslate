$headers = @{
    "X-API-Key" = "utranslate_0ec7d501ee8f01cf14b84b7d289f6cd2bd4ed2b006f0a83ebbf92a0bb5490c0b"
}


$response = Invoke-RestMethod `
    -Uri "http://127.0.0.1:5000/translate" `
    -Method Post `
    -Headers $headers `
    -Body (@{ text = "welcome, read our stories"; source = "en"; target = "uz" } | ConvertTo-Json) `
    -ContentType "application/json"


Write-Output $response