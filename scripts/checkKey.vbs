Option Explicit

' Define the registry key and value
Dim registryPath, registryKey, registryValue, wshShell, keyExists
registryPath = "HKEY_CURRENT_USER\Software\MyApp" ' Change this to your desired path
registryKey = "MyKey" ' Change this to your desired key name
registryValue = "MyValue" ' Change this to your desired value

' Create WshShell object
Set wshShell = CreateObject("WScript.Shell")

' Function to check if a registry key exists
Function DoesKeyExist(regPath, keyName)
    On Error Resume Next
    Dim value
    value = wshShell.RegRead(regPath & "\" & keyName)
    DoesKeyExist = (Err.Number = 0)
    On Error GoTo 0
End Function

' Check if the key exists
keyExists = DoesKeyExist(registryPath, registryKey)

If Not keyExists Then
    ' Create the key if it doesn't exist
    On Error Resume Next
    wshShell.RegWrite registryPath & "\" & registryKey, registryValue, "REG_SZ"
    If Err.Number = 0 Then
        WScript.Echo "Registry key created successfully."
    Else
        WScript.Echo "Failed to create registry key: " & Err.Description
    End If
    On Error GoTo 0
Else
    WScript.Echo "Registry key already exists."
End If

' Clean up
Set wshShell = Nothing
