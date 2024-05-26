#!/bin/bash
if [ ${ENV} = "DEV" ]; then
    # poetry run python app.py
    # flask run --host "0.0.0.0"
    flask --app app run --host "0.0.0.0"
else
    # temp:
    poetry run python app.py
fi
