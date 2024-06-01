FROM python:3.12.3-bookworm as base
ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    # pip's configuration:
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # Poetry's configuration:
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR='/var/cache/pypoetry' \
    POETRY_HOME='/usr/local' \
    POETRY_VERSION='1.8.2'
WORKDIR /app
COPY poetry.lock pyproject.toml /app/
RUN pip install poetry
COPY ./app.py /app/

FROM base as prod
RUN poetry install --only main --no-root --no-directory
COPY ./gunicorn_config.py /app/
CMD ["poetry", "run", "gunicorn", "--config", "./gunicorn_config.py", "app:app"]