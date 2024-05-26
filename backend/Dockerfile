FROM python:3.12.3-bookworm
EXPOSE 5000
ARG ENV
ENV ENV=${ENV} \
    PYTHONFAULTHANDLER=1 \
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
WORKDIR /code


COPY poetry.lock pyproject.toml /code/

RUN pip install poetry && poetry install --only main --no-root --no-directory

COPY ./app.py /code

COPY ./scripts/install.sh install.sh
RUN chmod u+x install.sh && ./install.sh

COPY ./scripts/start.sh start.sh
RUN chmod u+x start.sh

CMD ["./start.sh"]