# Mathematics for Economics I Quiz Application

## Project Overview

This is a React-based quiz application designed for "Mathematics for Economics - I" course. The application provides an interactive platform for students to practice questions from the NPTEL course, organized by year and week. It features a responsive design with dark mode support, question randomization, and comprehensive quiz functionality.

## Key Technologies

- **Frontend**: React 19.2.0
- **Routing**: React Router DOM 7.9.4
- **State Management**: React Context API with useReducer
- **Styling**: Tailwind CSS (via class names)
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier
- **Deployment**: Netlify, GitHub Pages (via CI/CD)
- **Build Tool**: Create React App (react-scripts 5.0.1)

## Project Structure

```
mathematics_for_economics_i/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       └── ci-cd.yml
├── public/                     # Static assets
│   ├── index.html
│   └── questions.json          # Quiz data
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── AppRouter.jsx       # Routing component
│   │   ├── OptionButton.jsx    # Memoized option button
│   │   └── QuizComponent.jsx   # Main quiz component
│   ├── context/                # State management
│   │   └── QuizContext.jsx     # Context provider for app state
│   ├── utils/                  # Utility functions
│   │   └── validation.js       # Data validation utilities
│   ├── App.jsx                 # Main application component
│   ├── App.test.jsx            # Test file
│   └── index.jsx               # Application entry point
├── .eslintrc                   # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .prettierignore             # Prettier ignore rules
├── .prettierrc                 # Prettier configuration
├── netlify.toml                # Netlify deployment config
├── package.json                # Dependencies and scripts
└── QWEN.md                     # This documentation file
```

## Features

1. **Quiz Management**:
   - Year and week selection
   - Question randomization
   - Score tracking
   - Progress visualization

2. **User Experience**:
   - Dark/light mode toggle with system preference detection
   - Responsive design for all screen sizes
   - Keyboard navigation support
   - Accessibility features (ARIA attributes)

3. **State Management**:
   - Centralized state using React Context
   - Proper error handling and loading states
   - Data validation and sanitization

4. **Navigation**:
   - React Router for proper URL routing
   - Back navigation support
   - URL parameters for direct question access

## Building and Running

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Running in Development
```bash
npm start
```
The application will be available at http://localhost:3000

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Code Quality Commands
```bash
# Lint the code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## Development Conventions

1. **Component Structure**:
   - Main logic in QuizContext for state management
   - Presentational components in the components/ directory
   - Separate utils for validation and helper functions

2. **State Management**:
   - Uses React Context with useReducer for global state
   - Follows unidirectional data flow
   - Actions are defined with clear actionTypes

3. **Accessibility**:
   - ARIA attributes for screen readers
   - Keyboard navigation support
   - Semantic HTML elements
   - Proper focus management

4. **Code Quality**:
   - ESLint with react-app configuration
   - Prettier for consistent formatting
   - Comprehensive test coverage with Jest and React Testing Library
   - JSDoc-style comments for exported functions/components

## Important Files

- `src/App.jsx`: Main application component that loads questions and manages global state
- `src/context/QuizContext.jsx`: Centralized state management using Context API and useReducer
- `src/components/QuizComponent.jsx`: Main quiz UI with all quiz functionality
- `public/questions.json`: Contains all quiz questions organized by year and week
- `package.json`: Defines dependencies, scripts, and project metadata
- `.github/workflows/ci-cd.yml`: GitHub Actions configuration for CI/CD pipeline
- `.eslintrc`: ESLint configuration for code quality
- `netlify.toml`: Netlify deployment configuration

## Deployment

The application is configured for deployment on both Netlify and GitHub Pages:

1. **Netlify**: Uses `netlify.toml` configuration
2. **GitHub Pages**: CI/CD workflow publishes to GitHub Pages on main branch

## Testing

The application includes comprehensive testing:
- Jest for JavaScript testing
- React Testing Library for component testing
- Mocked fetch API for testing data loading
- Test coverage reports

## Environment

The application is designed to work in a development environment with hot reloading and production environment with optimized builds. Error boundaries and proper loading states ensure a good user experience in different network conditions.