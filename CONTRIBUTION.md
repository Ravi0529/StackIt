# Contributing to StackIt

Thank you for your interest in contributing to StackIt! This document provides a comprehensive guide to help you get started with contributing to our Q&A platform.

## 🤝 How to Contribute

We welcome contributions from the community! Whether you're fixing bugs, adding new features, improving documentation, or suggesting ideas, your contributions help make StackIt better for everyone.

### Types of Contributions

- **🐛 Bug Fixes**: Help us squash bugs and improve stability
- **✨ New Features**: Add exciting new functionality to the platform
- **📚 Documentation**: Improve our docs, README, or add helpful comments
- **🎨 UI/UX Improvements**: Enhance the user interface and experience
- **🧪 Testing**: Add tests or improve test coverage
- **🔧 Code Quality**: Refactor code, improve performance, or fix linting issues
- **🌐 Localization**: Help translate the platform to other languages
- **📊 Analytics**: Improve our data tracking and insights

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)
- **pnpm** (recommended) or **npm** - [Install pnpm](https://pnpm.io/installation)

### Step 1: Fork the Repository

1. **Navigate to the StackIt repository** on GitHub
2. **Click the "Fork" button** in the top-right corner
3. **Wait for the forking process** to complete
4. **Clone your forked repository** to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/StackIt.git
cd StackIt
```

### Step 2: Set Up Your Development Environment

1. **Install dependencies**:

```bash
pnpm install
```

2. **Set up environment variables**:
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

3. **Set up the database**:

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma db push
```

4. **Start the development server**:

```bash
pnpm dev
```

5. **Verify everything is working**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Make sure the application loads without errors
   - Test basic functionality like signing up and creating a question

### Step 3: Create a Feature Branch

**Never work directly on the main branch!** Always create a new branch for your changes:

```bash
# Make sure you're on the main branch and it's up to date
git checkout main
git pull origin main

# Create and switch to a new feature branch
git checkout -b feature/your-feature-name
```

**Branch Naming Conventions:**

- `feature/descriptive-feature-name` - For new features
- `fix/descriptive-bug-fix` - For bug fixes
- `docs/description` - For documentation changes
- `refactor/description` - For code refactoring
- `test/description` - For adding or improving tests
- `style/description` - For code style changes

**Examples:**

```bash
git checkout -b feature/user-notification-system
git checkout -b fix/answer-voting-bug
git checkout -b docs/update-contribution-guide
git checkout -b refactor/optimize-database-queries
```

### Step 4: Make Your Changes

1. **Write your code** following our coding standards (see below)
2. **Test your changes** thoroughly
3. **Update documentation** if necessary
4. **Run linting** to ensure code quality:

```bash
pnpm lint
```

### Step 5: Commit Your Changes

Use clear, descriptive commit messages:

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add user notification system

- Implement real-time notifications for mentions
- Add notification preferences in user settings
- Create notification dropdown component
- Add tests for notification functionality

Closes #123"
```

**Commit Message Format:**

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Step 6: Push Your Changes

```bash
git push origin feature/your-feature-name
```

### Step 7: Create a Pull Request

1. **Go to your forked repository** on GitHub
2. **Click "Compare & pull request"** for your feature branch
3. **Fill out the pull request template** with:
   - **Title**: Clear description of your changes
   - **Description**: Detailed explanation of what you've done
   - **Type**: Bug fix, feature, documentation, etc.
   - **Testing**: How you tested your changes
   - **Screenshots**: If applicable (UI changes)

**Example Pull Request Title:**

```
feat: Add user notification system for mentions and answers
```

## 📋 Pull Request Guidelines

### Before Submitting

1. **Ensure your code follows our standards**:

   - Run `pnpm lint` and fix any issues
   - Follow TypeScript best practices
   - Use proper error handling
   - Add appropriate comments for complex logic

2. **Test thoroughly**:

   - Test your changes in different scenarios
   - Ensure no existing functionality is broken
   - Test on different browsers if it's a frontend change

3. **Update documentation**:

   - Update README if you've added new features
   - Add JSDoc comments for new functions
   - Update API documentation if you've modified endpoints

4. **Check the checklist**:
   - [ ] Code follows project style guidelines
   - [ ] Changes are tested thoroughly
   - [ ] Documentation is updated
   - [ ] No new warnings are generated
   - [ ] Tests are added/updated
   - [ ] All tests pass

### Pull Request Review Process

1. **Automated Checks**: Your PR will be automatically checked for:

   - Code linting
   - TypeScript compilation
   - Test suite execution
   - Build success

2. **Code Review**: Team members will review your code for:

   - Code quality and best practices
   - Security considerations
   - Performance implications
   - User experience impact

3. **Feedback**: You may receive feedback requesting changes:

   - Address all feedback promptly
   - Make requested changes in the same branch
   - Push updates to the same PR

4. **Approval**: Once approved, your PR will be merged to the `dev` branch

## 🎯 Development Guidelines

### Code Style

We use **ESLint** and **Prettier** for code formatting. Run these commands:

```bash
# Check for linting issues
pnpm lint

# Fix auto-fixable issues
pnpm lint --fix
```

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define proper types for all functions and variables
- Avoid `any` type - use proper typing
- Use interfaces for object shapes
- Use enums for constants

### Component Guidelines

- Use functional components with hooks
- Follow the existing component structure
- Use TypeScript for all components
- Implement proper error boundaries
- Use proper accessibility attributes

### Database Guidelines

- Use Prisma migrations for schema changes
- Follow naming conventions for tables and fields
- Add proper indexes for performance
- Use transactions for complex operations
- Validate data at the API level

### API Guidelines

- Use RESTful conventions
- Implement proper error handling
- Add input validation
- Use appropriate HTTP status codes
- Add rate limiting where necessary

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests

- Write tests for new features
- Update tests when fixing bugs
- Aim for good test coverage
- Use descriptive test names
- Test both success and error cases

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the bug
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (browser, OS, etc.)
6. **Console errors** if any

## 💡 Feature Requests

When suggesting new features:

1. **Clear description** of the feature
2. **Use case** and benefits
3. **Implementation suggestions** if possible
4. **Mockups or wireframes** if applicable

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** - Contributors section
- **Release notes** - For significant contributions
- **GitHub profile** - Through the contributors graph

---

**Thank you for contributing to StackIt! Your efforts help make this platform better for everyone in the community.** 🚀

<div align="center">

**Happy Coding!** 💻

</div>
