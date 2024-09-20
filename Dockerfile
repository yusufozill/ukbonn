# Tamplate python image
FROM python:3.9.20-slim-bullseye

# working directory
WORKDIR /app

# copy files
COPY main.py .
COPY requirements.txt .


# dependencies
RUN pip install numpy 

# run
CMD ["python", "main.py"] 