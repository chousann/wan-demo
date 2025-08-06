import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { WebauthnService } from './webauthn.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webauthn-demo';
  username = '';
  isAuthenticated = false;
  message = '';

  constructor(
    private authService: AuthService,
    private webauthnService: WebauthnService
  ) {}

  ngOnInit() {
    // Check if user is already authenticated
    const user = localStorage.getItem('webauthn_user');
    if (user) {
      this.isAuthenticated = true;
      this.username = user;
    }
  }

  async register() {
    if (!this.username) {
      this.message = '请输入用户名';
      return;
    }

    try {
      const credential = await this.webauthnService.register(this.username);
      if (credential) {
        await this.authService.verifyRegistration(this.username, credential).toPromise();
        this.message = '注册成功！';
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.message = '注册失败: ' + (error instanceof Error ? error.message : '未知错误');
    }
  }

  async login() {
    // if (!this.username) {
    //   this.message = '请输入用户名';
    //   return;
    // }

    try {
      const credential = await this.webauthnService.login(this.username);
      if (credential) {
        const result: any = await firstValueFrom(this.authService.verifyLogin(this.username, credential));
        if (result.verified) {
          this.isAuthenticated = true;
          localStorage.setItem('webauthn_user', this.username);
          this.message = '登录成功！';
        } else {
          this.message = '登录验证失败';
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      this.message = '登录失败: ' + (error instanceof Error ? error.message : '未知错误');
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.username = '';
    localStorage.removeItem('webauthn_user');
    this.message = '已退出登录';
  }
}