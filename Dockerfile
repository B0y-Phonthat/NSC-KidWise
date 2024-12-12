# Use the official Rasa image as a base
FROM rasa/rasa

# Set the working directory
WORKDIR /rasa

# Copy the Rasa project files to the Docker image
COPY . /rasa

RUN pip install -r requirements.txt

# Train the model
RUN rasa train

# Expose the port that Rasa will run on
EXPOSE 5005

# Run Rasa server
CMD ["run", "--enable-api", "--cors", "*"]