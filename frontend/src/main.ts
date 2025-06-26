import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container">
      <header>
        <h1>🚀 Railway Full Stack Template</h1>
        <p>Template completo com FastAPI + Angular + PostgreSQL + Redis</p>
      </header>

      <div class="cards">
        <div class="card">
          <h2>⚡ Backend Status</h2>
          <div class="status" [class.online]="backendStatus?.api === 'online'">
            <p><strong>API:</strong> {{ backendStatus?.api || 'checking...' }}</p>
            <p><strong>Database:</strong> {{ backendStatus?.database || 'checking...' }}</p>
            <p><strong>Redis:</strong> {{ backendStatus?.redis || 'checking...' }}</p>
          </div>
          <button (click)="checkBackend()" [disabled]="loading">
            {{ loading ? 'Verificando...' : 'Verificar Status' }}
          </button>
        </div>

        <div class="card">
          <h2>👥 Usuários</h2>
          <div *ngIf="users?.length > 0; else noUsers">
            <div *ngFor="let user of users" class="user">
              <strong>{{ user.name }}</strong><br>
              <small>{{ user.email }}</small>
            </div>
          </div>
          <ng-template #noUsers>
            <p>Carregando usuários...</p>
          </ng-template>
          <button (click)="loadUsers()" [disabled]="loading">
            Carregar Usuários
          </button>
        </div>

        <div class="card">
          <h2>📊 Cache Redis</h2>
          <div *ngIf="cacheResult">
            <p><strong>Chave:</strong> {{ cacheResult.key }}</p>
            <p><strong>Valor:</strong> {{ cacheResult.value }}</p>
          </div>
          <button (click)="testCache()" [disabled]="loading">
            Testar Cache
          </button>
        </div>
      </div>

      <footer>
        <p>✨ Deploy automático com GitHub Actions</p>
        <a href="https://github.com/your-repo" target="_blank">Ver Código Fonte</a>
      </footer>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      color: white;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
    }

    header h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .card {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 2rem;
      border: 1px solid rgba(255,255,255,0.2);
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .status {
      padding: 1rem;
      border-radius: 8px;
      background: rgba(255,255,255,0.1);
      margin-bottom: 1rem;
    }

    .status.online {
      background: rgba(76, 175, 80, 0.3);
      border: 1px solid #4CAF50;
    }

    .user {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      background: rgba(255,255,255,0.1);
      border-radius: 5px;
    }

    button {
      background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
      width: 100%;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.2);
    }

    footer a {
      color: #4ECDC4;
      text-decoration: none;
      font-weight: bold;
    }

    footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class App {
  backendStatus: any = null;
  users: any[] = [];
  cacheResult: any = null;
  loading = false;

  constructor(private http: HttpClient) {
    this.checkBackend();
    this.loadUsers();
  }

  checkBackend() {
    this.loading = true;
    const apiUrl = this.getApiUrl();
    
    this.http.get(`${apiUrl}/health`).subscribe({
      next: (data) => {
        this.backendStatus = data;
        this.loading = false;
      },
      error: (error) => {
        this.backendStatus = { api: 'offline', error: error.message };
        this.loading = false;
      }
    });
  }

  loadUsers() {
    this.loading = true;
    const apiUrl = this.getApiUrl();
    
    this.http.get<any>(`${apiUrl}/api/users`).subscribe({
      next: (data) => {
        this.users = data.users || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
      }
    });
  }

  testCache() {
    this.loading = true;
    const apiUrl = this.getApiUrl();
    const testData = { timestamp: new Date().toISOString(), message: 'Hello from cache!' };
    
    // Primeiro, define um valor no cache
    this.http.post(`${apiUrl}/api/cache/test-key`, testData).subscribe({
      next: () => {
        // Depois, busca o valor
        this.http.get<any>(`${apiUrl}/api/cache/test-key`).subscribe({
          next: (data) => {
            this.cacheResult = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erro ao buscar cache:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erro ao definir cache:', error);
        this.loading = false;
      }
    });
  }

  private getApiUrl(): string {
    // Em produção, usar a variável de ambiente
    // Em desenvolvimento local, usar localhost
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:8000'
      : `https://${window.location.hostname.replace('frontend', 'backend')}`;
  }
}

bootstrapApplication(App, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));