include .env.db
export

.PHONY: help install dev build start db-up db-down db-reset db-logs lint type-check clean db-connect api-start hubble-start dev-full status

# Default target
help:
	@echo "🚀 Hubble Test Local Development Environment"
	@echo ""
	@echo "📊 Database commands:"
	@echo "  db-up      - Start PostgreSQL and pgAdmin"
	@echo "  db-down    - Stop database services"
	@echo "  db-reset   - Reset database (removes all data)"
	@echo "  db-logs    - View database logs"
	@echo "  db-connect - Connect to database with psql"
	@echo "  db-status  - Check database health"
	@echo ""
	@echo "🔧 API Development:"
	@echo "  api-start  - Start Charon API locally (separate terminal)"
	@echo "  api-test   - Test Charon API connection"
	@echo ""
	@echo "🌐 Frontend Development:"
	@echo "  hubble-start - Start Hubble frontend (separate terminal)"
	@echo "  hubble-build - Build Hubble for production"
	@echo ""
	@echo "🎯 Full Development:"
	@echo "  dev-full   - Start complete development environment"
	@echo "  status     - Check status of all services"
	@echo "  stop-all   - Stop all services"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  clean      - Clean build artifacts"
	@echo "  install    - Install dependencies"

# Database management
db-up:
	@echo "🚀 Starting database services..."
	docker-compose up -d postgres pgadmin
	@echo "⏳ Waiting for database to be ready..."
	@until docker-compose exec postgres pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} 2>/dev/null; do \
		echo "   Still waiting for database..."; \
		sleep 2; \
	done
	@echo ""
	@echo "✅ Database services started successfully!"
	@echo ""
	@echo "📊 PostgreSQL: localhost:5432"
	@echo "   Database: ${POSTGRES_DB}"
	@echo "   User: ${POSTGRES_USER}"
	@echo "   Password: ${POSTGRES_PASSWORD}"
	@echo ""
	@echo "🔧 pgAdmin: http://localhost:5050"
	@echo "   Email: ${PGADMIN_DEFAULT_EMAIL}"
	@echo "   Password: ${PGADMIN_DEFAULT_PASSWORD}"
	@echo ""
	@echo "🎯 Next steps:"
	@echo "   1. Run 'make api-start' in a new terminal"
	@echo "   2. Run 'make hubble-start' in another terminal"

db-down:
	@echo "🛑 Stopping database services..."
	docker-compose down -v
	@echo "✅ Database services stopped"

db-reset:
	@echo "🔄 Resetting database..."
	make db-down
	make db-up
	@echo "✅ Database reset complete!"

db-logs:
	docker-compose logs -f postgres

db-status:
	@echo "🔍 Checking database status..."
	@if docker-compose exec postgres pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} 2>/dev/null; then \
		echo "✅ Database is ready"; \
	else \
		echo "❌ Database is not ready"; \
	fi
	@echo ""
	@docker-compose ps

db-connect:
	@echo "🔌 Connecting to database..."
	PGPASSWORD=${POSTGRES_PASSWORD} psql -h localhost -p 5432 -U ${POSTGRES_USER} -d ${POSTGRES_DB}

# API Development (runs charon-beta locally)
api-start:
	@echo "🚀 Starting Charon API locally..."
	@echo "📍 Make sure database is running first (make db-up)"
	@echo ""
	@if ! docker-compose exec postgres pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} 2>/dev/null; then \
		echo "❌ Database is not ready. Run 'make db-up' first."; \
		exit 1; \
	fi
	@echo "✅ Database is ready, starting Charon API..."
	@echo "🌐 API will be available at: http://localhost:3000/api/v1"
	@echo "📚 API docs will be available at: http://localhost:3000/api-docs"
	@echo ""
	cd ../../charon-beta && \
	PGHOST=localhost \
	PGDATABASE=${POSTGRES_DB} \
	PGUSER=${POSTGRES_USER} \
	PGPASSWORD=${POSTGRES_PASSWORD} \
	PGPORT=5432 \
	NODE_ENV=development \
	npm run start:dev

api-test:
	@echo "🧪 Testing Charon API connection..."
	@if curl -s http://localhost:3000/health > /dev/null; then \
		echo "✅ Charon API is responding"; \
		curl -s http://localhost:3000/health | jq . 2>/dev/null || curl -s http://localhost:3000/health; \
	else \
		echo "❌ Charon API is not responding"; \
		echo "   Make sure it's running with 'make api-start'"; \
	fi

# Frontend Development (Hubble)
hubble-start:
	@echo "🌐 Starting Hubble frontend..."
	@echo "📍 Make sure Charon API is running first (make api-start)"
	@echo ""
	@if ! curl -s http://localhost:3000/health > /dev/null; then \
		echo "⚠️  Warning: Charon API might not be running"; \
		echo "   Run 'make api-start' in another terminal first"; \
		echo ""; \
	fi
	@echo "🌐 Hubble will be available at: http://localhost:3001"
	@echo ""
	cd ../ && \
	NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
	npm run dev -- --port 3001

hubble-build:
	@echo "🏗️  Building Hubble for production..."
	cd ../ && \
	NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
	npm run build

# Full Development Environment
dev-full:
	@echo "🎯 Setting up full development environment..."
	@echo ""
	@echo "Step 1: Starting database..."
	make db-up
	@echo ""
	@echo "✅ Database is ready!"
	@echo ""
	@echo "🎯 Development environment setup complete!"
	@echo ""
	@echo "📋 Next steps (run each in a separate terminal):"
	@echo "   Terminal 2: make api-start"
	@echo "   Terminal 3: make hubble-start"
	@echo ""
	@echo "🌐 URLs:"
	@echo "   Hubble Frontend: http://localhost:3001"
	@echo "   Charon API: http://localhost:3000/api/v1"
	@echo "   API Docs: http://localhost:3000/api-docs"
	@echo "   pgAdmin: http://localhost:5050"
	@echo "   Database: localhost:5432"

status:
	@echo "🔍 Development Environment Status"
	@echo "================================"
	@echo ""
	@echo "📊 Database:"
	@if docker-compose exec postgres pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} 2>/dev/null; then \
		echo "   ✅ PostgreSQL: Running (localhost:5432)"; \
	else \
		echo "   ❌ PostgreSQL: Not running"; \
	fi
	@if curl -s http://localhost:5050 > /dev/null 2>&1; then \
		echo "   ✅ pgAdmin: Running (http://localhost:5050)"; \
	else \
		echo "   ❌ pgAdmin: Not running"; \
	fi
	@echo ""
	@echo "🔧 API:"
	@if curl -s http://localhost:3000/health > /dev/null 2>&1; then \
		echo "   ✅ Charon API: Running (http://localhost:3000)"; \
	else \
		echo "   ❌ Charon API: Not running"; \
	fi
	@echo ""
	@echo "🌐 Frontend:"
	@if curl -s http://localhost:3001 > /dev/null 2>&1; then \
		echo "   ✅ Hubble: Running (http://localhost:3001)"; \
	else \
		echo "   ❌ Hubble: Not running"; \
	fi

stop-all:
	@echo "🛑 Stopping all services..."
	make db-down
	@echo "✅ All services stopped"

# Maintenance
install:
	@echo "📦 Installing dependencies..."
	cd ../ && npm install
	cd ../../charon-beta && npm install
	@echo "✅ Dependencies installed"

clean:
	@echo "🧹 Cleaning build artifacts..."
	cd ../ && rm -rf .next node_modules/.cache
	@echo "✅ Clean complete"

