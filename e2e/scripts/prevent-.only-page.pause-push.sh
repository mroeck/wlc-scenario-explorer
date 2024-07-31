#!/bin/sh
if grep -R "test.only" ./tests; then
    echo "🛑🛑🛑🛑 Push aborted: Remove 'test.only' from test files. 🛑🛑🛑🛑"
    exit 1
fi

if grep -R "page.pause" ./tests; then
    echo "🛑🛑🛑🛑 Push aborted: Remove 'page.pause' from test files. 🛑🛑🛑🛑"
    exit 1
fi