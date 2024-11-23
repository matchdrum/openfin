Option Explicit

' Check if arguments are provided
If WScript.Arguments.Count < 3 Then
    WScript.Echo "Usage: cscript scriptname.vbs <RegistryKey> <ValueName> <ValueData>"
    WScript.Quit 1
End If

' Retrieve arguments
Dim strRegistryKey, strValueName, strValueData
strRegistryKey = WScript.Arguments(0) ' The registry key path
strValueName = WScript.Arguments(1)   ' The name of the value
strValueData = WScript.Arguments(2)   ' The data for the value

' Constants for registry hive selection
Const HKEY_CLASSES_ROOT = &H80000000
Const HKEY_CURRENT_USER = &H80000001
Const HKEY_LOCAL_MACHINE = &H80000002
Const HKEY_USERS = &H80000003
Const HKEY_CURRENT_CONFIG = &H80000005

' Create WScript Shell object
Dim objShell
Set objShell = CreateObject("WScript.Shell")

' Try to write to the registry
On Error Resume Next
objShell.RegWrite strRegistryKey & "\" & strValueName, strValueData, "REG_SZ"

' Check for errors
If Err.Number <> 0 Then
    WScript.Echo "Failed to write to the registry. Error: " & Err.Description
    Err.Clear
    WScript.Quit 1
Else
    WScript.Echo "Registry key updated successfully."
End If

' Cleanup
Set objShell = Nothing
