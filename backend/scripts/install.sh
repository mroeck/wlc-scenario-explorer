#!/bin/bash
if [ ${ENV} = "DEV" ]; then
    poetry install
else
    poetry install --only main
fi
