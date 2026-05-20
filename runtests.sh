#!/bin/bash
set -e

echo "\n=== Lint Frontend ==="
cd frontend/app && npm run lint
sleep 2
echo "=== Fin Lint F ==="

echo "\n=== Tests Frontend ==="
npm run test:run -- --reporter=verbose && CI=true npm run test:e2e
sleep 2
echo "=== Fin Tests F ==="

echo "\n=== Build Frontend ==="
npm run build
sleep 2
echo "=== Fin Build F ==="
cd ../../

echo "\n=== Build Backend ==="
cd backend && dotnet build
sleep 2
echo "=== Fin Build B ==="

echo "\n=== Formatage Backend ==="
dotnet format --verify-no-changes
sleep 2
echo "=== Fin formatage ==="

echo "\n=== Tests Backend ==="
dotnet test --logger "console;verbosity=detailed"
sleep 2
echo "=== Fin Tests B ==="