# GES Workbench
 
A modern web application built with Next.js, React, and TypeScript, featuring authentication, data visualization, and a robust component library.
 
## 🚀 Features
 
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Firebase Authentication
- Microsoft Authentication (MSAL)
- Shadcn UI components
- React Query for data fetching
- Zustand for state management
- Recharts for data visualization
- Husky for Git hooks
- ESLint for code quality
 
## 📋 Prerequisites
 
Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git
 
## 🛠️ Installation
 
1. Clone the repository:
```bash
git clone [your-repository-url]
cd ges-workbench
```
 
2. Install dependencies:
```bash
npm install
# or
yarn install
```
 
3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
 
# Microsoft Authentication
NEXT_PUBLIC_AZURE_CLIENT_ID=your_client_id
NEXT_PUBLIC_AZURE_AUTHORITY=your_authority
NEXT_PUBLIC_AZURE_REDIRECT_URI=your_redirect_uri
```
 
4. Initialize Git hooks:
```bash
npm run prepare
```
 
## 🚀 Development
 
To start the development server:
 
```bash
npm run dev
# or
yarn dev
```
 
The application will be available at `http://localhost:3000`


## 📦 Build and Production
 
To build the application for production:
 
```bash
npm run build
# or
yarn build
```
 
To start the production server:
 
```bash
npm run start
# or
yarn start
```
 
## 🧪 Testing
 
To run linting:
 
```bash
npm run lint
# or
yarn lint
```
 
## 📁 Project Structure
 
```
src/
├── app/          # Next.js app router pages
├── components/   # Reusable UI components
├── config/       # Configuration files
├── hooks/        # Custom React hooks
├── lib/          # Utility libraries
├── store/        # Zustand store
├── styles/       # Global styles
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```
 
## 🔧 Tech Stack
 
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Authentication**: Firebase & MSAL
- **Data Visualization**: Recharts
- **Code Quality**: ESLint, Husky
