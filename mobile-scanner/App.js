import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { verifyQRCode } from './services/api';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure camera is ready
    if (permission?.granted) {
      console.log('Camera permission granted, initializing camera...');
      const timer = setTimeout(() => {
        setCameraReady(true);
        console.log('Camera ready');
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setCameraReady(false);
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;

    console.log('QR Code scanned:', data);
    setScanned(true);
    setLoading(true);
    setResult(null);

    try {
      const response = await verifyQRCode(data);
      console.log('Verification response:', response);
      setResult(response);
      
      // Show alert
      const title = response.status === 'success' 
        ? '✅ Entry Verified!' 
        : response.status === 'duplicate' 
        ? '⚠️ Already Scanned' 
        : '❌ Invalid QR Code';
      
      let message = '';
      if (response.status === 'success') {
        const { data } = response;
        message = `Name: ${data.fullName}\nCode: ${data.attendeeCode}\nDesignation: ${data.designation}`;

        if (data.maxEntries !== undefined && data.usedEntries !== undefined) {
          message += `\n\nEntries: ${data.usedEntries} of ${data.maxEntries}`;
          if (data.remainingEntries > 0) {
            message += `\nRemaining: ${data.remainingEntries} more can enter with this QR.`;
          } else {
            message += `\nNo more entries allowed with this QR.`;
          }
        }
      } else {
        message = response.message;
      }

      Alert.alert(title, message, [
        { text: 'OK', onPress: resetScanner }
      ]);
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed';
      setResult({
        success: false,
        status: 'error',
        message: errorMessage,
      });
      
      Alert.alert('❌ Error', errorMessage, [
        { text: 'OK', onPress: resetScanner }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setResult(null);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D97706" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.text}>Please enable camera permission</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>🎉 Golden Jubilee</Text>
        <Text style={styles.subtitle}>QR Code Scanner</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned || !cameraReady ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onMountError={(error) => {
            console.error('Camera mount error:', error);
            Alert.alert('Camera Error', 'Failed to start camera. Please restart the app.');
          }}
        />
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.instruction}>
            {loading ? 'Verifying...' : scanned ? 'Scan complete' : 'Point camera at QR code'}
          </Text>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D97706" />
          <Text style={styles.loadingText}>Verifying QR code...</Text>
        </View>
      )}

      {scanned && !loading && (
        <TouchableOpacity 
          style={styles.button}
          onPress={resetScanner}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#D97706',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    minHeight: 400,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 400,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  placeholderText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#D97706',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D97706',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
