#!/bin/bash
if [ ${ENV} = "DEV" ]; then
    flask --app app run --host "0.0.0.0"
else
    poetry run gunicorn --config gunicorn_config.py app:app
fi
