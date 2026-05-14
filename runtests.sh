#!/bin/bash
set -e

echo "\n=== Lint Frontend ==="
cd frontend/app && npm run lint

echo "\n=== Tests Frontend ==="
npm run test:run -- --reporter=verbose && CI=true npm run test:e2e

echo "\n=== Build Frontend ==="
npm run build
cd ../../

echo "\n=== Build Backend ==="
cd backend && dotnet build

echo "\n=== Formatage Backend ==="
dotnet format --verify-no-changes

echo "\n=== Tests Backend ==="
dotnet test --logger "console;verbosity=detailed"