# StackIt – A Modern Q&A Platform

<div align="center">

![StackIt Logo](https://img.shields.io/badge/StackIt-Q%26A%20Platform-blue?style=for-the-badge&logo=stackoverflow)

**Ask It. StackIt** - A lightweight, community-driven Q&A platform built for seamless knowledge sharing.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11.1-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 📖 Overview

StackIt is a modern, feature-rich question-and-answer platform designed for collaborative learning and structured knowledge sharing. Built with Next.js 15, TypeScript, and Prisma, it provides a seamless experience for asking questions, providing answers, and building a thriving community of learners and developers.

## ✨ Features

### 🔐 Authentication & User Management

- **Multi-provider Authentication**: Sign in with email/password or Google OAuth
- **User Profiles**: Customizable profiles with avatars and activity tracking
- **Role-based Access**: User and Admin roles with different permissions
- **Session Management**: Secure JWT-based authentication with NextAuth.js

### 💬 Q&A Core Features

- **Rich Text Editor**: Advanced editor with TipTap.js supporting:
  - Text formatting (bold, italic, underline, strikethrough)
  - Code blocks with syntax highlighting
  - Headings and lists
  - Images and links
  - Mentions and user tagging
- **Question Management**: Create, edit, and delete questions with tags
- **Answer System**: Provide detailed answers with approval workflow
- **Voting System**: Upvote/downvote answers to highlight quality content
- **Comments**: Threaded discussions on answers with mentions

### 🏷️ Content Organization

- **Tag System**: Categorize questions with custom tags
- **Search & Discovery**: Find questions and answers easily
- **Feed System**: Browse latest questions with pagination
- **User Activity**: Track questions, answers, and comments per user

### 🔔 Notifications & Engagement

- **Real-time Notifications**: Get notified for mentions, answers, and comments
- **Mention System**: Tag users in comments with @username
- **Activity Tracking**: Monitor user engagement and contributions

### 🛡️ Moderation & Admin Features

- **Answer Approval**: Admin-controlled answer approval workflow
- **Content Moderation**: Edit and delete inappropriate content
- **Admin Dashboard**: Comprehensive analytics and user management
- **User Management**: View user statistics and activity

### 📊 Analytics & Insights

- **Content Statistics**: Track questions, answers, and comments
- **Engagement Metrics**: Monitor voting activity and popular tags
- **User Analytics**: Detailed user activity and contribution metrics
- **Visual Charts**: Interactive charts and graphs for data visualization

### 🎨 Modern UI/UX

- **Dark Theme**: Beautiful dark mode interface
- **Responsive Design**: Mobile-first responsive layout
- **Smooth Animations**: Framer Motion powered interactions
- **Modern Components**: Built with Radix UI and Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TipTap.js** - Rich text editor
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Database

- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution
- **bcryptjs** - Password hashing

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ravi0529/StackIt.git
   cd stackit
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/stackit"

   # Authentication
   AUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run database migrations
   pnpm prisma db push
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable               | Description                   | Required |
| ---------------------- | ----------------------------- | -------- |
| `DATABASE_URL`         | PostgreSQL connection string  | Yes      |
| `AUTH_SECRET`          | Secret key for authentication | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID        | Yes      |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret    | Yes      |
| `NEXTAUTH_URL`         | NextAuth.js URL               | Yes      |
| `NEXTAUTH_SECRET`      | NextAuth.js secret            | Yes      |

## 📁 Project Structure

```
StackIt/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Protected app routes
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── feed/          # Questions feed
│   │   │   ├── profile/       # User profiles
│   │   │   ├── question/      # Q&A pages
│   │   │   └── search/        # Search functionality
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   ├── RichTextEditor/   # TipTap editor
│   │   └── ...               # Other components
│   ├── context/              # React contexts
│   ├── lib/                  # Utilities and configs
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper functions
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
└── assets/                   # Project assets
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and profile information
- **Questions**: Main Q&A content with tags
- **Answers**: Responses to questions with approval workflow
- **Comments**: Threaded discussions on answers
- **Votes**: Upvote/downvote system for answers
- **Tags**: Content categorization
- **Notifications**: User engagement tracking
- **AdminPanel**: Moderation and admin actions

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack

# Production
pnpm build        # Build the application
pnpm start        # Start production server

# Database
pnpm prisma generate    # Generate Prisma client
pnpm prisma db push     # Push schema changes to database
pnpm prisma studio      # Open Prisma Studio

# Linting
pnpm lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically detect Next.js

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Write meaningful commit descriptions
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Ravi Mistry** - [mistryravi051005@gmail.com](mailto:mistryravi051005@gmail.com)
- **Govind Gupta** - [govind12771277@gmail.com](mailto:govind12771277@gmail.com)
- **Richa Chauhan** - [chauhanricha2911@gmail.com](mailto:chauhanricha2911@gmail.com)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the team members directly

---

<div align="center">

**Made with ❤️ by the StackIt Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/stackit?style=social)](https://github.com/yourusername/stackit)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/stackit?style=social)](https://github.com/yourusername/stackit)

</div>
