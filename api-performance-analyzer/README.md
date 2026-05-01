# 🚀 API Performance Analyzer

A comprehensive SaaS tool for monitoring, analyzing, and tracking the performance of your API endpoints in real-time.

## ✨ Features

- ✅ **Add & Monitor API Endpoints** - Track multiple APIs simultaneously
- ✅ **Real-Time Performance Metrics** - Response time, status codes, error rates
- ✅ **Interactive Dashboard** - Beautiful charts and analytics
- ✅ **Alert System** - Get notified of slow APIs or errors
- ✅ **Performance History** - Track trends over time
- ✅ **Background Jobs** - Celery + Redis for reliable monitoring
- ✅ **Full-Stack Application** - React frontend + Django backend

## 🛠️ Tech Stack

### Backend
- **Django** - Web framework
- **Django REST Framework** - REST API
- **PostgreSQL** - Database
- **Celery** - Async task queue
- **Redis** - Message broker & cache

### Frontend
- **React** - UI library
- **Recharts** - Charts & visualization
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Docker & Docker Compose
- Git
- (Optional) Python 3.11+, Node.js 18+

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/api-performance-analyzer.git
   cd api-performance-analyzer
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

4. **Create superuser for admin panel**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy .env file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django development server
python manage.py runserver

# In another terminal, start Celery
celery -A config worker -l info

# In another terminal, start Celery Beat (scheduler)
celery -A config beat -l info
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

Make sure PostgreSQL and Redis are running locally:
```bash
# PostgreSQL (if using local)
createdb api_monitor_db

# Redis
redis-server
```

## 📖 API Endpoints

### Endpoints
- `GET /api/monitor/endpoints/` - List all endpoints
- `POST /api/monitor/endpoints/` - Create new endpoint
- `GET /api/monitor/endpoints/{id}/` - Get endpoint details
- `PUT /api/monitor/endpoints/{id}/` - Update endpoint
- `DELETE /api/monitor/endpoints/{id}/` - Delete endpoint
- `POST /api/monitor/endpoints/{id}/activate_monitoring/` - Activate monitoring
- `POST /api/monitor/endpoints/{id}/pause_monitoring/` - Pause monitoring
- `GET /api/monitor/endpoints/{id}/performance_history/` - Get performance history
- `GET /api/monitor/endpoints/{id}/stats/` - Get statistics

### Metrics
- `GET /api/monitor/metrics/` - List all metrics
- `GET /api/monitor/metrics/recent/` - Get recent metrics
- `GET /api/monitor/metrics/alerts/` - Get alert metrics

### Alerts
- `GET /api/monitor/alerts/` - List all alerts
- `POST /api/monitor/alerts/{id}/acknowledge/` - Acknowledge alert
- `POST /api/monitor/alerts/{id}/resolve/` - Resolve alert
- `GET /api/monitor/alerts/active/` - Get active alerts

### Dashboard
- `GET /api/dashboard/summary/` - Get dashboard summary
- `GET /api/dashboard/trending/` - Get trending data

## 🎯 How to Use

1. **Add an Endpoint**
   - Navigate to "Add Endpoint" tab
   - Fill in endpoint details (URL, method, headers, body)
   - Set alert threshold (ms)
   - Click "Add Endpoint"

2. **Monitor Performance**
   - Go to "Endpoints" tab
   - View real-time metrics for each endpoint
   - Expand endpoint card to see detailed history

3. **View Alerts**
   - Check "Alerts" tab for active alerts
   - Acknowledge or resolve alerts
   - Configure alert thresholds per endpoint

4. **Analyze Trends**
   - View dashboard with charts
   - See 24-hour performance trends
   - Track error rates and response times

## 📊 Database Schema

### APIEndpoint
- id (PK)
- name
- url (unique)
- method (GET, POST, PUT, DELETE, PATCH)
- status (active, inactive, paused)
- headers (JSON)
- body (JSON)
- alert_threshold_ms
- created_at
- updated_at

### PerformanceMetric
- id (PK)
- endpoint (FK)
- response_time_ms
- status_code
- error_message
- is_alert
- timestamp

### Alert
- id (PK)
- endpoint (FK)
- metric (FK)
- alert_type (slow_response, error, timeout)
- status (triggered, resolved, acknowledged)
- message
- triggered_at
- resolved_at

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=api_monitor_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
CELERY_BROKER_URL=redis://localhost:6379
CELERY_RESULT_BACKEND=redis://localhost:6379
MONITORING_INTERVAL=60
ALERT_THRESHOLD_MS=1000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8000
```

## 🧪 Testing

```bash
# Run Django tests
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## 📈 Performance Tips

1. **Database Indexing** - Already optimized with indexes on frequently queried fields
2. **Pagination** - API results are paginated (50 per page)
3. **Celery Tasks** - Background monitoring doesn't block requests
4. **Redis Caching** - Results cached for better performance

## 🚢 Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use PostgreSQL in production (not SQLite)
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Set up proper logging
- [ ] Configure backup strategy

### Deploy with Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Deploy with Docker

```bash
docker build -f Dockerfile.backend -t api-monitor-backend .
docker run -p 8000:8000 api-monitor-backend
```

## 📝 License

MIT License - feel free to use this project for your portfolio!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

Created with ❤️ for developers

## 📞 Support

For issues and questions, please open a GitHub issue.

## 🎓 Learning Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

⭐ If you found this helpful, please give it a star!