# 🚀 Angular Template Example

A comprehensive Angular 20+ template project featuring modern authentication, dashboard, and responsive design patterns. Built with the latest Angular features including standalone components, signals, and the new control flow syntax.

## ✨ Features

### 🔐 **Authentication System**
- **Login & Registration**: Complete authentication flow with reactive forms
- **Route Guards**: Protected routes with auth and guest guards
- **Signal-based State**: Modern reactive state management
- **Demo Credentials**: Any email with password `123456`

### 📊 **Dashboard & Analytics**
- **Welcome Section**: Personalized greeting with user information
- **Stats Cards**: Interactive metrics with hover animations
- **Quick Actions**: Smooth gradient buttons with loading states
- **Recent Activity**: Real-time activity tracking
- **System Status**: Live system health indicators

### 👤 **User Management**
- **Profile Management**: Editable user profiles with avatar upload
- **Account Settings**: Security preferences and two-factor authentication
- **Team Management**: User role and permission handling

### 🎨 **UI/UX Design**
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Material Design**: Angular Material components with custom theming
- **Smooth Animations**: 60fps animations with CSS transitions
- **Dark Mode Ready**: Optimized for light and dark themes

### 🏗️ **Modern Architecture**
- **Standalone Components**: Latest Angular architecture
- **Lazy Loading**: Code-splitting for optimal performance
- **Signal-based State**: Reactive programming with Angular signals
- **TypeScript Strict**: Full type safety throughout the application

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                    # Core application services
│   │   ├── guards/              # Route protection
│   │   │   └── auth.guard.ts    # Authentication guards
│   │   └── services/            # Application services
│   │       └── auth.service.ts  # Authentication service with signals
│   │
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication components
│   │   │   ├── login.component.*    # Login page
│   │   │   └── register.component.* # Registration page
│   │   ├── dashboard/           # Dashboard components
│   │   │   └── dashboard.component.* # Main dashboard
│   │   └── profile/             # User profile
│   │       └── profile.component.*   # Profile management
│   │
│   ├── shared/                  # Shared components
│   │   └── layouts/             # Layout components
│   │       ├── auth-layout.component.*  # Auth pages layout
│   │       └── main-layout.component.*  # Main app layout
│   │
│   ├── app.config.ts           # Application configuration
│   ├── app.routes.ts           # Route definitions
│   ├── app.ts                  # Root component
│   └── main.ts                 # Bootstrap file
│
├── styles.scss                 # Global styles
└── index.html                  # Entry point
```

## 🛠️ Tech Stack

### **Core Framework**
- **Angular 20+**: Latest Angular with standalone components
- **TypeScript**: Strict type checking and modern ES features
- **RxJS**: Reactive programming for async operations

### **UI Framework**
- **Angular Material**: Material Design components
- **TailwindCSS v4**: Utility-first CSS framework
- **Custom Theming**: Azure and blue color palettes

### **Architecture Patterns**
- **Signals**: Modern reactive state management
- **Standalone Components**: No NgModules required
- **Lazy Loading**: Route-based code splitting
- **Reactive Forms**: Form validation and handling

### **Development Tools**
- **Angular CLI 20.1.0**: Latest tooling and scaffolding
- **PostCSS**: CSS processing and optimization
- **ESLint**: Code quality and consistency

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- Angular CLI 20+

```bash
npm install -g @angular/cli
```

### **Installation**

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ng-template-example
npm install
```

2. **Start development server:**
```bash
ng serve
```

3. **Open your browser:**
Navigate to `http://localhost:4200/`

### **Demo Login**
- **Email**: Any valid email format
- **Password**: `123456`

## 📱 Responsive Design

The application is fully responsive with breakpoints optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

Features adaptive layouts for sidebar navigation, dashboard grids, and form layouts.

## 🎯 Key Components

### **Authentication Service (`auth.service.ts`)**
```typescript
// Modern signal-based authentication
const user = signal<User | null>(null);
const isAuthenticated = computed(() => !!user());

login(credentials: LoginRequest): Observable<User>
register(userData: RegisterRequest): Observable<User>
logout(): void
updateProfile(profile: Partial<User>): Observable<User>
```

### **Dashboard Component**
- **Stats Display**: Dynamic metric cards with animations
- **Quick Actions**: Gradient buttons with loading states
- **Activity Feed**: Real-time updates and notifications
- **System Monitoring**: Health status indicators

### **Layout System**
- **Main Layout**: Responsive sidebar with navigation
- **Auth Layout**: Centered forms with background patterns
- **Mobile Navigation**: Collapsible drawer with touch gestures

## 🧪 Development Commands

### **Development Server**
```bash
ng serve                 # Start dev server
ng serve --open          # Start and open browser
ng serve --port 4300     # Custom port
```

### **Building**
```bash
ng build                 # Development build
ng build --prod          # Production build
ng build --watch         # Watch mode
```

### **Code Generation**
```bash
ng generate component my-component         # Generate component
ng generate service my-service            # Generate service
ng generate guard my-guard                # Generate guard
ng generate --help                        # See all options
```

### **Testing**
```bash
ng test                  # Unit tests with Karma
ng test --watch=false    # Single run
ng e2e                   # End-to-end tests
```

### **Code Quality**
```bash
ng lint                  # Run ESLint
ng build --analyze       # Bundle analysis
```

## 🔧 Configuration

### **Environment Setup**
The project uses Angular's modern configuration approach:

- **`app.config.ts`**: Application providers and configuration
- **`app.routes.ts`**: Route definitions with lazy loading
- **`angular.json`**: Build and project configuration
- **`tailwind.config.js`**: TailwindCSS customization

### **Styling Architecture**
```scss
// Global styles (styles.scss)
@import 'tailwindcss';
@import '@angular/material/theming';

// Component styles
.component-class {
  // Custom SCSS with TailwindCSS utilities
}
```

## 📊 Performance Optimizations

### **Bundle Optimization**
- **Lazy Loading**: Route-based code splitting
- **Tree Shaking**: Unused code elimination  
- **OnPush Strategy**: Optimized change detection
- **Standalone Components**: Reduced bundle size

### **Animation Performance**
- **Hardware Acceleration**: CSS will-change property
- **60fps Animations**: Optimized transitions with cubic-bezier
- **Reduced Repaints**: Transform-based animations

## 🚦 Routing Strategy

### **Route Structure**
```typescript
const routes: Routes = [
  { path: 'auth', loadComponent: () => AuthLayoutComponent },
  { path: 'dashboard', loadComponent: () => DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => ProfileComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
```

### **Guard Implementation**
- **Auth Guard**: Protects authenticated routes
- **Guest Guard**: Redirects authenticated users
- **Role-based Guards**: Permission-based access control

## 🎨 Design System

### **Color Palette**
- **Primary**: Azure blue variants
- **Accent**: Material blue tones
- **Background**: Gradient combinations
- **Text**: High contrast ratios

### **Typography**
- **Font Family**: System font stack
- **Scale**: Material Design type scale
- **Weight**: 400, 500, 600, 700

### **Spacing System**
- **TailwindCSS**: Consistent spacing scale
- **Grid System**: CSS Grid and Flexbox
- **Responsive**: Mobile-first breakpoints

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Real-time notifications with WebSocket
- [ ] Advanced role-based permissions
- [ ] Data visualization with charts
- [ ] Offline support with service workers
- [ ] Multi-language internationalization (i18n)
- [ ] Advanced form builders
- [ ] File upload and management
- [ ] Integration with backend APIs

### **Technical Improvements**
- [ ] Unit test coverage expansion
- [ ] E2E test automation
- [ ] Performance monitoring
- [ ] Accessibility (a11y) enhancements
- [ ] PWA capabilities
- [ ] SSR/SSG with Angular Universal

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

### **Code Standards**
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add unit tests for new features
- Ensure responsive design compatibility

## 📚 Learning Resources

### **Angular Documentation**
- [Angular Official Docs](https://angular.dev) - Latest Angular features
- [Angular CLI Reference](https://angular.dev/tools/cli) - Command line tools
- [Angular Material](https://material.angular.io) - Material Design components

### **Related Technologies**
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [RxJS](https://rxjs.dev) - Reactive programming library
- [TypeScript](https://www.typescriptlang.org) - Typed JavaScript

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Material Design team for the component library
- TailwindCSS for the utility framework
- Open source community for inspiration and contributions

---

**Built with ❤️ using Angular 20+ and modern web technologies**
