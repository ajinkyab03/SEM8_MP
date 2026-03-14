# Quick Start Guide - Backend

## Backend Fixed! 🎉

All hardcoded paths and configuration issues have been resolved.

## What Was Fixed
✅ Hardcoded absolute paths replaced with relative paths  
✅ Model path inconsistencies fixed  
✅ JWT secret keys now use environment variables  
✅ Cross-platform compatibility ensured  
✅ No linter errors  

## How to Run

### 1. Install Dependencies

**Node.js dependencies** (if not already installed):
```bash
cd backend
npm install
```

**Python dependencies**:
```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Your `.env` file should look like this:
```env
MONGO_URL=mongodb://localhost:27017/PrajwalDB
PORT=5000
JWT_SECRET_KEY=DynamicDevelopers
USER=your_email@gmail.com
APP_PASS=your_app_password
```

**Note**: For email features (contact & password reset), set up Gmail App Password.

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run start-dev
```

The server will start on `http://localhost:5000`

## API Endpoints

- Authentication: `/api/v1/auth/login`, `/api/v1/auth/register`
- Disease Predictions: `/api/v1/diabetes`, `/api/v1/heart`, `/api/v1/kidney`, `/api/v1/liver`, `/api/v1/breast-cancer`
- Image Predictions: `/api/v1/predict-pneumonia`, `/api/v1/predict-malaria`
- Symptoms: `/api/v1/symptoms`
- Users: `/api/v1/users/*`
- Doctors: `/api/v1/doctors/*`
- Bookings: `/api/v1/bookings/*`
- Reviews: `/api/v1/reviews/*`
- Admin: `/api/v1/admin/*`

## Troubleshooting

**"Mongoose connection failed"**
- Make sure MongoDB is running
- Check MONGO_URL in `.env` is correct

**"Python module not found"**
- Install Python dependencies: `pip install -r requirements.txt`
- Make sure Python is in your PATH

**"Cannot find module"**
- Run `npm install` in the backend directory

## Files Modified

See `BACKEND_FIXES_SUMMARY.md` for detailed information about all changes made.

## Support

All hardcoded paths are now relative and OS-independent. The backend should work seamlessly on Windows, Linux, and macOS.

