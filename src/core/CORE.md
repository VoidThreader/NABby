Entire directory can be omitted if you don't want to use AI

Test if the model is running
curl -N -X GET http://localhost:8000/ask -H "Content-Type: application/json" -d '{"prompt": "Hello, how are you?"}'