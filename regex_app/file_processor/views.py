from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import UploadedFile
from django.conf import settings
from .serializers import UploadedFileSerializer

import pandas as pd
import openai
import re


def convert_natural_language_to_regex(natural_language):
    openai.api_key = settings.OPENAI_API_KEY
    
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Convert the following natural language description into a regex pattern and provide a default replacement value: '{natural_language}'",
        max_tokens=150,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response_text = response.choices[0].text.strip()
    pattern, replacement = response_text.split("Replacement: ")
    return pattern.strip(), replacement.strip()


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=201)
        else:
            return Response(file_serializer.errors, status=400)


class RegexProcessView(APIView):
    def post(self, request, *args, **kwargs):
        natural_language = request.data.get("pattern")
        file_id = request.data.get("file_id")
        
        regex_pattern, replacement = convert_natural_language_to_regex(natural_language)
        
        file_instance = UploadedFile.objects.get(id=file_id)
        df = pd.read_excel(file_instance.file.path) if file_instance.file.name.endswith('.xlsx') else pd.read_csv(file_instance.file.path)
        
        for column in df.select_dtypes(include=['object']).columns:
            df[column] = df[column].apply(lambda x: re.sub(regex_pattern, replacement, x))
            
        processed_file_path = 'processed_file.csv'
        df.to_csv(processed_file_path, index=False)

        return Response({"message": "File processed successfully", "processed_file": processed_file_path, "regex_pattern": regex_pattern, "replacement": replacement})
