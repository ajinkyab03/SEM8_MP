# Backend Setup Guide

## Issues Fixed

All hardcoded paths have been fixed to use relative paths. The following files were updated:

### Fixed Files:
1. **Routes/disease.js** - Fixed all hardcoded paths for Python scripts and models
2. **Routes/healthPredict.js** - Fixed hardcoded paths for symptoms prediction
3. **Routes/forgot-password.js** - Fixed hardcoded JWT secret key
4. **Python Scripts** (predict.py, heart.py, kidney.py, liver.py, breast-cancer.py, pneumonia.py, malaria.py, symptoms.py) - Fixed model paths to use relative paths

### Key Changes:
- Replaced absolute paths like `D:\\AI-MedLab-main\\backend\\` with relative paths using `__dirname`
- Fixed Python model paths from `./ai-models/` to `./aimodels/`
- Updated all file path references to be OS-independent

## Environment Setup

1. **Install Python Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Install Node Dependencies**:
```bash
npm install
```

3. **Configure Environment Variables**:
Create a `.env` file in the backend directory with the following:
```env
MONGO_URL=mongodb://localhost:27017/ai-medlab
PORT=8000
JWT_SECRET_KEY=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRES_IN=7d
USER=your_email@gmail.com
APP_PASS=your_app_password
```

**Note**: For email functionality (contact form and password reset), you need to:
- Use Gmail
- Generate an App Password from your Google Account settings
- Set the USER and APP_PASS environment variables

4. **Ensure MongoDB is Running**:
Make sure MongoDB is installed and running on your system.

5. **Start the Server**:
```bash
npm start
# or for development with auto-reload:
npm run start-dev
```

## Project Structure

- **aimodels/**: Contains all trained ML models (.pkl and .h5 files)
- **Controllers/**: Request handlers for different features
- **Routes/**: Route definitions
- **models/**: Mongoose schema definitions
- **HealthPredict/**: CSV files for symptom prediction
- **public/uploads/**: Directory for uploaded images
- **Python Scripts**: ML prediction scripts

## API Endpoints

- `/api/v1/auth/*` - Authentication routes
- `/api/v1/users/*` - User management
- `/api/v1/doctors/*` - Doctor management
- `/api/v1/reviews/*` - Review management
- `/api/v1/bookings/*` - Booking management
- `/api/v1/*` - Disease prediction routes (diabetes, heart, kidney, liver, breast-cancer)
- `/api/v1/*` - Image prediction routes (pneumonia, malaria)
- `/api/v1/*` - Symptom prediction route
- `/api/v1/admin/*` - Admin routes
- `/api/v1/*` - Contact and forgot-password routes

## Testing

Make sure all Python dependencies are installed and MongoDB is running before starting the server.

