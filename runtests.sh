#!/bin/bash
set -e

echo "=== Lint Frontend ==="
cd frontend/app && npm run lint

echo "=== Tests Frontend ==="
npm run test:run -- --reporter=verbose && CI=true npm run test:e2e

echo "=== Build Frontend ==="
npm run build
cd ../../

echo "=== Build Backend ==="
cd backend && dotnet build

echo "=== Formatage Backend ==="
dotnet format --verify-no-changes

echo "=== Tests Backend ==="
dotnet test --logger "console;verbosity=detailed"