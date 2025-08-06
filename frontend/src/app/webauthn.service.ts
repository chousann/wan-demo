import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor(private authService: AuthService) { }

  async register(username: string): Promise<any> {
    // Get registration options from server
    const options: any = await this.authService.getRegistrationOptions(username).toPromise();
    
    // Convert challenge and user ID to ArrayBuffer
    options.challenge = this.base64UrlToArrayBuffer(options.challenge);
    options.user.id = this.base64UrlToArrayBuffer(options.user.id);
    
    // Process pubKeyCredParams if needed
    if (options.pubKeyCredParams) {
      options.pubKeyCredParams = options.pubKeyCredParams.map((param: any) => {
        return {
          ...param
        };
      });
    }
    
    try {
      // Create credential using WebAuthn API
      const credential = await navigator.credentials.create({ publicKey: options }) as any;
      
      // Convert credential response to serializable format
      const serializedCredential = {
        id: credential.id,
        rawId: this.arrayBufferToBase64Url(credential.rawId),
        response: {
          attestationObject: this.arrayBufferToBase64Url(credential.response.attestationObject),
          clientDataJSON: this.arrayBufferToBase64Url(credential.response.clientDataJSON),
          publicKey: credential.response.getPublicKey ? 
            this.arrayBufferToBase64Url(credential.response.getPublicKey()) : null,
          publicKeyAlgorithm: credential.response.getPublicKeyAlgorithm ? 
            credential.response.getPublicKeyAlgorithm() : null,
          counter: 0
        },
        type: credential.type
      };
      
      return serializedCredential;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(username: string): Promise<any> {
    // Get login options from server
    const options: any = await this.authService.getLoginOptions(username).toPromise();
    
    // Convert challenge to ArrayBuffer
    options.challenge = this.base64UrlToArrayBuffer(options.challenge);
    
    // Convert allowCredentials IDs to ArrayBuffer
    if (options.allowCredentials) {
      options.allowCredentials = options.allowCredentials.map((cred: any) => {
        return {
          ...cred,
          id: this.base64UrlToArrayBuffer(cred.id)
        };
      });
    }
    
    try {
      // Get credential using WebAuthn API
      const credential = await navigator.credentials.get({ publicKey: options }) as any;
      
      // Convert credential response to serializable format
      const serializedCredential = {
        id: credential.id,
        rawId: this.arrayBufferToBase64Url(credential.rawId),
        response: {
          authenticatorData: this.arrayBufferToBase64Url(credential.response.authenticatorData),
          clientDataJSON: this.arrayBufferToBase64Url(credential.response.clientDataJSON),
          signature: this.arrayBufferToBase64Url(credential.response.signature),
          userHandle: credential.response.userHandle ? 
            this.arrayBufferToBase64Url(credential.response.userHandle) : null
        },
        type: credential.type
      };
      
      return serializedCredential;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  private base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/').replace(/=/g, '');
    
    // Add padding if needed
    const padLength = (4 - (base64.length % 4)) % 4;
    const paddedBase64 = base64 + '='.repeat(padLength);
    
    try {
      const binaryString = atob(paddedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (e) {
      console.error('Failed to decode base64 string:', base64Url);
      throw e;
    }
  }

  private arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    // Convert base64 to base64url
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}