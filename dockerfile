FROM python:3.8-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /pocket_shinx

# Copy the requirements file
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files
COPY . /pocket_shinx

# Expose the port
EXPOSE 5000

# Set the entrypoint
ENTRYPOINT ["python", "app.py"]
