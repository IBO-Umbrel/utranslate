$headers = @{
    Authorization = "Bearer YOUR_TOKEN_HERE"
}


$response = Invoke-RestMethod `
    -Uri "http://127.0.0.1:5000/translate" `
    -Method Post `
    -Headers $headers `
    -Body (@{ text = "welcome, read our stories"; source = "en"; target = "uz" } | ConvertTo-Json) `
    -ContentType "application/json"


Write-Output $response